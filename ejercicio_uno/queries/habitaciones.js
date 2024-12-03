const verificarHabitacionDisponible = async (habitacion, clienteDB) => {
    const query = `SELECT estado FROM habitaciones WHERE numero = $1`;
    const result = await clienteDB.query(query, [habitacion]);
    return result.rows[0].estado === 'libre';
};

const actualizarEstadoHabitacion = async (habitacion, estado, clienteDB) => {
    const query = `UPDATE habitaciones SET estado = $1 WHERE numero = $2`;
    await clienteDB.query(query, [estado, habitacion]);
};

module.exports = { verificarHabitacionDisponible, actualizarEstadoHabitacion };
