<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$data = json_decode(file_get_contents('php://input'), true);
$admin_code = "ADMIN123"; // You can change this to any secure code

if (isset($data['name']) && isset($data['email']) && isset($data['password']) && isset($data['admin_code'])) {
    if ($data['admin_code'] !== $admin_code) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid admin code'
        ]);
        exit;
    }

    $name = $data['name'];
    $email = $data['email'];
    $password = md5($data['password']);
    
    // Check if email already exists
    $check_query = "SELECT * FROM Users WHERE email = '$email'";
    $result = $conn->query($check_query);

    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Email already exists'
        ]);
    } else {
        $query = "INSERT INTO Users (name, email, password, role) VALUES ('$name', '$email', '$password', 'admin')";
        if ($conn->query($query)) {
            echo json_encode([
                'success' => true,
                'message' => 'Admin registration successful'
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