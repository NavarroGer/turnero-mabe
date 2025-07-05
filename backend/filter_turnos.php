<?php
require_once __DIR__ . '/conexion.php';

$where = [];
$params = [];
$types = "";

// Filtros opcionales
if (!empty($_GET['fecha'])) {
    $where[] = "fecha = ?";
    $params[] = $_GET['fecha'];
    $types .= "s";
}
if (!empty($_GET['destino'])) {
    $where[] = "destino LIKE ?";
    $params[] = '%' . $_GET['destino'] . '%';
    $types .= "s";
}
if (!empty($_GET['chofer'])) {
    $where[] = "chofer LIKE ?";
    $params[] = '%' . $_GET['chofer'] . '%';
    $types .= "s";
}

$sql = "SELECT * FROM turnos";
if (count($where) > 0) {
    $sql .= " WHERE " . implode(" AND ", $where);
}
$sql .= " ORDER BY fecha DESC, hora DESC";

$stmt = $conexion->prepare($sql);
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
