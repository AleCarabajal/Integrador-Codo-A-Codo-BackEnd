import express from 'express';
import pool from './config/db.js';
import 'dotenv/config';
//import swal from 'sweetalert';
import Swal from 'sweetalert2';


// const Swal = require('sweetalert2');
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

console.log(producto)

    // Asegúrate de que req.body contenga los datos necesarios para el producto
    if (!producto.nombre || !producto.precio) {
        return res.status(400).send('Nombre y precio del producto son obligatorios.');
    }


    const sql = `INSERT INTO productos SET ?`;
   

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [producto]);
        connection.release();
        res.send(`
            <h1>Un nuevo Producto con id: ${rows.insertId} fué creado exitosamente. </h1>
        `);
       Swal.fire({
            icon: 'success',
            title: 'Producto insertado correctamente',
            text: `Un nuevo Producto con id: ${rows.insertId} fué creado exitosamente.`,
           // text: `El producto ${nuevoProducto.nombre} ha sido añadido.`,
        });



    } catch (error) {
        res.send(error)
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



app.get('/api/productos', async (req, res) => {

    let filtros = req.query
    /*
		{
			nombre: 'pc',
			precioMin: 100,
			precioMax: 200,
            descripcion: 'gamer',
			orden: 'asc',
			pagina: 1,
			tamanoPagina: 10
		}
	*/

    let consulta = 'SELECT * FROM productos'
    let whereClause = ''
    let values = []

    if (filtros.nombre) {
        whereClause += ` nombre LIKE '%${filtros.nombre}%' AND`
    }

    if (filtros.descripcion) {
         whereClause += ` descripcion LIKE '%${filtros.descripcion}%' AND`
    }

    if (filtros.precioMin) {
        whereClause += ` precio >= ? AND`
        values.push(filtros.precioMin)
    }

    if (filtros.precioMax) {
        whereClause += ` precio <= ? AND`
        values.push(filtros.precioMax)
    }

// "SELECT * FROM productos WHERE nombre LIKE '%pc%' AND precio >= ? AND precio <= ? AND descripcion LIKE '%gamer%' ORDER BY precio asc", [100, 200]
    if (whereClause !== '') {
        whereClause = ' WHERE' + whereClause.slice(0, -3)
        consulta += whereClause;
    }

    if (filtros.orden) {
        consulta += ` ORDER BY precio ${filtros.orden}`
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(consulta, values);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Hubo un error al consultar la base de datos:', error);
		res.status(500).send('Hubo un error al consultar la base de datos');
    }

});


