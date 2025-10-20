<?php
class Database {

    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = getenv('DB_HOST') ?: '127.0.0.1';
        $this->port = (int)(getenv('DB_PORT') ?: 3306);
        $this->db_name = getenv('DB_NAME') ?: 'salon_db';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
    }

    public function connect() {
        $this->conn = null;
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {

            $primaryError = $e->getMessage();
            if ($this->host === '127.0.0.1' && (int)$this->port === 3306) {
                try {
                    $fallbackPort = 3307;
                    $dsn2 = "mysql:host={$this->host};port={$fallbackPort};dbname={$this->db_name};charset=utf8mb4";
                    $this->conn = new PDO($dsn2, $this->username, $this->password);
                    $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    $this->port = $fallbackPort;
                } catch (PDOException $e2) {
                    error_log('DB connection failed (3306): ' . $primaryError);
                    error_log('DB connection failed (3307): ' . $e2->getMessage());
                    return null;
                }
            } else {
                error_log('DB connection failed: ' . $primaryError);
                return null;
            }
        }
        return $this->conn;
    }
}