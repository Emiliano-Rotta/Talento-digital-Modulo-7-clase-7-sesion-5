const crearReserva = async (cliente, fechaInicio, fechaFin, habitacion, clienteDB) => {
    const query = `
        INSERT INTO reservas (nombre_cliente, fecha_inicio, fecha_fin, habitacion) 
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [cliente, fechaInicio, fechaFin, habitacion];
    const result = await clienteDB.query(query, values);
    return result.rows[0];
};

module.exports = { crearReserva };
