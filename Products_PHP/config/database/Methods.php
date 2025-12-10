<?php

namespace Config\database;

use PDO;
use Exception;
use Throwable;
use Config\database\Connection;

class Methods
{
    // Ejecuta consultas SELECT que devuelven multiples filas
    public static function query(object $obj)
    {
        try {
            $db = Connection::connection(); // Conexion a la base de datos
            $stmt = $db->prepare($obj->query); // Prepara la consulta
            $stmt->execute($obj->params); // Ejecuta con parametros
            
            $results = $stmt->fetchAll(PDO::FETCH_OBJ); // Obtiene todas las filas
            
            $db = null; // Cerrar conexion
            return (object) ["error" => false, "msg" => $results]; // Retorna datos

        } catch (Throwable $th) {
            return (object) [
                "error" => true,
                "msg" => "Error en query: " . $th->getMessage(),
                "error_code" => $th->getCode()
            ];
        }
    }

    // Ejecuta consultas SELECT que solo deben devolver una fila
    public static function query_one(object $obj)
    {
        try {
            $db = Connection::connection(); // Abre conexion
            $stmt = $db->prepare($obj->query); // Prepara consulta
            $stmt->execute($obj->params); // Ejecuta
            
            $result = $stmt->fetch(PDO::FETCH_OBJ); // Obtiene solo una fila
            
            $db = null; // Cierra conexion

            if ($result === false) {
                $result = null; // Resultado vacio
            }

            return (object) ["error" => false, "msg" => $result]; // Retorna una fila

        } catch (Throwable $th) {
            return (object) [
                "error" => true,
                "msg" => "Error en query_one: " . $th->getMessage(),
                "error_code" => $th->getCode()
            ];
        }
    }

    // Ejecuta operaciones de escritura: INSERT, UPDATE, DELETE
    public static function save(object $obj)
    {
        try {
            $db = Connection::connection(); // Conecta DB
            $stmt = $db->prepare($obj->query); // Prepara consulta
            
            if (!$stmt->execute($obj->params)) { 
                // Si la consulta falla, lanzamos una excepcion
                $errorInfo = $stmt->errorInfo();
                throw new Exception("Error SQL: " . $errorInfo[2]);
            }
            
            $db = null; // Cierra conexion
            return ["error" => false, "msg" => "query_executed"]; // Operacion exitosa

        } catch (Throwable $th) {
            return [
                "error" => true,
                "msg" => "Database Error: " . $th->getMessage(),
                "error_code" => $th->getCode()
            ];
        }
    }

    // Ejecuta varias consultas como una sola transaccion
    public static function save_transaction(array $queries)
    {
        $db = null;

        try {
            $db = Connection::connection(); // Abre conexion
            $db->beginTransaction(); // Inicia transaccion

            foreach ($queries as $obj) {
                $stmt = $db->prepare($obj->query); // Prepara cada consulta
                if (!$stmt->execute($obj->params)) { 
                    throw new Exception("Error en una consulta de la transaccion.");
                }
            }

            $db->commit(); // Confirma cambios
            $db = null;
            return ["error" => false, "msg" => "transaction_executed"]; // Todo OK

        } catch (Throwable $th) {
            if ($db) {
                $db->rollBack(); // Revierte si algo falla
            }
            return [
                "error" => true,
                "msg" => "Transaction Error: " . $th->getMessage(),
                "error_code" => $th->getCode()
            ];
        }
    }
}
