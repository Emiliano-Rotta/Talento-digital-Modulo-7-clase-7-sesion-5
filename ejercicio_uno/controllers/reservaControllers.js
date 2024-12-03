const { crearReserva } = require('../queries/reservas');
const { verificarHabitacionDisponible, actualizarEstadoHabitacion } = require('../queries/habitaciones');
const pool = require('../db/config');

const gestionarReserva = async (cliente, fechaInicio, fechaFin, habitacion) => {
    const clienteDB = await pool.connect();
    try {
        await clienteDB.query('BEGIN');

        const disponible = await verificarHabitacionDisponible(habitacion, clienteDB);
        if (!disponible) throw new Error('La habitación no está disponible.');

        const reserva = await crearReserva(cliente, fechaInicio, fechaFin, habitacion, clienteDB);

        await actualizarEstadoHabitacion(habitacion, 'ocupada', clienteDB);

        await clienteDB.query('COMMIT');
        return reserva;
    } catch (error) {
        await clienteDB.query('ROLLBACK');
        throw error;
    } finally {
        clienteDB.release();
    }
};

module.exports = { gestionarReserva };
