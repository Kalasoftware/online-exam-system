<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

// Log suspicious activities
$query = "SELECT * FROM SecurityLogs ORDER BY timestamp DESC LIMIT 100";
// ... implementation