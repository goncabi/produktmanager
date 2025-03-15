const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// 📌 Obtener todos los productos con sus relaciones
router.get("/", async (req, res) => {
    console.log("GET /products wurde aufgerufen");
    try {
        const productsQuery = `
            SELECT p.*,
                   c.id AS category_id, c.name AS category_name,
                   m.id AS manufacturer_id, m.name AS manufacturer_name,
                   m.address AS manufacturer_address, m.country AS manufacturer_country
            FROM products p
                     LEFT JOIN categories c ON p.category_id = c.id
                     LEFT JOIN manufacturers m ON p.manufacturer_id = m.id;
        `;
        const productsResult = await pool.query(productsQuery);
        const products = productsResult.rows;

        for (let product of products) {
            // Obtener ingredientes del producto
            const ingredientsQuery = `
                SELECT name FROM ingredients WHERE product_id = $1;
            `;
            const ingredientsResult = await pool.query(ingredientsQuery, [product.id]);
            product.ingredients = ingredientsResult.rows.map(row => row.name); // Solo devolver nombres

            // Obtener información nutricional del producto
            const nutritionQuery = `
                SELECT energy_kcal, protein_g, fat_g, saturated_fat_g,
                       carbohydrates_g, sugar_g, fiber_g, sodium_mg
                FROM nutrition_info WHERE product_id = $1;
            `;
            const nutritionResult = await pool.query(nutritionQuery, [product.id]);
            product.nutritionInfo = nutritionResult.rows[0] || null; // Si no hay datos, poner `null`

            // 📌 Agrupar los datos de la categoría
            product.category = {
                id: product.category_id,
                name: product.category_name
            };
            delete product.category_id;
            delete product.category_name;

            // 📌 Agrupar los datos del fabricante
            product.manufacturer = {
                id: product.manufacturer_id,
                name: product.manufacturer_name,
                address: product.manufacturer_address,
                country: product.manufacturer_country
            };
            delete product.manufacturer_id;
            delete product.manufacturer_name;
            delete product.manufacturer_address;
            delete product.manufacturer_country;
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Obtener un solo producto con sus relaciones
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const productQuery = `
            SELECT p.*, 
                   c.id AS category_id, c.name AS category_name, 
                   m.id AS manufacturer_id, m.name AS manufacturer_name, 
                   m.address AS manufacturer_address, m.country AS manufacturer_country
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN manufacturers m ON p.manufacturer_id = m.id
            WHERE p.id = $1;
        `;
        const productResult = await pool.query(productQuery, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ message: "Produkt nicht gefunden" });
        }

        let product = productResult.rows[0];

        // Obtener ingredientes del producto
        const ingredientsQuery = `SELECT name FROM ingredients WHERE product_id = $1;`;
        const ingredientsResult = await pool.query(ingredientsQuery, [id]);
        product.ingredients = ingredientsResult.rows.map(row => row.name); // Solo nombres

        // Obtener información nutricional del producto
        const nutritionQuery = `
            SELECT energy_kcal, protein_g, fat_g, saturated_fat_g, 
                   carbohydrates_g, sugar_g, fiber_g, sodium_mg 
            FROM nutrition_info WHERE product_id = $1;
        `;
        const nutritionResult = await pool.query(nutritionQuery, [id]);
        product.nutritionInfo = nutritionResult.rows[0] || null;

        // 📌 Agrupar los datos de la categoría
        product.category = {
            id: product.category_id,
            name: product.category_name
        };
        delete product.category_id;
        delete product.category_name;

        // 📌 Agrupar los datos del fabricante
        product.manufacturer = {
            id: product.manufacturer_id,
            name: product.manufacturer_name,
            address: product.manufacturer_address,
            country: product.manufacturer_country
        };
        delete product.manufacturer_id;
        delete product.manufacturer_name;
        delete product.manufacturer_address;
        delete product.manufacturer_country;

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
