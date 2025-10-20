<?php
require_once __DIR__ . '/../app/config/Database.php';
require_once __DIR__ . '/../app/core/Response.php';
require_once __DIR__ . '/../app/models/User.php';

$db = (new Database())->connect();
$userModel = new User($db);
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') exit;

$body = json_decode(file_get_contents('php://input'), true);
$path = $_SERVER['REQUEST_URI'];
$parts = explode('/', $path);
$action = end($parts);


if (!$db) {
    Response::json([
        'error' => 'Database connection failed. Please ensure MySQL is running and salon_db exists.'
    ], 500);
}

try {
    $db->query("SELECT role FROM users LIMIT 1");
} catch (Exception $e) {
    try {
        $db->exec("ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'customer'");
    } catch (Exception $e2) 
        Response::json(['error' => 'Database migration failed: missing users.role'], 500);
    }
}

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

$adminEmail = "admin@gmail.com";
$existingAdmin = $userModel->findByEmail($adminEmail);
if (!$existingAdmin) {
    $userModel->create("Admin", $adminEmail, "admin123", "admin");
} else {
    $hash = password_hash("admin123", PASSWORD_BCRYPT);
    $stmt = $db->prepare("UPDATE users SET role = 'admin', password = :password WHERE email = :email");
    $stmt->execute([':password' => $hash, ':email' => $adminEmail]);
}

if ($action === 'register' && $method === 'POST') {
    $name = trim($body['name'] ?? '');
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';
    $confirmPassword = $body['confirmPassword'] ?? null;

    if (!$name || !$email || !$password) Response::json(['error' => 'Missing fields'], 400);
    if ($confirmPassword !== null && $password !== $confirmPassword) Response::json(['error' => 'Passwords do not match'], 400);
    if ($userModel->findByEmail($email)) Response::json(['error' => 'Email already used'], 400);

    $ok = $userModel->create($name, $email, $password, 'customer');
    if ($ok) Response::json(['message' => 'Registered successfully']);
    Response::json(['error' => 'Unable to register'], 500);
}

if ($action === 'login' && $method === 'POST') {
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';
    if (!$email || !$password) Response::json(['error' => 'Missing fields'], 400);

    $user = $userModel->findByEmail($email);
    if (!$user) Response::json(['error' => 'Invalid credentials'], 401);
    $verified = password_verify($password, $user['password']);

    if (!$verified) {
        $looksPlain = !preg_match('/^\$2y\$/', (string)$user['password']);
        if ($looksPlain && hash_equals((string)$user['password'], (string)$password)) {
            $newHash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $db->prepare("UPDATE users SET password = :password WHERE id = :id");
            $stmt->execute([':password' => $newHash, ':id' => $user['id']]);
            $verified = true;
        }
    }

    if (!$verified) Response::json(['error' => 'Invalid credentials'], 401);

    session_start();
    $_SESSION['user'] = [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ];
    Response::json(['message' => 'Logged in', 'user' => $_SESSION['user']]);
}

if ($action === 'logout') {
    session_start();
    session_destroy();
    Response::json(['message' => 'Logged out']);
}

if ($action === 'me') {
    session_start();
    if (!isset($_SESSION['user'])) Response::json(['user' => null]);
    Response::json(['user' => $_SESSION['user']]);
}
