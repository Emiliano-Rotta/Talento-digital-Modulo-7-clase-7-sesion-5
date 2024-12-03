const obtenerProductoPorId = async (id, clienteDB) => {
    const query = `SELECT * FROM productos WHERE id = $1`;
    const result = await clienteDB.query(query, [id]);
    return result.rows[0];
};

const actualizarStock = async (id, nuevoStock, clienteDB) => {
    const query = `UPDATE productos SET stock = $1 WHERE id = $2`;
    await clienteDB.query(query, [nuevoStock, id]);
};

module.exports = { obtenerProductoPorId, actualizarStock };
