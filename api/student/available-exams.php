<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include '../config.php';

try {
    $query = "SELECT 
                e.exam_id,
                e.exam_name,
                e.subject,
                e.duration,
                e.exam_date,
                e.status,
                COALESCE(u.name, 'Not Assigned') as teacher_name
              FROM exams e 
              LEFT JOIN users u ON e.teacher_id = u.user_id 
              WHERE e.status = 'active' 
              ORDER BY e.exam_date ASC";
              
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception($conn->error);
    }
    
    $exams = array();
    while ($row = $result->fetch_assoc()) {
        $exams[] = array(
            'exam_id' => $row['exam_id'],
            'exam_name' => $row['exam_name'],
            'subject' => $row['subject'],
            'duration' => $row['duration'],
            'exam_date' => $row['exam_date'],
            'teacher_name' => $row['teacher_name']
        );
    }
    
    echo json_encode([
        'success' => true,
        'exams' => $exams
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();