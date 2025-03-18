<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['user_id'])) {
    $user_id = (int)$data['user_id'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Delete user's exam results first
        $delete_results = "DELETE FROM results WHERE student_id = $user_id";
        $conn->query($delete_results);
        
        // Delete user
        $delete_user = "DELETE FROM users WHERE user_id = $user_id";
        
        if ($conn->query($delete_user)) {
            $conn->commit();
            echo json_encode([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } else {
            throw new Exception("Failed to delete user");
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete user: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'User ID is required'
    ]);
}

$conn->close();