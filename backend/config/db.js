require("dotenv").config();
const { Pool } = require("pg");

// PostgreSQL-Verbindung
const pool = new Pool({
    user: process.env.DB_USER || "admin",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
});

pool.connect()
    .then(() => console.log("💾 PostgreSQL erfolgreich verbunden!"))
    .catch(err => console.error("❌ Verbindung fehlgeschlagen:", err));

module.exports = pool;
