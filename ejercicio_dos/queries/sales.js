const registrarVenta = async (productoId, cantidad, total, clienteDB) => {
    const query = `
        INSERT INTO ventas (producto_id, cantidad, total) 
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await clienteDB.query(query, [productoId, cantidad, total]);
    return result.rows[0];
};

module.exports = { registrarVenta };
