<?php
require_once __DIR__ . '/conexion.php';


if ($conexion->ping()) {
    echo "✅ Conexión exitosa a la base de datos.";
} else {
    echo "❌ Error en la conexión: " . $conn->error;
}

$conexion->close();
?>
