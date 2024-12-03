const { obtenerProductoPorId, actualizarStock } = require('../queries/products');
const { registrarVenta } = require('../queries/sales');
const pool = require('../db/config');

const gestionarVenta = async (productoId, cantidad) => {
    const clienteDB = await pool.connect();
    try {
        await clienteDB.query('BEGIN');

        // Obtener el producto
        const producto = await obtenerProductoPorId(productoId, clienteDB);
        if (!producto) throw new Error('El producto no existe.');
        if (producto.stock < cantidad) throw new Error('Stock insuficiente.');

        // Calcular el total
        const total = producto.precio * cantidad;

        // Registrar la venta
        const venta = await registrarVenta(productoId, cantidad, total, clienteDB);

        // Actualizar el stock
        const nuevoStock = producto.stock - cantidad;
        await actualizarStock(productoId, nuevoStock, clienteDB);

        await clienteDB.query('COMMIT');
        return venta;
    } catch (error) {
        await clienteDB.query('ROLLBACK');
        throw error;
    } finally {
        clienteDB.release();
    }
};

module.exports = { gestionarVenta };
