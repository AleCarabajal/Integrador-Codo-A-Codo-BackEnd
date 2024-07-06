import { createPool } from 'mysql2/promise'; // Importa la función createPool de la librería mysql2, la cual soporta promesas.

// Crear un pool de conexiones a la base de datos

const pool = createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    connectionLimit: 5 // Límite de conexiones simultáneas al pool. Se puede modificar según los requisitos.

/*   para probar localmente
    host: process.env.MYSQL_ADDON_HOST || 'b60xyercrycn2fhfu3w8-mysql.services.clever-cloud.com',
    user: process.env.MYSQL_ADDON_USER || 'u23tzliopjcgdniu',
    password: process.env.MYSQL_ADDON_PASSWORD || '28B404Fdvkd3FdkiRBVm',
    database: process.env.MYSQL_ADDON_DB || 'b60xyercrycn2fhfu3w8',
    connectionLimit: 5 // Límite de conexiones simultáneas al pool. Se puede modificar según los requisitos.

*/
});                                            

// Prueba de conexión
pool.getConnection()
    .then(connection => {
        console.log('Conectado a la base de datos'); // Si la conexión se realiza exitosamente imprime el mensaje en consola
        connection.release(); //Libera la conexión de vuelta al pool
    })
    .catch(error => {
        console.log('Error de conexión con la base de datos', error); // Si hay un error, se imprime el error en la consola
    });


export default pool;