require("dotenv").config();
const { Pool, types } = require("pg");

// NUMERIC kommt von pg als String ("1.50"). Das Frontend erwartet Zahlen.
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value));

// PostgreSQL-Verbindung
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Gehostete Datenbanken (Render, Neon) verlangen SSL; ein lokales
    // PostgreSQL meist nicht. Lokal: DB_SSL=false in der .env.
    ssl: process.env.DB_SSL === "false" ? false : { rejectUnauthorized: false }
});
pool.connect()
    .then((client) => {
        console.log("💾 PostgreSQL erfolgreich verbunden!");
        // Die Testverbindung zurückgeben, sonst bleibt sie für immer belegt.
        client.release();
    })
    .catch(err => console.error("❌ Verbindung fehlgeschlagen:", err));

module.exports = pool;
