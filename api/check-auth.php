<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    echo json_encode([
        'isAuthenticated' => true,
        'user' => [
            'user_id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'role' => $_SESSION['user_role']
        ]
    ]);
} else {
    echo json_encode([
        'isAuthenticated' => false
    ]);
}