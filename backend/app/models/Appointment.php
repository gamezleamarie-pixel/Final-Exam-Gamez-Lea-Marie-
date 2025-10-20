<?php
class Appointment {
    private $conn;
    private $table = "appointments";

    public $id;
    public $user_id;
    public $client_name;
    public $service;
    public $date;
    public $time;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function all(array $filters = []) {
        $sql = "SELECT a.*, u.name AS user_name, u.email AS user_email 
                FROM {$this->table} a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE 1=1";

        if (!empty($filters['search'])) {
            $sql .= " AND (a.client_name LIKE :search OR a.service LIKE :search)";
        }
        if (!empty($filters['status'])) {
            $sql .= " AND a.status = :status";
        }
        if (!empty($filters['start_date'])) {
            $sql .= " AND a.date >= :start_date";
        }
        if (!empty($filters['end_date'])) {
            $sql .= " AND a.date <= :end_date";
        }

        $sort = $filters['sort'] ?? 'date';
        $order = strtoupper($filters['order'] ?? 'DESC');
        $allowedSort = ['date','client_name','service','status','time'];
        if (!in_array($sort, $allowedSort)) $sort = 'date';
        $order = $order === 'ASC' ? 'ASC' : 'DESC';
        $sql .= " ORDER BY a.$sort $order";

        $limit = isset($filters['limit']) ? (int)$filters['limit'] : 0;
        $offset = isset($filters['offset']) ? (int)$filters['offset'] : 0;
        if ($limit > 0) {
            $sql .= " LIMIT :limit";
            if ($offset > 0) $sql .= " OFFSET :offset";
        }

        $stmt = $this->conn->prepare($sql);

        if (!empty($filters['search'])) {
            $stmt->bindValue(':search', '%' . $filters['search'] . '%');
        }
        if (!empty($filters['status'])) {
            $stmt->bindValue(':status', $filters['status']);
        }
        if (!empty($filters['start_date'])) {
            $stmt->bindValue(':start_date', $filters['start_date']);
        }
        if (!empty($filters['end_date'])) {
            $stmt->bindValue(':end_date', $filters['end_date']);
        }
        if ($limit > 0) {
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            if ($offset > 0) $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function allForUser(int $userId, array $filters = []) {
        $sql = "SELECT * FROM {$this->table} WHERE user_id = :user_id";

        if (!empty($filters['search'])) {
            $sql .= " AND client_name LIKE :search";
        }
        if (!empty($filters['status'])) {
            $sql .= " AND status = :status";
        }

        $sql .= " ORDER BY date DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':user_id', $userId);

        if (!empty($filters['search'])) {
            $stmt->bindValue(':search', '%' . $filters['search'] . '%');
        }
        if (!empty($filters['status'])) {
            $stmt->bindValue(':status', $filters['status']);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create(array $data) {
        $stmt = $this->conn->prepare("
            INSERT INTO {$this->table} 
            (user_id, client_name, service, date, time, status)
            VALUES (:user_id, :client_name, :service, :date, :time, :status)
        ");
        return $stmt->execute([
            ':user_id' => $data['user_id'],
            ':client_name' => $data['client_name'],
            ':service' => $data['service'],
            ':date' => $data['date'],
            ':time' => $data['time'],
            ':status' => $data['status'] ?? 'Pending'
        ]);
    }

    public function update(int $id, array $data) {
        $allowed = ['client_name','service','date','time','status','payment_method'];
        $sets = [];
        $params = [':id' => $id];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $sets[] = "$col = :$col";
                $params[":$col"] = $data[$col];
            }
        }
        if (empty($sets)) return false;
        $sql = "UPDATE {$this->table} SET " . implode(', ', $sets) . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params);
    }

    public function find(int $id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function delete(int $id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }

    public function cancel(int $id) {
        $stmt = $this->conn->prepare("
            UPDATE {$this->table} SET status = 'Cancelled' WHERE id = :id
        ");
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }

    public function summaryCounts(array $filters = []) {
        $sql = "SELECT 
                    COUNT(*) AS total,
                    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
                    SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
                    SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled
                FROM {$this->table} a WHERE 1=1";
        if (!empty($filters['start_date'])) $sql .= " AND a.date >= :start_date";
        if (!empty($filters['end_date'])) $sql .= " AND a.date <= :end_date";
        $stmt = $this->conn->prepare($sql);
        if (!empty($filters['start_date'])) $stmt->bindValue(':start_date', $filters['start_date']);
        if (!empty($filters['end_date'])) $stmt->bindValue(':end_date', $filters['end_date']);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function countByService(array $filters = []) {
        $sql = "SELECT service, COUNT(*) AS cnt
                FROM {$this->table} a
                WHERE 1=1";
        if (!empty($filters['start_date'])) $sql .= " AND a.date >= :start_date";
        if (!empty($filters['end_date'])) $sql .= " AND a.date <= :end_date";
        $sql .= " GROUP BY service HAVING cnt > 0 ORDER BY cnt DESC";
        $stmt = $this->conn->prepare($sql);
        if (!empty($filters['start_date'])) $stmt->bindValue(':start_date', $filters['start_date']);
        if (!empty($filters['end_date'])) $stmt->bindValue(':end_date', $filters['end_date']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function monthlyCounts(int $year) {
        $sql = "SELECT MONTH(date) AS month, COUNT(*) AS cnt
                FROM {$this->table}
                WHERE YEAR(date) = :year
                GROUP BY MONTH(date)
                ORDER BY MONTH(date)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':year', $year, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function countsByUser(bool $includeUsersWithZero = false) {
        if ($includeUsersWithZero) {
            $sql = "SELECT u.id, u.name, u.email, COUNT(a.id) AS cnt
                    FROM users u
                    LEFT JOIN {$this->table} a ON a.user_id = u.id
                    GROUP BY u.id, u.name, u.email
                    ORDER BY cnt DESC";
        } else {
            $sql = "SELECT u.id, u.name, u.email, COUNT(a.id) AS cnt
                    FROM {$this->table} a
                    INNER JOIN users u ON a.user_id = u.id
                    GROUP BY u.id, u.name, u.email
                    ORDER BY cnt DESC";
        }
        $stmt = $this->conn->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function searchAdvanced(array $filters = []) {
        $sql = "SELECT a.*, u.name AS user_name, u.email AS user_email
                FROM {$this->table} a
                LEFT JOIN users u ON u.id = a.user_id
                WHERE 1=1";
        if (!empty($filters['q'])) $sql .= " AND (a.client_name LIKE :q OR a.service LIKE :q OR u.name LIKE :q)";
        if (!empty($filters['start_date'])) $sql .= " AND a.date >= :start_date";
        if (!empty($filters['end_date'])) $sql .= " AND a.date <= :end_date";
        if (!empty($filters['status'])) $sql .= " AND a.status = :status";
        $sql .= " ORDER BY a.date DESC, a.time DESC";
        $stmt = $this->conn->prepare($sql);
        if (!empty($filters['q'])) $stmt->bindValue(':q', '%' . $filters['q'] . '%');
        if (!empty($filters['start_date'])) $stmt->bindValue(':start_date', $filters['start_date']);
        if (!empty($filters['end_date'])) $stmt->bindValue(':end_date', $filters['end_date']);
        if (!empty($filters['status'])) $stmt->bindValue(':status', $filters['status']);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
