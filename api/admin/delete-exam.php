<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['exam_id'])) {
    $exam_id = (int)$data['exam_id'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Delete related records first
        $delete_options = "DELETE o FROM options o 
                          INNER JOIN questions q ON o.question_id = q.question_id 
                          WHERE q.exam_id = $exam_id";
        $conn->query($delete_options);
        
        // Delete questions
        $delete_questions = "DELETE FROM questions WHERE exam_id = $exam_id";
        $conn->query($delete_questions);
        
        // Finally delete the exam
        $delete_exam = "DELETE FROM exams WHERE exam_id = $exam_id";
        
        if ($conn->query($delete_exam)) {
            $conn->commit();
            echo json_encode([
                'success' => true,
                'message' => 'Exam deleted successfully'
            ]);
        } else {
            throw new Exception("Failed to delete exam");
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete exam: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Exam ID is required'
    ]);
}

$conn->close();