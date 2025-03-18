<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['exam_id']) && isset($data['exam_name']) && isset($data['subject']) && 
    isset($data['exam_date']) && isset($data['duration'])) {
    
    $exam_id = (int)$data['exam_id'];
    $exam_name = $conn->real_escape_string($data['exam_name']);
    $subject = $conn->real_escape_string($data['subject']);
    $exam_date = $conn->real_escape_string($data['exam_date']);
    $duration = (int)$data['duration'];
    $status = $conn->real_escape_string($data['status'] ?? 'active');

    $query = "UPDATE exams SET 
              exam_name = '$exam_name',
              subject = '$subject',
              exam_date = '$exam_date',
              duration = $duration,
              status = '$status'
              WHERE exam_id = $exam_id";

    if ($conn->query($query)) {
        echo json_encode([
            'success' => true,
            'message' => 'Exam updated successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update exam: ' . $conn->error
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
}

$conn->close();