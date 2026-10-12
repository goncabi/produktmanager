# Produktmanager

A full-stack web application for managing grocery product data: products,
categories, manufacturers, ingredients and nutrition facts, backed by a
normalized PostgreSQL schema.

**Stack:** Angular 22 · Angular Material · Node.js · Express · PostgreSQL · Vitest

![Product list](frontend/images/produktliste.png)

## Features

- **Create, view, edit and delete products**, each with its EAN/GTIN code,
  category, manufacturer, ingredient list and nutrition facts.
- **Search** across the product list.
- **Detail view** per product.
- **Seed data on startup:** the backend fills an empty database with sample
  products, so the app is usable right after the first run.
- **Confirmation dialogs** before destructive actions.

## Data model

The database is normalized instead of storing each product as one wide row
(full schema in [`backend/schema.sql`](backend/schema.sql)):

| Table | Holds |
| --- | --- |
| `products` | One row per product, with its EAN/GTIN code |
| `categories` | Product categories (beverages, snacks, frozen food…) |
| `manufacturers` | Name, address and country |
| `ingredients` | Each ingredient once |
| `product_ingredients` | Many-to-many link between products and ingredients |
| `nutrition_info` | Nutrition facts per product |

Products share manufacturers and ingredients, so updating a manufacturer's
address changes it everywhere at once.

## Project structure

```
frontend/   Angular app (components, services, environments)
backend/    Express REST API and PostgreSQL connection
```

The two parts started as separate repositories and were merged here with their
full commit history.

## REST API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get one product with its details |
| `GET` | `/api/products/categories` | List categories |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

## Running locally

**Requirements:** Node.js 22.22 or later (`.nvmrc` pins 24), npm, and a PostgreSQL database.

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your database credentials
npm run dev            # http://localhost:5000, restarts on file changes
```

To empty the database during development, run `npm run db:reset -- --yes`. The
sample data is loaded again on the next server start.

On startup the backend creates the tables from `backend/schema.sql` if they
are missing and loads the sample data, so an empty database is enough. The
connection uses SSL, as hosted databases require; set `DB_SSL=false` for a
local PostgreSQL without SSL (the default in `.env.example`).

### Frontend

```bash
cd frontend
npm install
npm start              # http://localhost:4200
npm test               # unit tests with Vitest
```

The frontend reads the API URL from `src/environments/`: `localhost:5000` in
development, the deployed backend in production.

## Screenshots

| Add a product | Product details | Edit a product |
| --- | --- | --- |
| ![Add a product](frontend/images/produkt_hinzufuegen.png) | ![Product details](frontend/images/produkt_details.png) | ![Edit a product](frontend/images/produkt_bearbeiten.png) |

The interface is in German.
