const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// 📌 Obtener todos los productos con sus relaciones
router.get("/", async (req, res) => {
    try {
        const productsQuery = `
            SELECT
                p.product_id,
                p.ean_gtin,
                p.sku_plu,
                p.name,
                p.description,
                p.image_url,
                p.price_delivery,
                p.price_pickup,
                p.net_weight_g,
                p.net_volume_l,
                p.gross_weight_g,
                p.alcohol_volume,
                p.caffeine_mg,
                p.deposit_amount,
                c.category_id,
                c.name AS category_name,
                m.manufacturer_id,
                m.name AS manufacturer_name,
                m.address AS manufacturer_address,
                m.country AS manufacturer_country,
                -- 🔹 Agrupar ingredientes en una lista separada por comas
                COALESCE(string_agg(DISTINCT i.name, ', '), '') AS ingredient_names,
                n.energy_kcal,
                n.protein_g,
                n.fat_g,
                n.saturated_fat_g,
                n.carbohydrates_g,
                n.sugar_g,
                n.fiber_g,
                n.sodium_mg
            FROM
                products p
                    LEFT JOIN categories c ON p.category_id = c.category_id
                    LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
                    LEFT JOIN product_ingredients pi ON p.product_id = pi.product_id
                    LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
                    LEFT JOIN nutrition_info n ON p.product_id = n.product_id
            GROUP BY p.product_id, c.category_id, m.manufacturer_id,
                     n.energy_kcal, n.protein_g, n.fat_g, n.saturated_fat_g,
                     n.carbohydrates_g, n.sugar_g, n.fiber_g, n.sodium_mg;
        `;

        const productsResult = await pool.query(productsQuery);
        const products = productsResult.rows;

        // Formatear los datos de productos
        const formattedProducts = products.map(product => {
            // Formatear los ingredientes
            const ingredients = products.filter(p => product.product_id === p.product_id)
                .map(p => ({ name: p.ingredient_name }));

            // Formatear la información nutricional
            const nutritionInfo = {
                energy_kcal: product.energy_kcal,
                protein_g: product.protein_g,
                fat_g: product.fat_g,
                saturated_fat_g: product.saturated_fat_g,
                carbohydrates_g: product.carbohydrates_g,
                sugar_g: product.sugar_g,
                fiber_g: product.fiber_g,
                sodium_mg: product.sodium_mg
            };

            return {
                product_id: product.product_id,
                ean_gtin: product.ean_gtin,
                sku_plu: product.sku_plu,
                name: product.name,
                description: product.description,
                image_url: product.image_url,
                price_delivery: product.price_delivery,
                price_pickup: product.price_pickup,
                net_weight_g: product.net_weight_g,
                net_volume_l: product.net_volume_l,
                gross_weight_g: product.gross_weight_g,
                alcohol_volume: product.alcohol_volume,
                caffeine_mg: product.caffeine_mg,
                deposit_amount: product.deposit_amount,
                // 🔹 Convertir la cadena de ingredientes en un array
                ingredients: product.ingredient_names ? product.ingredient_names.split(', ').map(name => ({ name })) : [],
                nutritionInfo,
                category: {
                    category_id: product.category_id,
                    name: product.category_name
                },
                manufacturer: {
                    manufacturer_id: product.manufacturer_id,
                    name: product.manufacturer_name,
                    address: product.manufacturer_address,
                    country: product.manufacturer_country
                }
            };
        });

        res.json(formattedProducts);
    } catch (error) {
        console.error("Fehler beim Abrufen der Produkte:", error);
        res.status(500).json({ error: "Interner Serverfehler." });
    }
});

// 📌 Obtener un producto específico con sus relaciones
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const productQuery = `
            SELECT 
                p.product_id, 
                p.ean_gtin, 
                p.sku_plu, 
                p.name, 
                p.description, 
                p.image_url,
                p.price_delivery, 
                p.price_pickup, 
                p.net_weight_g, 
                p.net_volume_l, 
                p.gross_weight_g, 
                p.alcohol_volume, 
                p.caffeine_mg, 
                p.deposit_amount,
                c.category_id, 
                c.name AS category_name,
                m.manufacturer_id, 
                m.name AS manufacturer_name, 
                m.address AS manufacturer_address, 
                m.country AS manufacturer_country,
                i.name AS ingredient_name,
                n.energy_kcal, 
                n.protein_g, 
                n.fat_g, 
                n.saturated_fat_g, 
                n.carbohydrates_g, 
                n.sugar_g, 
                n.fiber_g, 
                n.sodium_mg
            FROM 
                products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN manufacturers m ON p.manufacturer_id = m.manufacturer_id
            LEFT JOIN product_ingredients pi ON p.product_id = pi.product_id
            LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
            LEFT JOIN nutrition_info n ON p.product_id = n.product_id
            WHERE p.product_id = $1;
        `;

        const productResult = await pool.query(productQuery, [id]);

        if (productResult.rows.length === 0) {
            return res.status(404).json({ message: "Produkt nicht gefunden" });
        }

        const product = productResult.rows[0];

        // Formateamos los ingredientes
        const ingredients = productResult.rows.map(row => ({ name: row.ingredient_name }));

        const nutritionInfo = {
            energy_kcal: product.energy_kcal,
            protein_g: product.protein_g,
            fat_g: product.fat_g,
            saturated_fat_g: product.saturated_fat_g,
            carbohydrates_g: product.carbohydrates_g,
            sugar_g: product.sugar_g,
            fiber_g: product.fiber_g,
            sodium_mg: product.sodium_mg
        };

        // Respuesta final con los datos del producto y sus relaciones
        res.json({
            product_id: product.product_id,
            ean_gtin: product.ean_gtin,
            sku_plu: product.sku_plu,
            name: product.name,
            description: product.description,
            image_url: product.image_url,
            price_delivery: product.price_delivery,
            price_pickup: product.price_pickup,
            net_weight_g: product.net_weight_g,
            net_volume_l: product.net_volume_l,
            gross_weight_g: product.gross_weight_g,
            alcohol_volume: product.alcohol_volume,
            caffeine_mg: product.caffeine_mg,
            deposit_amount: product.deposit_amount,
            ingredients,
            nutritionInfo,
            category: {
                category_id: product.category_id,
                name: product.category_name
            },
            manufacturer: {
                manufacturer_id: product.manufacturer_id,
                name: product.manufacturer_name,
                address: product.manufacturer_address,
                country: product.manufacturer_country
            }
        });
    } catch (error) {
        console.error("Fehler beim Abrufen des Produkts:", error);
        res.status(500).json({ error: "Interner Serverfehler." });
    }
});
// Crear un nuevo producto
router.post("/", async (req, res) => {
    const {
        category_name, // Nombre de la categoría elegido por el usuario
        manufacturer_name,
        manufacturer_address,
        manufacturer_country,
        ean_gtin,
        sku_plu,
        name,
        description = "",
        image_url = "",
        price_delivery = 0,
        price_pickup = 0,
        net_weight_g = 0,
        net_volume_l = 0,
        gross_weight_g = 0,
        alcohol_volume = 0,
        caffeine_mg = 0,
        deposit_amount = 0,
        ingredients = [],
        nutrition_info = {}  // Cambié aquí a nutrition_info
    } = req.body;

    if (!ean_gtin || !name) {
        return res.status(400).json({ error: "Sowohl 'name' als auch 'ean_gtin' sind erforderlich." });
    }

    try {
        let category_id = null;
        let manufacturer_id = null;

        // Verificar si el `ean_gtin` ya existe
        const existingProduct = await pool.query(
            `SELECT product_id FROM products WHERE ean_gtin = $1;`, [ean_gtin]
        );
        if (existingProduct.rowCount > 0) {
            return res.status(400).json({ error: "Produkt mit diesem EAN/GTIN existiert bereits." });
        }

        // Obtener el `category_id` desde la base de datos usando el nombre de la categoría
        const categoryResult = await pool.query(
            `SELECT category_id FROM categories WHERE name = $1;`, [category_name]
        );

        if (categoryResult.rowCount === 0) {
            return res.status(400).json({ error: "Kategorie existiert nicht." });
        }

        category_id = categoryResult.rows[0].category_id;

        // Insertar el fabricante
        const manufacturerResult = await pool.query(
            `INSERT INTO manufacturers (name, address, country)
             VALUES ($1, $2, $3)
             RETURNING manufacturer_id;`,
            [manufacturer_name, manufacturer_address, manufacturer_country]
        );
        manufacturer_id = manufacturerResult.rows[0].manufacturer_id;

        // Insertar el producto con el `category_id` obtenido
        const productResult = await pool.query(
            `INSERT INTO products
             (category_id, manufacturer_id, ean_gtin, sku_plu, name, description,
              image_url, price_delivery, price_pickup, net_weight_g, net_volume_l,
              gross_weight_g, alcohol_volume, caffeine_mg, deposit_amount)
             VALUES
                 ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                 RETURNING product_id;`,
            [category_id, manufacturer_id, ean_gtin, sku_plu, name, description,
                image_url, price_delivery, price_pickup, net_weight_g, net_volume_l,
                gross_weight_g, alcohol_volume, caffeine_mg, deposit_amount]
        );

        const product_id = productResult.rows[0].product_id;

        // Insertar los ingredientes (si es necesario)
        if (ingredients.length > 0) {
            for (const ingredient of ingredients) {
                const ingredientResult = await pool.query(
                    `SELECT ingredient_id FROM ingredients WHERE name = $1;`, [ingredient]
                );

                let ingredient_id;
                if (ingredientResult.rowCount > 0) {
                    ingredient_id = ingredientResult.rows[0].ingredient_id;
                } else {
                    const insertIngredientResult = await pool.query(
                        `INSERT INTO ingredients (name) VALUES ($1) RETURNING ingredient_id;`, [ingredient]
                    );
                    ingredient_id = insertIngredientResult.rows[0].ingredient_id;
                }

                await pool.query(
                    `INSERT INTO product_ingredients (product_id, ingredient_id)
                     VALUES ($1, $2);`,
                    [product_id, ingredient_id]
                );
            }
        }

        // Insertar información nutricional
        if (Object.keys(nutrition_info).length > 0) {
            await pool.query(
                `INSERT INTO nutrition_info (product_id, energy_kcal, protein_g, fat_g, saturated_fat_g,
                                             carbohydrates_g, sugar_g, fiber_g, sodium_mg)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [product_id,
                    nutrition_info.energy_kcal || 0,
                    nutrition_info.protein_g || 0,
                    nutrition_info.fat_g || 0,
                    nutrition_info.saturated_fat_g || 0,
                    nutrition_info.carbohydrates_g || 0,
                    nutrition_info.sugar_g || 0,
                    nutrition_info.fiber_g || 0,
                    nutrition_info.sodium_mg || 0]
            );
        }

        res.status(201).json({ message: "Produkt erfolgreich erstellt.", product_id: product_id });
    } catch (error) {
        console.error("Fehler beim Erstellen des Produkts:", error);
        res.status(500).json({ error: "Interner Serverfehler." });
    }
});

// 📌 Actualizar un producto
router.put("/:id", async (req, res) => {
    const {
        category_name,
        manufacturer_name,
        manufacturer_address,
        manufacturer_country,
        ean_gtin,
        sku_plu,
        name,
        description = "",
        image_url = "",
        price_delivery = 0,
        price_pickup = 0,
        net_weight_g = 0,
        net_volume_l = 0,
        gross_weight_g = 0,
        alcohol_volume = 0,
        caffeine_mg = 0,
        deposit_amount = 0,
        ingredients = [],
        nutrition_info = {}  // Cambié aquí a nutrition_info
    } = req.body;

    if (!ean_gtin || !name) {
        return res.status(400).json({ error: "Sowohl 'name' als auch 'ean_gtin' sind erforderlich." });
    }

    try {
        let category_id = null;
        let manufacturer_id = null;

        // Verificar si el producto existe
        const existingProduct = await pool.query(
            `SELECT product_id FROM products WHERE product_id = $1;`, [req.params.id]
        );
        if (existingProduct.rowCount === 0) {
            return res.status(400).json({ error: "Produkt nicht gefunden." });
        }

        // Actualizar la categoría si se pasa un nuevo nombre
        if (category_name) {
            const categoryResult = await pool.query(
                `INSERT INTO categories (name)
                 VALUES ($1)
                 RETURNING category_id;`, [category_name]
            );
            category_id = categoryResult.rows[0].category_id;
        }

        // Actualizar el fabricante si se pasa un nuevo nombre o dirección
        if (manufacturer_name) {
            const manufacturerResult = await pool.query(
                `INSERT INTO manufacturers (name, address, country)
                 VALUES ($1, $2, $3)
                 RETURNING manufacturer_id;`,
                [manufacturer_name, manufacturer_address, manufacturer_country]
            );
            manufacturer_id = manufacturerResult.rows[0].manufacturer_id;
        }

        // Actualizar el producto
        const productResult = await pool.query(
            `UPDATE products
             SET category_id = COALESCE($1, category_id), manufacturer_id = COALESCE($2, manufacturer_id),
                 ean_gtin = COALESCE($3, ean_gtin), sku_plu = COALESCE($4, sku_plu),
                 name = COALESCE($5, name), description = COALESCE($6, description),
                 image_url = COALESCE($7, image_url), price_delivery = COALESCE($8, price_delivery),
                 price_pickup = COALESCE($9, price_pickup), net_weight_g = COALESCE($10, net_weight_g),
                 net_volume_l = COALESCE($11, net_volume_l), gross_weight_g = COALESCE($12, gross_weight_g),
                 alcohol_volume = COALESCE($13, alcohol_volume), caffeine_mg = COALESCE($14, caffeine_mg),
                 deposit_amount = COALESCE($15, deposit_amount)
             WHERE product_id = $16
             RETURNING product_id;`,
            [category_id, manufacturer_id, ean_gtin, sku_plu, name, description, image_url,
                price_delivery, price_pickup, net_weight_g, net_volume_l, gross_weight_g, alcohol_volume,
                caffeine_mg, deposit_amount, req.params.id]
        );

        const product_id = productResult.rows[0].product_id;

        // Actualizar los ingredientes
        if (ingredients.length > 0) {
            // Limpiar los ingredientes existentes y luego agregar los nuevos
            await pool.query(`DELETE FROM product_ingredients WHERE product_id = $1;`, [product_id]);
            for (const ingredient of ingredients) {
                const ingredientResult = await pool.query(
                    `SELECT ingredient_id FROM ingredients WHERE name = $1;`, [ingredient]
                );

                let ingredient_id;
                if (ingredientResult.rowCount > 0) {
                    ingredient_id = ingredientResult.rows[0].ingredient_id;
                } else {
                    const insertIngredientResult = await pool.query(
                        `INSERT INTO ingredients (name) VALUES ($1) RETURNING ingredient_id;`, [ingredient]
                    );
                    ingredient_id = insertIngredientResult.rows[0].ingredient_id;
                }

                await pool.query(
                    `INSERT INTO product_ingredients (product_id, ingredient_id)
                     VALUES ($1, $2);`,
                    [product_id, ingredient_id]
                );
            }
        }

        // Actualizar la información nutricional
        if (Object.keys(nutrition_info).length > 0) {
            await pool.query(
                `INSERT INTO nutrition_info (product_id, energy_kcal, protein_g, fat_g, saturated_fat_g,
                                     carbohydrates_g, sugar_g, fiber_g, sodium_mg)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (product_id) 
         DO UPDATE 
         SET 
             energy_kcal = EXCLUDED.energy_kcal,
             protein_g = EXCLUDED.protein_g,
             fat_g = EXCLUDED.fat_g,
             saturated_fat_g = EXCLUDED.saturated_fat_g,
             carbohydrates_g = EXCLUDED.carbohydrates_g,
             sugar_g = EXCLUDED.sugar_g,
             fiber_g = EXCLUDED.fiber_g,
             sodium_mg = EXCLUDED.sodium_mg;`,
                [product_id,
                    nutrition_info.energy_kcal || 0,
                    nutrition_info.protein_g || 0,
                    nutrition_info.fat_g || 0,
                    nutrition_info.saturated_fat_g || 0,
                    nutrition_info.carbohydrates_g || 0,
                    nutrition_info.sugar_g || 0,
                    nutrition_info.fiber_g || 0,
                    nutrition_info.sodium_mg || 0]
            );
        }


        res.status(200).json({ message: "Produkt erfolgreich aktualisiert.", product_id: product_id });
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Produkts:", error);
        res.status(500).json({ error: "Interner Serverfehler." });
    }
});
// Produkt löschen
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Zuerst alle Beziehungen zu Produkt-Zutaten löschen
        await pool.query(
            `DELETE FROM product_ingredients WHERE product_id = $1;`,
            [id]
        );

        // Dann das Produkt löschen
        const result = await pool.query(
            `DELETE FROM products WHERE product_id = $1 RETURNING product_id;`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Produkt nicht gefunden" });
        }

        res.status(200).json({ message: "Produkt gelöscht", product_id: id });
    } catch (error) {
        console.error("Fehler beim Löschen des Produkts:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});

// Alle Produkte löschen (mit vorheriger Löschung der Produkt-Zutaten)
router.delete("/", async (req, res) => {
    try {
        // Zuerst alle Zutaten für Produkte löschen
        await pool.query(`DELETE FROM product_ingredients;`);

        // Dann alle Produkte löschen
        const result = await pool.query(`DELETE FROM products RETURNING product_id;`);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Keine Produkte zum Löschen gefunden" });
        }

        res.status(200).json({ message: "Alle Produkte gelöscht" });
    } catch (error) {
        console.error("Fehler beim Löschen aller Produkte:", error);
        res.status(500).json({ error: "Interner Serverfehler" });
    }
});


module.exports = router;