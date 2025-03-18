<?php
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="exam_results.csv"');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

try {
    $where_conditions = array("1=1");
    $params = array();
    $types = "";

    // ... Same filtering logic as exam-results.php ...

    $where_clause = implode(" AND ", $where_conditions);
    
    $query = "SELECT 
                u.name as student_name,
                e.exam_name,
                r.score,
                r.completion_date,
                r.time_taken,
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

    $output = fopen('php://output', 'w');
    
    // Write CSV header
    fputcsv($output, array(
        'Student Name',
        'Exam Name',
        'Score (%)',
        'Total Questions',
        'Correct Answers',
        'Completion Date',
        'Time Taken (minutes)'
    ));

    // Write data rows
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, array(
            $row['student_name'],
            $row['exam_name'],
            round(($row['correct_answers'] / $row['total_questions']) * 100, 2),
            $row['total_questions'],
            $row['correct_answers'],
            $row['completion_date'],
            $row['time_taken']
        ));
    }
    
    fclose($output);

} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}

$conn->close();