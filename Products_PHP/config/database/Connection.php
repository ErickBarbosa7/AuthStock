<?php
namespace Config\database;

use PDO;
use PDOException;

class Connection {
    private static $host = "127.0.0.1";
    private static $db_name = "netapp_db";
    private static $user_name = "erick";
    private static $password = "erickpass";
    private static $port = "5433"; // Tu puerto externo de Docker

    public static function connection(){
        try {
            $dsn = 'pgsql:host='.self::$host.';port='.self::$port.';dbname='.self::$db_name.';sslmode=disable';
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                PDO::ATTR_TIMEOUT => 3 // Tiempo máximo de espera (segundos)
            ];

            return new PDO($dsn, self::$user_name, self::$password, $options);
        }
        catch(PDOException $e) {
            // Esto atrapa el error y lo muestra en JSON en lugar de colgarse
            header("Content-Type: application/json");
            http_response_code(500);
            die(json_encode([
                "error" => true, 
                "msg" => "Error Conexion BD: " . $e->getMessage()
            ]));
        }
    }
}