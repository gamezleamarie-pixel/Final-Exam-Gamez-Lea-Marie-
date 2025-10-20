<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/User.php';

class AuthController
{
    private $conn;
    private $user;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->connect();
        $this->user = new User($this->conn);
    }

    public function register($data)
    {
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$name || !$email || !$password) {
            return ['success' => false, 'message' => 'All fields are required.'];
        }

        $existing = $this->user->findByEmail($email);
        if ($existing) {
            return ['success' => false, 'message' => 'Email already registered.'];
        }

        $ok = $this->user->create($name, $email, $password, 'customer');
        if ($ok) {
            return ['success' => true, 'message' => 'Registration successful!'];
        }
        return ['success' => false, 'message' => 'Failed to register.'];
    }

    public function login($data)
    {
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            return ['success' => false, 'message' => 'Email and password are required.'];
        }

        $user = $this->user->findByEmail($email);
        if (!$user || !password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => 'Invalid credentials.'];
        }

        session_start();
        $_SESSION['user'] = [
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role']
        ];

        return [
            'success' => true,
            'message' => 'Login successful.',
            'user' => $_SESSION['user']
        ];
    }

    public function logout()
    {
        session_start();
        session_destroy();
        return ['success' => true, 'message' => 'Logged out successfully.'];
    }

    public function getCurrentUser()
    {
        session_start();
        if (isset($_SESSION['user'])) {
            return ['success' => true, 'user' => $_SESSION['user']];
        }
        return ['success' => true, 'user' => null];
    }

    public function ensureAdmin()
    {
        $adminEmail = "admin@salon.com";
        $existingAdmin = $this->user->findByEmail($adminEmail);
        if (!$existingAdmin) {
            $this->user->create("Admin", $adminEmail, "admin123", "admin");
        }
    }
}

header('Content-Type: application/json');
$controller = new AuthController();
$controller->ensureAdmin();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $body = json_decode(file_get_contents("php://input"), true);

    switch ($action) {
        case 'register':
            echo json_encode($controller->register($body));
            break;
        case 'login':
            echo json_encode($controller->login($body));
            break;
        case 'logout':
            echo json_encode($controller->logout());
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid POST action.']);
    }
}

if ($method === 'GET') {
    if ($action === 'me') {
        echo json_encode($controller->getCurrentUser());
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid GET action.']);
    }
}
?>
