
<?php

require_once __DIR__ . '/conexion.php';


// Consulta SQL para obtener todos los turnos ordenados por fecha y hora descendente
$sql = "SELECT * FROM turnos ORDER BY fecha DESC, hora DESC";
$resultado = $conexion->query($sql);

// Arreglo para almacenar los turnos
$turnos = [];

while ($fila = $resultado->fetch_assoc()) {
    $turnos[] = $fila;
}

// Devolver los turnos como JSON
header('Content-Type: application/json');
echo json_encode($turnos);

$conexion->close();
?>
