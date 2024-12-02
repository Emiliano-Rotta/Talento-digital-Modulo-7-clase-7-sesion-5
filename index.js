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
