<?php
require_once __DIR__ . '/conexion.php';


// Validar y capturar los datos del formulario (POST)
$fecha            = $_POST['fecha'] ?? null;
$hora             = $_POST['hora'] ?? null;
$destino          = $_POST['destino'] ?? null;
$transporte_tipo  = $_POST['transporte_tipo'] ?? null;
$empresa_tercero  = $_POST['empresa_tercero'] ?? null;
$circuito         = $_POST['circuito'] ?? null;
$chofer           = $_POST['chofer'] ?? null;
$estado           = $_POST['estado'] ?? 'Planificado';

// Validar datos mínimos obligatorios
if (!$fecha || !$hora || !$destino || !$transporte_tipo || !$circuito || !$chofer) {
    echo "Faltan datos obligatorios.";
    exit;
}

// Si el tipo de transporte es "Propio", limpiamos el campo de empresa
if ($transporte_tipo === "Propio") {
    $empresa_tercero = null;
}

// Preparar consulta SQL
$stmt = $conexion->prepare("INSERT INTO turnos 
    (fecha, hora, destino, transporte_tipo, empresa_tercero, circuito, chofer, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

$stmt->bind_param("ssssssss", $fecha, $hora, $destino, $transporte_tipo, $empresa_tercero, $circuito, $chofer, $estado);

// Ejecutar
if ($stmt->execute()) {
    echo "Turno guardado correctamente.";
} else {
    echo "Error al guardar el turno: " . $stmt->error;
}

$stmt->close();
$conexion->close();
?>
