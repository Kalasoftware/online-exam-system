<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$query = "SELECT e.*, u.name as teacher_name 
          FROM exams e 
          LEFT JOIN users u ON e.teacher_id = u.user_id 
          ORDER BY e.exam_date DESC";

$result = $conn->query($query);

if ($result) {
    $exams = array();
    while ($row = $result->fetch_assoc()) {
        $exams[] = $row;
    }
    echo json_encode([
        'success' => true,
        'exams' => $exams
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch exams: ' . $conn->error
    ]);
}

$conn->close();