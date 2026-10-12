// Leert alle Tabellen der Datenbank. Nur für die lokale Entwicklung.
//
// Früher war das die Route DELETE /api/products/reset, ohne jede
// Authentifizierung: Wer die URL kannte, konnte die Produktionsdatenbank
// leeren. Als lokales Skript braucht es Zugriff auf die .env.
//
// Aufruf: npm run db:reset -- --yes
require("dotenv").config();
const pool = require("../config/db");

// Reihenfolge wegen der Fremdschlüssel: erst die abhängigen Tabellen.
const TABLES = [
    "product_ingredients",
    "nutrition_info",
    "products",
    "categories",
    "manufacturers",
    "ingredients",
];

async function reset() {
    if (!process.argv.includes("--yes")) {
        console.error("Löscht ALLE Daten. Zum Bestätigen: npm run db:reset -- --yes");
        process.exitCode = 1;
        return;
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        for (const table of TABLES) {
            await client.query(`DELETE FROM ${table};`);
        }
        await client.query("COMMIT");
        console.log("✅ Datenbank erfolgreich zurückgesetzt. Beim nächsten Serverstart werden die Beispieldaten neu geladen.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Fehler beim Zurücksetzen der Datenbank:", error.message);
        process.exitCode = 1;
    } finally {
        client.release();
    }
}

reset().finally(() => pool.end());
