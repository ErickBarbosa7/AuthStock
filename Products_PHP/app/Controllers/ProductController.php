<?php
namespace App\Controllers;

use App\Models\ProductModel;

class ProductController {

    private $productModel;

    public function __construct() {
        $this->productModel = new ProductModel(); // Instancia del modelo de productos
    }

    // GET: Listar todos los productos
    public function index($data) {
        return $this->productModel->getAll(); // Retorna todos los registros
    }

    // POST: Crear producto
    public function store($data) {
        $data->id = $this->generateUuid(); // Genera un UUID v4 para el nuevo producto
        
        if(!isset($data->nombre) || !isset($data->precio)) {
            return ["error" => true, "msg" => "Faltan datos obligatorios"];
        }

        return $this->productModel->create($data); // Inserta en la base de datos
    }

    // GET: Obtener un producto por ID
    // El ID puede venir como string o dentro de un objeto, según el router
    public function show($data) {
        $id = is_object($data) ? ($data->id ?? null) : $data; // Determina el ID real
        
        if(!$id) return ["error" => true, "msg" => "ID requerido"];

        return $this->productModel->getOne($id); // Obtiene un solo registro
    }

    // PUT: Actualizar producto existente
    public function update($data) {
        if(!isset($data->id)) {
            return ["error" => true, "msg" => "ID requerido para actualizar"];
        }

        return $this->productModel->update($data->id, $data); // Actualiza un producto
    }

    // DELETE: Eliminar producto por ID
    public function destroy($data) {
        $id = is_object($data) ? ($data->id ?? null) : $data; // Igual que show(), obtiene el ID
        
        if(!$id) return ["error" => true, "msg" => "ID requerido para eliminar"];

        return $this->productModel->delete($id); // Elimina el registro
    }

    // Genera un UUID v4 
    private function generateUuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, // Version 4
            mt_rand(0, 0x3fff) | 0x8000, // Variant
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}
