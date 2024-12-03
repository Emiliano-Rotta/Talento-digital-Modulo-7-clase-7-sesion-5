
//---------------------------------------------------
// Ejercicio 2: Sistema de Registro de Ventas
// Consigna:
// Desarrolla un sistema para registrar ventas en un comercio, aplicando transacciones y garantizando la integridad de datos:
// Base de datos:
// Crea una base de datos llamada comercio con las tablas:

// CREATE DATABASE comercio;

// -- Conectar a la base de datos comercio
// \c comercio;

// -- Crear la tabla productos
// CREATE TABLE productos (
//     id SERIAL PRIMARY KEY,
//     nombre VARCHAR(50),
//     stock INT,
//     precio DECIMAL
// );

// -- Crear la tabla ventas
// CREATE TABLE ventas (
//     id SERIAL PRIMARY KEY,
//     producto_id INT REFERENCES productos(id),
//     cantidad INT,
//     total DECIMAL
// );

// -- Insertar datos iniciales en productos
// -- Insertar 5 productos
// INSERT INTO productos (nombre, stock, precio)
// VALUES 
//     ('Producto A', 10, 50),   -- ID 1
//     ('Producto B', 5, 30),    -- ID 2
//     ('Producto C', 20, 25),   -- ID 3
//     ('Producto D', 15, 100),  -- ID 4
//     ('Producto E', 30, 10);   -- ID 5

// -- Insertar 5 ventas
// -- Venta 1: 3 unidades de Producto A
// INSERT INTO ventas (producto_id, cantidad, total)
// VALUES (1, 3, 3 * 50);  -- Total: $150

// -- Venta 2: 2 unidades de Producto B
// INSERT INTO ventas (producto_id, cantidad, total)
// VALUES (2, 2, 2 * 30);  -- Total: $60

// -- Venta 3: 5 unidades de Producto C
// INSERT INTO ventas (producto_id, cantidad, total)
// VALUES (3, 5, 5 * 25);  -- Total: $125

// -- Venta 4: 1 unidad de Producto D
// INSERT INTO ventas (producto_id, cantidad, total)
// VALUES (4, 1, 1 * 100); -- Total: $100

// -- Venta 5: 10 unidades de Producto E
// INSERT INTO ventas (producto_id, cantidad, total)
// VALUES (5, 10, 10 * 10); -- Total: $100




// Lógica:
// Al registrar una venta:
// Verifica que haya suficiente stock.
// Resta el stock.
// Registra la venta.
// Si algo falla, la transacción debe revertirse.
// Requerimientos:
// Modulariza el proyecto en controllers, db, y queries.
// Configura la conexión con variables de entorno.
// Maneja los errores adecuadamente.



const { gestionarVenta } = require('./controllers/salesController');

const main = async () => {
    try {
        const venta = await gestionarVenta(1, 3); // Registrar venta de 3 unidades del producto con ID 1
        console.log('Venta registrada con éxito:', venta);
    } catch (error) {
        console.error('Error al gestionar la venta:', error.message);
    }
};

main();
