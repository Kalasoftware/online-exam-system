<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

try {
    $query = "SELECT * FROM system_settings";
    $result = $conn->query($query);
    
    if ($result) {
        $settings = array();
        while ($row = $result->fetch_assoc()) {
            if ($row['setting_key'] === 'password_policy') {
                $settings[$row['setting_key']] = json_decode($row['setting_value'], true);
            } else {
                $settings[$row['setting_key']] = $row['setting_value'];
            }
        }

        // Convert string values to appropriate types
        $settings['allow_registration'] = (bool)$settings['allow_registration'];
        $settings['maintenance_mode'] = (bool)$settings['maintenance_mode'];
        $settings['session_timeout'] = (int)$settings['session_timeout'];
        $settings['max_login_attempts'] = (int)$settings['max_login_attempts'];
        
        echo json_encode([
            'success' => true,
            'settings' => $settings
        ]);
    } else {
        throw new Exception("Failed to fetch settings");
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();