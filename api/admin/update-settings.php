<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Start transaction
    $conn->begin_transaction();
    
    // Prepare statement for updating settings
    $stmt = $conn->prepare("INSERT INTO system_settings (setting_key, setting_value) 
                           VALUES (?, ?) 
                           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
    
    // Update each setting
    $settings_to_update = [
        'site_name' => $data['site_name'],
        'admin_email' => $data['admin_email'],
        'allow_registration' => $data['allow_registration'] ? '1' : '0',
        'maintenance_mode' => $data['maintenance_mode'] ? '1' : '0',
        'session_timeout' => (string)$data['session_timeout'],
        'max_login_attempts' => (string)$data['max_login_attempts'],
        'password_policy' => json_encode($data['password_policy'])
    ];
    
    foreach ($settings_to_update as $key => $value) {
        $stmt->bind_param('ss', $key, $value);
        if (!$stmt->execute()) {
            throw new Exception("Failed to update setting: $key");
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Settings updated successfully'
    ]);

} catch (Exception $e) {
    // Rollback on error
    if ($conn->connect_errno === 0) {
        $conn->rollback();
    }
    
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();