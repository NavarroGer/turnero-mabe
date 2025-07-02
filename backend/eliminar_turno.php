<?php
require_once __DIR__ . '/conexion.php';
header('Content-Type: application/json');

if (!isset($_POST['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta el ID del turno a eliminar."]);
    exit;
}

$id = intval($_POST['id']);

$stmt = $conexion->prepare("DELETE FROM turnos WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Turno eliminado correctamente."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar el turno: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
