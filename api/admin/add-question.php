<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['exam_id']) && isset($data['question_text']) && 
    isset($data['marks']) && isset($data['options']) && 
    isset($data['correct_option'])) {
    
    $exam_id = (int)$data['exam_id'];
    $question_text = $conn->real_escape_string($data['question_text']);
    $marks = (int)$data['marks'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert question
        $query = "INSERT INTO questions (exam_id, question_text, marks) 
                  VALUES ($exam_id, '$question_text', $marks)";
        
        if ($conn->query($query)) {
            $question_id = $conn->insert_id;
            
            // Insert options
            foreach ($data['options'] as $index => $option_text) {
                $escaped_option = $conn->real_escape_string($option_text);
                $is_correct = ($index === (int)$data['correct_option']) ? 1 : 0;
                
                $option_query = "INSERT INTO options (question_id, option_text, is_correct) 
                                VALUES ($question_id, '$escaped_option', $is_correct)";
                
                if (!$conn->query($option_query)) {
                    throw new Exception("Failed to insert option");
                }
            }
            
            $conn->commit();
            echo json_encode([
                'success' => true,
                'message' => 'Question added successfully'
            ]);
        } else {
            throw new Exception("Failed to insert question");
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
}

$conn->close();