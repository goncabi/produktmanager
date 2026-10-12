require("dotenv").config();
const { Pool } = require("pg");

// PostgreSQL-Verbindung
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});
pool.connect()
    .then((client) => {
        console.log("💾 PostgreSQL erfolgreich verbunden!");
        // Die Testverbindung zurückgeben, sonst bleibt sie für immer belegt.
        client.release();
    })
    .catch(err => console.error("❌ Verbindung fehlgeschlagen:", err));

module.exports = pool;
