<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5178'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../app/core/Response.php';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (preg_match('#/(register|login|logout|me)$#', $path)) {
    require_once __DIR__ . '/../routes/auth.php';
    exit;
}

if (strpos($path, '/appointments') !== false) {
    require_once __DIR__ . '/../routes/appointments.php';
    exit;
}

Response::json(['message' => 'Salon API running'], 200);
