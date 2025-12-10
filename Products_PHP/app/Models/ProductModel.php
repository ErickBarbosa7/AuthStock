<?php
namespace App\Models;

use Config\database\Methods;

class ProductModel {

    // GET: Listar todos (Ordenados por fecha para ver los nuevos primero)
    public function getAll() {
        $sql = (object)[
            "query" => "SELECT * FROM products ORDER BY fecha_ingreso DESC",
            "params" => []
        ];
        return Methods::query($sql);
    }

    // GET: Obtener uno por ID
    public function getOne($id) {
        $sql = (object)[
            "query" => "SELECT * FROM products WHERE id = :id",
            "params" => ["id" => $id]
        ];
        return Methods::query_one($sql);
    }

    // POST: Crear producto
    public function create($data) {
        $sql = (object)[
            "query" => "INSERT INTO products (id, nombre, descripcion, precio, stock, categoria, marca, sku, usuario_registro, activo) 
                        VALUES (:id, :nombre, :descripcion, :precio, :stock, :categoria, :marca, :sku, :usuario_registro, :activo)",
            "params" => [
                "id" => $data->id,
                "nombre" => $data->nombre ?? null,
                "descripcion" => $data->descripcion ?? null,
                "precio" => $data->precio,
                "stock" => $data->stock ?? 0,
                "categoria" => $data->categoria ?? null,
                "marca" => $data->marca ?? null,
                "sku" => $data->sku ?? null,
                "usuario_registro" => $data->usuario_registro ?? null,
                "activo" => true // Por defecto activo al crear
            ]
        ];
        return Methods::save($sql);
    }

    // PUT: Actualizar dinámicamente (SOLUCIÓN AL ERROR DE UPDATE)
    public function update($id, $data) {
        $setParts = [];
        $params = ["id" => $id];

        // 1. Lista de columnas que permitimos editar
        // Nota: No incluimos 'id' ni 'fecha_ingreso' para protegerlos
        $allowedColumns = [
            'nombre', 'descripcion', 'precio', 'stock', 
            'categoria', 'marca', 'sku', 'activo'
        ];

        // 2. Construimos la consulta solo con los datos que llegaron
        foreach ($data as $key => $value) {
            if (in_array($key, $allowedColumns)) {
                $setParts[] = "$key = :$key";
                $params[$key] = $value;
            }
        }

        // 3. Si no hay nada que actualizar, retornamos false
        if (empty($setParts)) {
            return false;
        }

        // 4. Agregamos la actualización automática de la fecha
        $setParts[] = "fecha_actualizacion = NOW()";

        // 5. Unimos todo en un string SQL
        $setString = implode(', ', $setParts);

        $sql = (object)[
            "query" => "UPDATE products SET $setString WHERE id = :id",
            "params" => $params
        ];

        return Methods::save($sql);
    }

    // DELETE: Eliminar producto
    public function delete($id) {
        $sql = (object)[
            "query" => "DELETE FROM products WHERE id = :id",
            "params" => ["id" => $id]
        ];
        return Methods::save($sql);
    }
}