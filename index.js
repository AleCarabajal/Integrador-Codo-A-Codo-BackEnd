import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';

const app = express();
const puerto = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/productos', async (req, res) => {
    const sql = `SELECT productos.id_producto, productos.nombre, productos.precio, productos.descripcion, productos.stock, 
                categorias.nombre AS categoria, promociones.promociones AS tarjetas, promociones.descuento, 
                cuotas.cuotas, cuotas.interes
                FROM productos 
                JOIN categorias ON productos.fk_categoria = categorias.id_categoria
                JOIN promociones ON productos.fk_promo = promociones.id_promo
                JOIN cuotas ON productos.fk_cuotas = cuotas.id_cuotas
                ORDER By productos.precio DESC`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql);
        connection.release();
        res.json(rows);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

app.get('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `SELECT productos.nombre, productos.precio, productos.descripcion, productos.stock, 
                categorias.nombre AS categoria, promociones.promociones AS tarjetas, promociones.descuento, 
                cuotas.cuotas, cuotas.interes
                FROM productos 
                JOIN categorias ON productos.fk_categoria = categorias.id_categoria
                JOIN promociones ON productos.fk_promo = promociones.id_promo
                JOIN cuotas ON productos.fk_cuotas = cuotas.id_cuotas
                WHERE productos.id_producto = ?
                ORDER By productos.precio DESC`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log("MOSTRANDO UN PRODUCTO --> ", rows);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

app.post('/productos', async (req, res) => {
    const producto = req.body;
    const sql = `INSERT INTO productos SET ?`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [producto]);
        connection.release();
        res.send(`
            <h1>Un nuevo Producto con id: ${rows.insertId} fué creado exitosamente. </h1>
        `);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

app.put('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const producto = req.body;
    const sql = `UPDATE productos SET ? WHERE id_producto = ?`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [producto, id]);
        connection.release();
        console.log(rows);
        res.send(`
            <h1>El producto con el id ${id} fué actualizado correctamente </h1>
        `);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

app.delete('/productos/:id', async (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM productos WHERE id_producto = ?`;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [id]);
        connection.release();
        console.log(rows);
        res.send(`
            <h1>El producto con el id ${id} fué eliminado exitosamente </h1>
        `);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
});

app.listen(puerto, () => {
    console.log('Server started on port 3000');
});
