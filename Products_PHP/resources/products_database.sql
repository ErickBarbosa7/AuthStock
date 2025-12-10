DROP TABLE IF EXISTS products;

-- Crear la tabla 
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY,
    nombre VARCHAR(150),
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categoria VARCHAR(50),
    marca VARCHAR(100),
    sku VARCHAR(50) UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    usuario_registro CHAR(36), -- Aquí se guardará el ID del usuario que lo creó
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un producto de prueba para que no esté vacía
INSERT INTO products (id, nombre, descripcion, precio, stock, categoria, marca, sku, usuario_registro, activo)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Laptop Gamer', 'Laptop potente para desarrollo', 25000.00, 10, 'Computo', 'Dell', 'DELL-001', 'user-uuid-123', TRUE);