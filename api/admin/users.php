<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

$query = "SELECT user_id, name, email, role FROM Users ORDER BY name";
$result = $conn->query($query);

if ($result) {
    $users = array();
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    echo json_encode([
        'success' => true,
        'users' => $users
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch users'
    ]);
}

$conn->close();