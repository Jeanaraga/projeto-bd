const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dashboardWebVendas',
    password: '0403',
    port: 5432
});

module.exports = pool;