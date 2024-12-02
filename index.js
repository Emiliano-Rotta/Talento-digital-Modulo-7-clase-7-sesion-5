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

bloquearRegistro();
