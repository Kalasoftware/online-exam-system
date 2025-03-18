<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

try {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    $where_conditions = array("1=1");
    $params = array();
    $types = "";

    if (!empty($_GET['user'])) {
        $where_conditions[] = "u.name LIKE ?";
        $params[] = "%" . $_GET['user'] . "%";
        $types .= "s";
    }

    if (!empty($_GET['action'])) {
        $where_conditions[] = "l.action_type = ?";
        $params[] = $_GET['action'];
        $types .= "s";
    }

    if (!empty($_GET['dateFrom'])) {
        $where_conditions[] = "l.created_at >= ?";
        $params[] = $_GET['dateFrom'] . " 00:00:00";
        $types .= "s";
    }

    if (!empty($_GET['dateTo'])) {
        $where_conditions[] = "l.created_at <= ?";
        $params[] = $_GET['dateTo'] . " 23:59:59";
        $types .= "s";
    }

    $where_clause = implode(" AND ", $where_conditions);

    // Get total count
    $count_query = "SELECT COUNT(*) as total FROM activity_logs l 
                    JOIN users u ON l.user_id = u.user_id 
                    WHERE $where_clause";
    
    $stmt = $conn->prepare($count_query);
    if (!empty($types)) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $total = $stmt->get_result()->fetch_assoc()['total'];

    // Get logs with pagination
    $query = "SELECT l.*, u.name as user_name 
              FROM activity_logs l
              JOIN users u ON l.user_id = u.user_id
              WHERE $where_clause
              ORDER BY l.created_at DESC
              LIMIT ? OFFSET ?";

    $stmt = $conn->prepare($query);
    if (!empty($types)) {
        $stmt->bind_param($types . "ii", ...array_merge($params, [$limit, $offset]));
    } else {
        $stmt->bind_param("ii", $limit, $offset);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $logs = array();
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'logs' => $logs,
        'total' => $total
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();