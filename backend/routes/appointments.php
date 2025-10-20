<?php
require_once __DIR__ . '/../app/config/Database.php';
require_once __DIR__ . '/../app/core/Response.php';
require_once __DIR__ . '/../app/models/Appointment.php';
require_once __DIR__ . '/../app/models/User.php';

$db = (new Database())->connect();
$appModel = new Appointment($db);
$userModel = new User($db);

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') exit;

$body = json_decode(file_get_contents('php://input'), true);
$path = $_SERVER['REQUEST_URI'];
$parts = explode('/', trim($path,'/'));
$last = end($parts);

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

session_start();
$logged = $_SESSION['user'] ?? null;


if ($method === 'GET') {
    if (strpos($path, '/appointments/analytics/summary') !== false) {
        $filters = [];
        if (isset($_GET['start_date'])) $filters['start_date'] = $_GET['start_date'];
        if (isset($_GET['end_date'])) $filters['end_date'] = $_GET['end_date'];
        Response::json($appModel->summaryCounts($filters));
    }

    if (strpos($path, '/appointments/analytics/by-service') !== false) {
        $filters = [];
        if (isset($_GET['start_date'])) $filters['start_date'] = $_GET['start_date'];
        if (isset($_GET['end_date'])) $filters['end_date'] = $_GET['end_date'];
        Response::json($appModel->countByService($filters));
    }

    if (preg_match('#/appointments/analytics/monthly/(\d{4})$#', $path, $m)) {
        $year = (int)$m[1];
        Response::json($appModel->monthlyCounts($year));
    }

    if (strpos($path, '/appointments/analytics/by-user') !== false) {
        $includeZero = isset($_GET['includeZero']) && $_GET['includeZero'] == '1';
        Response::json($appModel->countsByUser($includeZero));
    }

    if (strpos($path, '/appointments/search') !== false) {
        $filters = [];
        foreach (['q','start_date','end_date','status'] as $k) if (isset($_GET[$k])) $filters[$k] = $_GET[$k];
        Response::json($appModel->searchAdvanced($filters));
    }
}

if ($method === 'GET') {
    if (!$logged) Response::json(['error' => 'Unauthorized'], 401);

    $filters = [];
    if (isset($_GET['search'])) $filters['search'] = trim($_GET['search']);
    if (isset($_GET['status'])) $filters['status'] = trim($_GET['status']);
    if (isset($_GET['start_date'])) $filters['start_date'] = trim($_GET['start_date']);
    if (isset($_GET['end_date'])) $filters['end_date'] = trim($_GET['end_date']);
    if (isset($_GET['sort'])) $filters['sort'] = trim($_GET['sort']);
    if (isset($_GET['order'])) $filters['order'] = trim($_GET['order']);
    if (isset($_GET['limit'])) $filters['limit'] = (int)$_GET['limit'];
    if (isset($_GET['offset'])) $filters['offset'] = (int)$_GET['offset'];

    if ($logged['role'] === 'admin') {
        $rows = $appModel->all($filters);
    } else {
        $rows = $appModel->allForUser($logged['id'], $filters);
    }
    Response::json($rows);
}

if ($method === 'POST') {
    if (!$logged) Response::json(['error'=>'Unauthorized'],401);
    $required = ['client_name','service','date','time'];
    foreach ($required as $f) if (empty($body[$f])) Response::json(['error'=>"Missing $f"],400);

    $data = [
        'user_id' => $logged['id'],
        'client_name' => $body['client_name'],
        'service' => $body['service'],
        'date' => $body['date'],
        'time' => $body['time'],
        'status' => 'Pending'
    ];
    $ok = $appModel->create($data);
    if ($ok) Response::json(['message'=>'Created'],201);
    Response::json(['error'=>'Create failed'],500);
}

if ($method === 'PUT') {
    $id = intval($last);
    if (!$id) Response::json(['error'=>'Invalid id'],400);
    if (!$logged) Response::json(['error'=>'Unauthorized'],401);

    $appt = $appModel->find($id);
    if (!$appt) Response::json(['error'=>'Not found'],404);
    if ($logged['role'] !== 'admin' && $appt['user_id'] != $logged['id']) {
        Response::json(['error'=>'Forbidden'],403);
    }

    if (strpos($path, '/cancel/') !== false) {
        $ok = $appModel->cancel($id);
        if ($ok) Response::json(['message'=>'Cancelled']);
        Response::json(['error'=>'Cancel failed'],500);
    }

    if ($logged['role'] === 'admin') {
        $allowed = ['client_name','service','date','time','status','payment_method'];
    } else {
        $allowed = ['service','date','time'];
    }

    $update = [];
    foreach ($allowed as $f) if (isset($body[$f])) $update[$f] = $body[$f];
    if (empty($update)) Response::json(['error'=>'No valid fields to update'], 400);

    $ok = $appModel->update($id, $update);
    if ($ok) Response::json(['message'=>'Updated']);
    Response::json(['error'=>'Update failed'],500);
}

if ($method === 'DELETE') {
    $id = intval($last);
    if (!$id) Response::json(['error'=>'Invalid id'],400);
    if (!$logged) Response::json(['error'=>'Unauthorized'],401);

    $appt = $appModel->find($id);
    if (!$appt) Response::json(['error'=>'Not found'],404);
    if ($logged['role'] !== 'admin' && $appt['user_id'] != $logged['id']) {
        Response::json(['error'=>'Forbidden'],403);
    }

    $ok = $appModel->delete($id);
    if ($ok) Response::json(['message'=>'Deleted']);
    Response::json(['error'=>'Delete failed'],500);
}
