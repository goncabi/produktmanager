const express = require("express");
const cors = require("cors");
require("dotenv").config();
const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:4200",  // Zugang zum Angular
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());

// Routen
app.use("/api/products", productRoutes);

// Server starten
app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
