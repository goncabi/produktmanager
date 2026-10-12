const express = require("express");
const cors = require("cors");
require("dotenv").config();
const productRoutes = require("./routes/products");
const populateDatabase = require("./populateDB");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ["http://localhost:4200", "https://produktmanager-frontend.onrender.com"], // Zugang zum Angular
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());

// Datenbank automatisch ausfüllen
populateDatabase();

// Routen
app.use("/api/products", productRoutes);

// Startseite der API: zeigt, dass der Dienst läuft und wo die Daten liegen.
app.get("/", (req, res) => {
    res.json({ service: "produktmanager-backend", status: "ok", products: "/api/products" });
});


// Server starten
app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
