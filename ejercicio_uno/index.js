
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


const { gestionarReserva } = require('./controllers/reservaController');

const main = async () => {
    try {
        const reserva = await gestionarReserva('Juan Pérez', '2024-11-01', '2024-11-05', 1);
        console.log('Reserva creada:', reserva);
    } catch (error) {
        console.error('Error al gestionar la reserva:', error.message);
    }
};

main();
