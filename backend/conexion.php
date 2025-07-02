<?php
// Datos de conexión
$host = "localhost";
$usuario = "root";
$password = "";
$base_datos = "turnerodigital_db";

// Crear conexión
$conexion = new mysqli($host, $usuario, $password, $base_datos);

// Verificar conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Establecer codificación
$conexion->set_charset("utf8");
?>
