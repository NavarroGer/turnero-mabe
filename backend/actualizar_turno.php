<?php
require_once __DIR__ . '/conexion.php';

// Validar ID
if (!isset($_POST['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta el ID del turno."]);
    exit;
}

// Sanitizar y obtener datos del formulario
$id = intval($_POST['id']);
$fecha = $_POST['fecha'] ?? '';
$hora = $_POST['hora'] ?? '';
$destino = $_POST['destino'] ?? '';
$transporte_tipo = $_POST['transporte_tipo'] ?? '';
$empresa_tercero = $_POST['empresa_tercero'] ?? null;
$circuito = $_POST['circuito'] ?? '';
$chofer = $_POST['chofer'] ?? '';
$estado = $_POST['estado'] ?? 'Planificado';

$stmt = $conexion->prepare("UPDATE turnos 
    SET fecha = ?, hora = ?, destino = ?, transporte_tipo = ?, empresa_tercero = ?, circuito = ?, chofer = ?, estado = ?
    WHERE id = ?");

$stmt->bind_param("ssssssssi", $fecha, $hora, $destino, $transporte_tipo, $empresa_tercero, $circuito, $chofer, $estado, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Turno actualizado correctamente."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al actualizar el turno: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
