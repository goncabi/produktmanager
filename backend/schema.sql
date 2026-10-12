-- Datenbankschema des Produktmanagers.
--
-- Entspricht der ursprünglichen Datenbank, die direkt in der Render-Konsole
-- angelegt wurde und nie versioniert war (Spalten, Typen, Schlüssel aus einem
-- pg_dump der lokalen Kopie). Drei Korrekturen gegenüber dem Original:
--
--   * ingredients.name ist eindeutig. Ohne das legte jeder Serverstart die
--     Beispielzutaten noch einmal an.
--   * nutrition_info hat nur noch einen Fremdschlüssel auf products; das
--     Original hatte denselben doppelt.
--   * Die Zähler der IDs werden in populateDB.js nach den Beispieldaten
--     nachgezogen (siehe syncIdSequence).
--
-- Idempotent: der Server führt diese Datei bei jedem Start aus, vorhandene
-- Tabellen bleiben unverändert.

CREATE TABLE IF NOT EXISTS categories (
    category_id              SERIAL PRIMARY KEY,
    name                     VARCHAR(255),
    -- Übersetzungen: im Schema vorgesehen, vom Code noch nicht genutzt.
    translation1             VARCHAR(255),
    translation2             VARCHAR(255),
    translation3             VARCHAR(255),
    description              TEXT,
    description_translation1 TEXT,
    description_translation2 TEXT,
    description_translation3 TEXT
);

CREATE TABLE IF NOT EXISTS manufacturers (
    manufacturer_id SERIAL PRIMARY KEY,
    name            VARCHAR(255),
    address         TEXT,
    country         VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS products (
    product_id               SERIAL PRIMARY KEY,
    category_id              INTEGER REFERENCES categories (category_id),
    manufacturer_id          INTEGER REFERENCES manufacturers (manufacturer_id),
    ean_gtin                 VARCHAR(50) UNIQUE,
    sku_plu                  VARCHAR(50),
    name                     VARCHAR(255) NOT NULL,
    translation1             VARCHAR(255),
    translation2             VARCHAR(255),
    translation3             VARCHAR(255),
    description              TEXT,
    description_translation1 TEXT,
    description_translation2 TEXT,
    description_translation3 TEXT,
    image_url                TEXT,
    price_delivery           NUMERIC(10, 2),
    price_pickup             NUMERIC(10, 2),
    net_weight_g             INTEGER,
    net_volume_l             DOUBLE PRECISION,
    gross_weight_g           INTEGER,
    alcohol_volume           DOUBLE PRECISION,
    caffeine_mg              INTEGER,
    deposit_amount           NUMERIC(10, 2)
);

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL UNIQUE
);

-- n:m zwischen Produkten und Zutaten. Der Primärschlüssel verhindert doppelte
-- Zuordnungen; routes/products.js fängt genau diesen Fehler (23505) ab.
CREATE TABLE IF NOT EXISTS product_ingredients (
    product_id    INTEGER NOT NULL REFERENCES products (product_id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL REFERENCES ingredients (ingredient_id),
    PRIMARY KEY (product_id, ingredient_id)
);

-- Höchstens eine Zeile pro Produkt (das PUT nutzt ON CONFLICT (product_id)).
-- ON DELETE CASCADE, weil die DELETE-Route nur product_ingredients vorher löscht.
CREATE TABLE IF NOT EXISTS nutrition_info (
    nutrition_id    SERIAL PRIMARY KEY,
    product_id      INTEGER UNIQUE REFERENCES products (product_id) ON DELETE CASCADE,
    energy_kcal     INTEGER,
    protein_g       DOUBLE PRECISION,
    fat_g           DOUBLE PRECISION,
    saturated_fat_g DOUBLE PRECISION,
    carbohydrates_g DOUBLE PRECISION,
    sugar_g         DOUBLE PRECISION,
    fiber_g         DOUBLE PRECISION,
    sodium_mg       DOUBLE PRECISION
);
