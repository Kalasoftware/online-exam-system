<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = md5($data['password']);

    $query = "SELECT user_id, name, email, role FROM Users WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['logged_in'] = true;
        
        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
}

$conn->close();