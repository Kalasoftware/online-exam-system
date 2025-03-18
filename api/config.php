<?php
function getEnvValue($key, $default = null) {
    // First check Docker environment variables
    $dockerEnv = getenv($key);
    if ($dockerEnv !== false) {
        return $dockerEnv;
    }

    // Check in project root directory
    $projectEnvPath = __DIR__ . '/../.env';
    // Check in api directory
    $apiEnvPath = __DIR__ . '/.env';
    
    if (file_exists($projectEnvPath)) {
        $envFile = file_get_contents($projectEnvPath);
    } elseif (file_exists($apiEnvPath)) {
        $envFile = file_get_contents($apiEnvPath);
    } else {
        return $default;
    }
    
    $lines = explode("\n", $envFile);
    foreach ($lines as $line) {
        if (strpos($line, $key . '=') === 0) {
            return trim(substr($line, strlen($key) + 1));
        }
    }
    return $default;
}

$host = getEnvValue('DB_HOST', 'localhost');
$user = getEnvValue('DB_USER', 'root');
$password = getEnvValue('DB_PASSWORD', '');
$database = getEnvValue('DB_NAME', 'online_exam');

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}