<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

try {
    $analytics = array();
    
    // User Statistics
    $user_stats = $conn->query("
        SELECT 
            COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
            COUNT(CASE WHEN role = 'teacher' THEN 1 END) as total_teachers
        FROM users
    ")->fetch_assoc();
    
    // Exam Statistics
    $exam_stats = $conn->query("
        SELECT 
            COUNT(*) as total_exams,
            COUNT(CASE WHEN MONTH(created_at) = MONTH(CURRENT_DATE) THEN 1 END) as monthly_exams
        FROM exams
    ")->fetch_assoc();
    
    // Performance Statistics
    $performance_query = "
        SELECT 
            AVG(score) as average_score,
            COUNT(CASE WHEN score >= 90 THEN 1 END) as excellent,
            COUNT(CASE WHEN score >= 70 AND score < 90 THEN 1 END) as good,
            COUNT(CASE WHEN score >= 50 AND score < 70 THEN 1 END) as average,
            COUNT(CASE WHEN score < 50 THEN 1 END) as poor
        FROM results
    ";
    $performance_stats = $conn->query($performance_query)->fetch_assoc();
    
    // Monthly Activity
    $monthly_activity = $conn->query("
        SELECT 
            DATE_FORMAT(completion_date, '%Y-%m') as month,
            COUNT(DISTINCT student_id) as students,
            COUNT(*) as exams
        FROM results
        WHERE completion_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(completion_date, '%Y-%m')
        ORDER BY month
    ")->fetch_all(MYSQLI_ASSOC);
    
    // Format performance distribution for pie chart
    $distribution = array(
        array('name' => 'Excellent (90-100%)', 'value' => $performance_stats['excellent']),
        array('name' => 'Good (70-89%)', 'value' => $performance_stats['good']),
        array('name' => 'Average (50-69%)', 'value' => $performance_stats['average']),
        array('name' => 'Poor (0-49%)', 'value' => $performance_stats['poor'])
    );
    
    echo json_encode([
        'success' => true,
        'analytics' => [
            'userStats' => $user_stats,
            'examStats' => $exam_stats,
            'performanceStats' => [
                'averageScore' => round($performance_stats['average_score'], 2),
                'distribution' => $distribution
            ],
            'monthlyActivity' => $monthly_activity
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();