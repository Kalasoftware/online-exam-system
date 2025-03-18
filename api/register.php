<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name']) && isset($data['email']) && isset($data['password']) && isset($data['role'])) {
    $name = $data['name'];
    $email = $data['email'];
    $password = md5($data['password']);
    $role = $data['role'];

    // Check if email already exists
    $check_query = "SELECT * FROM Users WHERE email = '$email'";
    $result = $conn->query($check_query);

    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Email already exists'
        ]);
    } else {
        $query = "INSERT INTO Users (name, email, password, role) VALUES ('$name', '$email', '$password', '$role')";
        if ($conn->query($query)) {
            echo json_encode([
                'success' => true,
                'message' => 'Registration successful'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Registration failed'
            ]);
        }
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields'
    ]);
}

$conn->close();