<?php

// --- Autoload de Composer ---
require_once __DIR__ . '/../vendor/autoload.php';
use Router\Router;

// --- CONFIGURACION DE CORS ---
header("Access-Control-Allow-Origin: *");
header("Content-type: application/json; charset=utf-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// --- Manejo de preflight OPTIONS ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- OBTENER CABECERAS ---
$HEADERS = getallheaders();
if (!isset($HEADERS['Authorization'])) {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $HEADERS['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $HEADERS['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
}

// --- LIMPIEZA DE LA RUTA ---
// Quita slashes del inicio y final de la ruta
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestUri = trim($uri, '/');

// --- METODO HTTP ---
$httpMethod = $_SERVER['REQUEST_METHOD'];

// --- LLAMAR AL ROUTER ---
// Delegamos toda la logica de la ruta al Router
Router::handle($httpMethod, $requestUri, $HEADERS);
