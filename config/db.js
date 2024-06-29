import { createPool } from 'mysql2/promise';

// Create a connection pool


const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'codoacodo-backend',
    connectionLimit: 5 
});                   




// test connection
pool.getConnection()
    .then(connection => {
        console.log('Conectado a la base de datos');
        connection.release();
    })
    .catch(error => {
        console.log('Error de conexión con la base de datos', error);
    });


export default pool;