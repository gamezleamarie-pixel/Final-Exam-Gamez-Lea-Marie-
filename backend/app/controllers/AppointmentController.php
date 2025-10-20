<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../models/Appointment.php';

class AppointmentController
{
    private $conn;
    private $appointment;

    public function __construct()
    {
        $db = new Database();
        $this->conn = $db->connect();
        $this->appointment = new Appointment($this->conn);
    }

    public function createAppointment($data)
    {
        $this->appointment->user_id = $data['user_id'];
        $this->appointment->client_name = $data['client_name'];
        $this->appointment->service = $data['service'];
        $this->appointment->date = $data['date'];
        $this->appointment->time = $data['time'];
        $this->appointment->status = 'Pending';

        if ($this->appointment->create()) {
            return ['success' => true, 'message' => 'Appointment successfully booked!'];
        }
        return ['success' => false, 'message' => 'Failed to book appointment.'];
    }

    public function getAllAppointments()
    {
        $stmt = $this->appointment->readAll();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAppointmentsByUser($user_id)
    {
        $this->appointment->user_id = $user_id;
        $stmt = $this->appointment->readByUser();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateAppointment($id, $data)
    {
        $this->appointment->id = $id;
        $this->appointment->client_name = $data['client_name'];
        $this->appointment->service = $data['service'];
        $this->appointment->date = $data['date'];
        $this->appointment->time = $data['time'];
        $this->appointment->status = $data['status'];

        if ($this->appointment->update()) {
            return ['success' => true, 'message' => 'Appointment updated successfully!'];
        }
        return ['success' => false, 'message' => 'Failed to update appointment.'];
    }

    public function cancelAppointment($id)
    {
        $this->appointment->id = $id;
        if ($this->appointment->cancel()) {
            return ['success' => true, 'message' => 'Appointment cancelled successfully!'];
        }
        return ['success' => false, 'message' => 'Failed to cancel appointment.'];
    }

    public function deleteAppointment($id)
    {
        $this->appointment->id = $id;
        if ($this->appointment->delete()) {
            return ['success' => true, 'message' => 'Appointment deleted successfully!'];
        }
        return ['success' => false, 'message' => 'Failed to delete appointment.'];
    }
}


header('Content-Type: application/json');
$controller = new AppointmentController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $action = $_POST['action'] ?? '';

    switch ($action) {
        case 'create':
            echo json_encode($controller->createAppointment($_POST));
            break;
        case 'update':
            echo json_encode($controller->updateAppointment($_POST['id'], $_POST));
            break;
        case 'cancel':
            echo json_encode($controller->cancelAppointment($_POST['id']));
            break;
        case 'delete':
            echo json_encode($controller->deleteAppointment($_POST['id']));
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action.']);
    }
}

if ($method === 'GET') {
    if (isset($_GET['user_id'])) {
        echo json_encode($controller->getAppointmentsByUser($_GET['user_id']));
    } else {
        echo json_encode($controller->getAllAppointments());
    }
}
?>
