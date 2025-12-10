<?php
namespace Router;

use Config\Jwt\Jwt;
use Config\utils\CustomExceptions as exc;

class Router {
    
    // Definicion de rutas
    // Formato: "RUTA" => [ClaseControlador, NombreMetodo, NivelSeguridad]
    // Nivel 0 = Publico
    // Nivel 1 = Header Simple (MD5)
    // Nivel 2 = JWT (Token de Node.js)
    private static $routes = [
        "GET" => [
            "products" => [\App\Controllers\ProductController::class, "index", 0],        // Listar (Publico)
            "products/detail" => [\App\Controllers\ProductController::class, "show", 0],  // Ver detalle (Publico)
        ],
        "POST" => [
            "products" => [\App\Controllers\ProductController::class, "store", 2],        // Crear (Requiere Token)
        ],
        "PUT" => [
            "products" => [\App\Controllers\ProductController::class, "update", 2],       // Editar (Requiere Token)
        ],
        "DELETE" => [
            "products" => [\App\Controllers\ProductController::class, "destroy", 2],      // Eliminar (Requiere Token)
        ]
    ];

    public static function handle(String $method, String $uri, array $HEADERS)
    {
        try {
            // 1. Verificar que la ruta exista en el array
            if (!isset(self::$routes[$method][$uri])) {
                throw new exc('001'); // Ruta no encontrada
            }

            // 2. Obtener configuracion de la ruta
            $routeConfig = self::$routes[$method][$uri];
            $controllerClass = $routeConfig[0];
            $methodName = $routeConfig[1];
            $authLevel = $routeConfig[2]; 

            // 3. Validar autenticacion segun el nivel
            $authHeader = $HEADERS['authorization'] ?? ($HEADERS['Authorization'] ?? null);

            switch ($authLevel) {
                case 0:
                    break;

                case 1:
                    // AUTENTICACION SIMPLE 
                    $headerSimple = $HEADERS['simple'] ?? ($HEADERS['Simple'] ?? null);
                    if (trim(strtolower((string)$headerSimple)) !== md5('123456789')) {
                        throw new exc('006');
                    }
                    break;

                default: // Nivel 2 o mayor (JWT)
                    // Validamos usando tu clase Jwt nativa
                    if (!$authHeader || !Jwt::Check($authHeader)) {
                        throw new exc('006'); // Token invalido o expirado
                    }
                    break;
            }

            // 4. Validar existencia de clase y metodo del controlador
            if (!class_exists($controllerClass)) throw new exc('002');
            $controllerInstance = new $controllerClass();
            if (!method_exists($controllerInstance, $methodName)) throw new exc('003');

            // 5. Obtener datos de la peticion (Body o GET params)
            $requestData = self::getRequestData($method);

            // --- INYECCION DE USUARIO ---
            if ($authHeader && Jwt::Check($authHeader)) {
                $payload = Jwt::GetData($authHeader);
                
                $userId = $payload->id ?? ($payload->data->id ?? null);
                
                if ($userId && is_object($requestData)) {
                    $requestData->usuario_registro = $userId;
                }
            }

            // 6. Ejecutar el controlador
            echo json_encode(call_user_func([$controllerInstance, $methodName], $requestData));

        } catch (exc $e) {
            echo json_encode($e->GetOptions());
        } catch (\Throwable $th) {
            echo json_encode([
                "error" => true,
                "msg" => $th->getMessage(),
                "error_code" => $th->getCode()
            ]);
        }
    }

    // Helper para leer el body o los query params
    private static function getRequestData(string $REQUEST_METHOD){
        if($REQUEST_METHOD === 'GET'){
            return $_GET['params'] ?? ($_GET['id'] ?? null);
        } else {
            $inputJSON = file_get_contents("php://input");
            $data = json_decode($inputJSON);
            return $data ?: new \stdClass();
        }
    }
}
