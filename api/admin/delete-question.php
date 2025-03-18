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

try {
    $stmt = $conn->prepare("DELETE FROM questions WHERE question_id = ?");
    $stmt->bind_param("i", $data['question_id']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Question deleted successfully'
        ]);
    } else {
        throw new Exception($stmt->error);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to delete question: ' . $e->getMessage()
    ]);
}

$conn->close();