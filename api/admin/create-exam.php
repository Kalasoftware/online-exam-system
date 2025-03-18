<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['exam_name']) && isset($data['subject']) && 
    isset($data['exam_date']) && isset($data['duration'])) {
    
    $exam_name = $conn->real_escape_string($data['exam_name']);
    $subject = $conn->real_escape_string($data['subject']);
    $exam_date = $conn->real_escape_string($data['exam_date']);
    $duration = (int)$data['duration'];
    $status = 'active'; // Set default status to active
    
    $teacher_id = isset($data['teacher_id']) ? (int)$data['teacher_id'] : null;

    $query = "INSERT INTO exams (exam_name, subject, teacher_id, exam_date, duration, status) 
              VALUES ('$exam_name', '$subject', " . ($teacher_id ? $teacher_id : "NULL") . ", 
              '$exam_date', $duration, '$status')";

    if ($conn->query($query)) {
        echo json_encode([
            'success' => true,
            'message' => 'Exam created successfully',
            'exam_id' => $conn->insert_id,
            'debug_query' => $query // Debug: Print the query
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create exam: ' . $conn->error
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
}

$conn->close();