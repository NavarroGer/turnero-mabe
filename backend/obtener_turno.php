<?php
require_once __DIR__ . '/conexion.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID no proporcionado']);
    exit;
}

$id = intval($_GET['id']);

$sql = "SELECT * FROM turnos WHERE id = $id LIMIT 1";
$resultado = $conexion->query($sql);

if ($resultado && $resultado->num_rows > 0) {
    $turno = $resultado->fetch_assoc();
    header('Content-Type: application/json');
    echo json_encode($turno);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Turno no encontrado']);
}

$conexion->close();
