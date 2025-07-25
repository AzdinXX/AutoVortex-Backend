const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'autovortex_bd',
})

module.exports = pool;