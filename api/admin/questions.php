<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

if (isset($_GET['exam_id'])) {
    $exam_id = (int)$_GET['exam_id'];
    
    try {
        $query = "SELECT q.*, o.option_text, o.is_correct 
                 FROM questions q 
                 LEFT JOIN options o ON q.question_id = o.question_id 
                 WHERE q.exam_id = ?
                 ORDER BY q.question_id, o.option_id";
                 
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $exam_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $questions = [];
        $current_question = null;
        
        while ($row = $result->fetch_assoc()) {
            if (!$current_question || $current_question['question_id'] !== $row['question_id']) {
                if ($current_question) {
                    $questions[] = $current_question;
                }
                $current_question = [
                    'question_id' => $row['question_id'],
                    'question_text' => $row['question_text'],
                    'marks' => $row['marks'],
                    'option_a' => '',
                    'option_b' => '',
                    'option_c' => '',
                    'option_d' => '',
                    'correct_answer' => ''
                ];
            }
            
            // Assign options based on their order
            if ($row['is_correct']) {
                $current_question['correct_answer'] = count($questions) === 0 ? 'A' : 
                    (count($questions) === 1 ? 'B' : 
                    (count($questions) === 2 ? 'C' : 'D'));
            }
            
            // Assign option text
            if (!$current_question['option_a']) $current_question['option_a'] = $row['option_text'];
            else if (!$current_question['option_b']) $current_question['option_b'] = $row['option_text'];
            else if (!$current_question['option_c']) $current_question['option_c'] = $row['option_text'];
            else if (!$current_question['option_d']) $current_question['option_d'] = $row['option_text'];
        }
        
        if ($current_question) {
            $questions[] = $current_question;
        }
        
        echo json_encode([
            'success' => true,
            'questions' => $questions
        ]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Exam ID is required'
    ]);
}

$conn->close();