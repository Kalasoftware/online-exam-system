<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include '../config.php';

try {
    // Get total number of students
    $students_query = "SELECT COUNT(*) as total FROM users WHERE role = 'student'";
    $students_result = $conn->query($students_query);
    $total_students = $students_result->fetch_assoc()['total'];

    // Get total number of exams
    $exams_query = "SELECT COUNT(*) as total FROM exams";
    $exams_result = $conn->query($exams_query);
    $total_exams = $exams_result->fetch_assoc()['total'];

    // Get total number of active exams
    $active_exams_query = "SELECT COUNT(*) as total FROM exams WHERE status = 'active'";
    $active_exams_result = $conn->query($active_exams_query);
    $active_exams = $active_exams_result->fetch_assoc()['total'];

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_students' => $total_students,
            'total_exams' => $total_exams,
            'active_exams' => $active_exams
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();