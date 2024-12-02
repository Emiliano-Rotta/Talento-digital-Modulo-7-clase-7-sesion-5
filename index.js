// Datos para crear la base de datos praa los ejercicios de la clase.

// CREATE DATABASE gestion_bancaria;

// \c gestion_bancaria

// CREATE TABLE cuentas (
//     id SERIAL PRIMARY KEY,
//     titular VARCHAR(100) NOT NULL,
//     saldo NUMERIC(10, 2) NOT NULL CHECK (saldo >= 0)
// );

// CREATE TABLE usuarios (
//     id SERIAL PRIMARY KEY,
//     nombre VARCHAR(100) NOT NULL,
//     email VARCHAR(150) NOT NULL UNIQUE
// );

// CREATE TABLE vuelos (
//     id SERIAL PRIMARY KEY,
//     destino VARCHAR(100) NOT NULL,
//     cupo INT NOT NULL CHECK (cupo >= 0)
// );

// CREATE TABLE boletos (
//     id SERIAL PRIMARY KEY,
//     vuelo_id INT NOT NULL REFERENCES vuelos(id) ON DELETE CASCADE,
//     pasajero VARCHAR(100) NOT NULL
// );

// CREATE TABLE productos (
//     id SERIAL PRIMARY KEY,
//     nombre VARCHAR(100) NOT NULL,
//     stock INT NOT NULL CHECK (stock >= 0)
// );

// CREATE TABLE ventas (
//     id SERIAL PRIMARY KEY,
//     producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
//     cantidad INT NOT NULL CHECK (cantidad > 0),
//     fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE pedidos (
//     id SERIAL PRIMARY KEY,
//     cliente_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
//     estado VARCHAR(50) DEFAULT 'Pendiente'
// );


// INSERT INTO cuentas (titular, saldo) VALUES 
// ('Carlos Martínez', 1000.00),
// ('Ana López', 500.00);

// INSERT INTO usuarios (nombre, email) VALUES 
// ('Juan Pérez', 'juan@correo.com'),
// ('María Gómez', 'maria@correo.com');

// INSERT INTO vuelos (destino, cupo) VALUES 
// ('Santiago', 100),
// ('Valparaíso', 50);

// INSERT INTO productos (nombre, stock) VALUES 
// ('Laptop', 20),
// ('Mouse', 50);

// INSERT INTO productos (nombre, stock) VALUES 
// ('Laptop', 20),
// ('Mouse', 50);

// INSERT INTO pedidos (cliente_id, estado) VALUES 
// (1, 'Pendiente'),
// (2, 'En Proceso');

//---------------------------------------------------------------------------------

//Transaccionalidad

//La transaccionalidad en bases de datos garantiza que un conjunto de operaciones (como consultas, inserciones, actualizaciones o eliminaciones) se ejecute como una unidad indivisible. Es decir, o todas las operaciones se completan correctamente o ninguna se aplica.

// BEGIN: Marca el inicio de una transacción.
// COMMIT: Aplica todas las operaciones realizadas desde el BEGIN.
// ROLLBACK: Revierte todas las operaciones desde el BEGIN si ocurre un error.

// La Propiedad ACID

// Atomicidad: Una transacción es todo o nada.
// Consistencia: Garantiza que la base de datos pase de un estado válido a otro.
// Aislamiento: Evita interferencias entre transacciones concurrentes.
// Durabilidad: Los cambios realizados en una transacción confirmada permanecen, incluso en caso de fallo del sistema.


//usos: 
// - Tranferencias bancarias
// - viajes en avion 
// - actualizar inventario post venta




const pool = require('./db/config')

const realizarTransaccionBancaria = async () => {
    const cliente = await pool.connect()
    const restaQuery = 'UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2'
    let monto = 100
    const restaValues = [monto, 1]
    const sumaQuery = 'UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2'
    const sumaValues = [monto, 2]
    try {
        await cliente.query('BEGIN')
        //operaciones
        //resta
        await cliente.query(restaQuery, restaValues);
        //suma
        await cliente.query(sumaQuery, sumaValues);

        await cliente.query('COMMIT')
        console.log('Transacción completada exitosamente.');
    } catch (error) {
        await cliente.query('ROLLBACK')
        console.error('Error en la transaccion:', error.message)
    } finally {
        cliente.release();
    }
}

// realizarTransaccionBancaria()
//--------------------------------------------------------------
const reservarAsiento = async () => {
    const cliente = await pool.connect();
    try {
        await cliente.query('BEGIN');

        // Reducir el cupo del vuelo
        await cliente.query('UPDATE vuelos SET cupo = cupo - 1 WHERE id = $1', [1]);

        // Generar boleto
        await cliente.query('INSERT INTO boletos (vuelo_id, pasajero) VALUES ($1, $2)', [1, 'María López']);

        await cliente.query('COMMIT');
        console.log('Reserva realizada exitosamente.');
    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error('Error en la reserva:', error.message);
    } finally {
        cliente.release();
    }
};

// reservarAsiento();
//---------------------------------------------------------------
const actualizarInventario = async () => {
    const cliente = await pool.connect();
    try {
        await cliente.query('BEGIN');

        // Reducir inventario
        await cliente.query('UPDATE productos SET stock = stock - $1 WHERE id = $2', [5, 1]);

        // Registrar venta
        await cliente.query('INSERT INTO ventas (producto_id, cantidad) VALUES ($1, $2)', [1, 5]);

        await cliente.query('COMMIT');
        console.log('Inventario actualizado y venta registrada.');
    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error('Error al actualizar inventario:', error.message);
    } finally {
        cliente.release();
    }
};

// actualizarInventario();



//---------------------------------------------------------------
// La Integridad de Datos

//La integridad de datos se refiere a la exactitud y consistencia de los datos almacenados en una base de datos. Se logra mediante restricciones como claves primarias, foráneas, valores únicos, no nulos, etc.

const verificarIntegridadDeDatos = async () => {
    const query ='INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *';
        
    const values =['Juan Pérez', 'juan@correo.com']
    try {
        const result = await pool.query(query, values );

        console.log('Usuario insertado:', result.rows[0]);
    } catch (error) {
        console.error('Error al insertar usuario:', error.message);
    }
};

// verificarIntegridadDeDatos();

//-------------------------------------------------------------------
// Journaling y Bloqueos
//Journaling:
// Es un registro de todas las operaciones realizadas en una base de datos, utilizado para recuperar datos en caso de fallos.
// Bloqueos:
// Mecanismo para evitar conflictos entre transacciones concurrentes. Por ejemplo, un bloqueo evita que dos usuarios editen el mismo registro al mismo tiempo.

const bloquearRegistro = async () => {
    const cliente = await pool.connect();
    try {
        await cliente.query('BEGIN');

        // Bloqueo de registro
        const result = await cliente.query('SELECT * FROM pedidos WHERE id = $1 FOR UPDATE', [1]);

        console.log('Pedido bloqueado:', result.rows[0]);

        // Modificar pedido
        await cliente.query('UPDATE pedidos SET estado = $1 WHERE id = $2', ['Confirmado', 1]);

        await cliente.query('COMMIT');
        console.log('Pedido actualizado y desbloqueado.');
    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error('Error al bloquear/modificar el pedido:', error.message);
    } finally {
        cliente.release();
    }
};

// bloquearRegistro();


//---------------------------------------------------
// Ejercicio 1: Sistema de Gestión de Reservas
// Consigna:
// Desarrolla un sistema de gestión de reservas para un hotel utilizando transacciones. Sigue los pasos:
// Base de datos: Crea una base de datos llamada hotel con las siguientes tablas:


// CREATE DATABASE hotel;

// -- Tabla habitaciones
// CREATE TABLE habitaciones (
//     id SERIAL PRIMARY KEY,
//     numero INT NOT NULL UNIQUE,
//     estado VARCHAR(10) NOT NULL DEFAULT 'libre'
// );

// -- Tabla reservas
// CREATE TABLE reservas (
//     id SERIAL PRIMARY KEY,
//     nombre_cliente VARCHAR(50) NOT NULL,
//     fecha_inicio DATE NOT NULL,
//     fecha_fin DATE NOT NULL,
//     habitacion INT NOT NULL,
//     CONSTRAINT fk_habitacion FOREIGN KEY (habitacion) REFERENCES habitaciones(numero)
// );

// INSERT INTO habitaciones (numero, estado) 
// VALUES 
//     (101, 'libre'),
//     (102, 'libre'),
//     (103, 'libre'),
//     (104, 'libre'),
//     (105, 'libre');

// INSERT INTO reservas (nombre_cliente, fecha_inicio, fecha_fin, habitacion) 
// VALUES 
//     ('Juan Pérez', '2024-12-01', '2024-12-05', 101),
//     ('Ana López', '2024-12-02', '2024-12-06', 102),
//     ('Luis Martínez', '2024-12-03', '2024-12-07', 103),
//     ('María Fernández', '2024-12-04', '2024-12-08', 104),
//     ('Carlos García', '2024-12-05', '2024-12-09', 105);

//     hotel/
//     ├── controllers/
//     │   └── reservaController.js
//     ├── db/
//     │   └── config.js
//     ├── queries/
//     │   └── reservas.js
//     │   └── habitaciones.js
//     ├── .env
//     ├── index.js
//     └── package.json
    
// Implementa la lógica:
// Cuando un cliente hace una reserva, el sistema debe:
// Verificar que la habitación esté disponible (estado libre).
// Crear la reserva.
// Cambiar el estado de la habitación a ocupada.

// Si algo falla, la transacción debe revertirse.
// Requerimientos:
// Modulariza el proyecto en las carpetas controllers, db, y queries.
// Utiliza variables de entorno para la configuración de la base de datos.
// Maneja los errores adecuadamente.


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
