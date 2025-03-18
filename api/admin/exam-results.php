<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

try {
    $where_conditions = array("1=1");
    $params = array();
    $types = "";

    if (!empty($_GET['exam'])) {
        $where_conditions[] = "e.exam_id = ?";
        $params[] = $_GET['exam'];
        $types .= "i";
    }

    if (!empty($_GET['student'])) {
        $where_conditions[] = "u.name LIKE ?";
        $params[] = "%" . $_GET['student'] . "%";
        $types .= "s";
    }

    if (!empty($_GET['dateFrom'])) {
        $where_conditions[] = "r.completion_date >= ?";
        $params[] = $_GET['dateFrom'] . " 00:00:00";
        $types .= "s";
    }

    if (!empty($_GET['dateTo'])) {
        $where_conditions[] = "r.completion_date <= ?";
        $params[] = $_GET['dateTo'] . " 23:59:59";
        $types .= "s";
    }

    $where_clause = implode(" AND ", $where_conditions);

    $query = "SELECT r.*, e.exam_name, u.name as student_name,
              (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.exam_id) as total_questions,
              (SELECT COUNT(*) FROM answers a WHERE a.result_id = r.result_id AND a.is_correct = 1) as correct_answers
              FROM results r
              JOIN exams e ON r.exam_id = e.exam_id
              JOIN users u ON r.student_id = u.user_id
              WHERE $where_clause
              ORDER BY r.completion_date DESC";

    $stmt = $conn->prepare($query);
    
    if (!empty($types) && !empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $results = array();
    while ($row = $result->fetch_assoc()) {
        $row['score'] = round(($row['correct_answers'] / $row['total_questions']) * 100, 2);
        $results[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'results' => $results
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();