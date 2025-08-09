<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/conexion.php';

$where = [];
$params = [];
$types = "";

// Fecha desde
if (!empty($_GET['fecha_desde'])) {
    $where[] = "fecha >= ?";
    $params[] = $_GET['fecha_desde'];
    $types .= "s";
}

// Fecha hasta
if (!empty($_GET['fecha_hasta'])) {
    $where[] = "fecha <= ?";
    $params[] = $_GET['fecha_hasta'];
    $types .= "s";
}

// Destino parcial (case insensitive)
if (!empty($_GET['destino'])) {
    $where[] = "LOWER(destino) LIKE ?";
    $params[] = '%' . strtolower($_GET['destino']) . '%';
    $types .= "s";
}

// Chofer parcial (case insensitive)
if (!empty($_GET['chofer'])) {
    $where[] = "LOWER(chofer) LIKE ?";
    $params[] = '%' . strtolower($_GET['chofer']) . '%';
    $types .= "s";
}

// Estado exacto
if (!empty($_GET['estado'])) {
    $where[] = "estado = ?";
    $params[] = $_GET['estado'];
    $types .= "s";
}

$sql = "SELECT * FROM turnos";
if (count($where) > 0) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY fecha DESC, hora DESC";

$stmt = $conexion->prepare($sql);
if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["error" => "Error al preparar la consulta: " . $conexion->error]);
    exit;
}

if (count($params) > 0) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$resultado = $stmt->get_result();

$turnos = [];
while ($fila = $resultado->fetch_assoc()) {
    $turnos[] = $fila;
}

header('Content-Type: application/json');
echo json_encode($turnos);

$stmt->close();
$conexion->close();
?>
