<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Start transaction
    $conn->begin_transaction();

    // First insert the question
    $question_query = "INSERT INTO questions (exam_id, question_text, marks) VALUES (?, ?, 1)";
    $stmt = $conn->prepare($question_query);
    
    if (!$stmt) {
        throw new Exception($conn->error);
    }
    
    $stmt->bind_param("is", $data['exam_id'], $data['question_text']);
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    $question_id = $stmt->insert_id;

    // Insert options
    $option_query = "INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)";
    $option_stmt = $conn->prepare($option_query);

    $options = [
        ['text' => $data['option_a'], 'correct' => ($data['correct_answer'] === 'A' ? 1 : 0)],
        ['text' => $data['option_b'], 'correct' => ($data['correct_answer'] === 'B' ? 1 : 0)],
        ['text' => $data['option_c'], 'correct' => ($data['correct_answer'] === 'C' ? 1 : 0)],
        ['text' => $data['option_d'], 'correct' => ($data['correct_answer'] === 'D' ? 1 : 0)]
    ];

    foreach ($options as $option) {
        $option_stmt->bind_param("isi", $question_id, $option['text'], $option['correct']);
        if (!$option_stmt->execute()) {
            throw new Exception($option_stmt->error);
        }
    }

    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Question added successfully',
        'question_id' => $question_id
    ]);

} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();