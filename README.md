# 📦 Inventory and Data Management System

A RESTful backend API built with **Node.js, Express.js and MongoDB** that helps a store or warehouse manage its product catalogue. You can create and update products, adjust stock safely, search and filter the catalogue, and generate inventory reports using MongoDB aggregation.

👤 **Author:** Manpreet Kaur
🎓 **Course:** Web Dev III, Assignment 3 (Unit 3)

---

## ✨ Features
- 🧱 **Product schema with validation** using Mongoose (required fields, minimum values, unique SKU, default values)
- ➕ **Full CRUD:** create, read, update and delete products
- 🔍 **Filtering** by category, price range and product name
- ↕️ **Sorting** (ascending or descending) and 📄 **pagination**
- 🔄 **Safe stock adjustment:** one API for restock and sale, and stock can never go below zero
- ⚠️ **Low-stock alert report** using an aggregation pipeline
- 📊 **Category-wise inventory summary** using an aggregation pipeline
- 🛡️ **Centralized error handling** and an input validation middleware
- 🔐 **Environment variables** managed with dotenv

---

## 🛠️ Tech Stack
| Technology | Purpose |
|---|---|
| Node.js | Server-side runtime |
| Express.js | Routing and middleware |
| MongoDB | Database |
| Mongoose | Schema, validation and queries |
| dotenv | Environment variables |

---

## 📁 Project Structure
```
inventory-system-wd3/
├── controllers/
│   └── productController.js   # logic for each API
├── middleware/
│   ├── errorHandler.js        # central error handling
│   └── validateStock.js       # input validation for the stock API
├── models/
│   └── Product.js             # product schema and validation rules
├── routes/
│   └── productRoutes.js       # connects URLs to controller functions
├── .env.example               # sample environment variables
├── package.json
└── server.js                  # starts the server and connects to MongoDB
```

---

## 🚀 Setup and Installation

**Requirements:** Node.js and MongoDB (installed locally, or a MongoDB Atlas connection string).

1. **Download or clone this repository** and open a terminal in the project folder.
2. **Install the packages**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the main folder (you can copy `.env.example`) and add:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/inventory_system_wd3
   ```
   If you use MongoDB Atlas, paste your Atlas connection string as `MONGO_URI` instead.
4. **Start the server**
   ```bash
   npm start
   ```
5. The terminal should show `MongoDB connected` and `Server running on port 5000`.
6. Open `http://localhost:5000/` in a browser or Postman. You should see `{ "message": "Inventory API is running" }`.

---

## 🌐 API Endpoints

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | ➕ Create a product |
| GET | `/api/products` | 📋 Get all products (filter, sort, pagination) |
| GET | `/api/products/:id` | 🔎 Get one product by ID |
| PUT | `/api/products/:id` | ✏️ Update a product's details |
| DELETE | `/api/products/:id` | 🗑️ Delete a product |
| PATCH | `/api/products/:id/stock` | 🔄 Add or remove stock |
| GET | `/api/products/low-stock` | ⚠️ Low-stock alert report |
| GET | `/api/products/summary` | 📊 Category-wise inventory summary |

### 🧾 Product fields
| Field | Type | Rules |
|---|---|---|
| `name` | String | Required, minimum 2 characters |
| `sku` | String | Required, unique, saved in capital letters |
| `category` | String | Required |
| `price` | Number | Required, cannot be negative |
| `quantity` | Number | Default 0, cannot be negative |
| `reorderLevel` | Number | Default 10, cannot be negative |
| `supplier` | String | Optional |
| `stockValue` | Number | Calculated automatically (price × quantity), not stored in the database |

### 🔍 Query parameters for `GET /api/products`
| Parameter | Example | What it does |
|---|---|---|
| `category` | `?category=Electronics` | Shows only that category (write it as stored) |
| `minPrice`, `maxPrice` | `?minPrice=500&maxPrice=2000` | Price range |
| `search` | `?search=pen` | Part of the product name (ignores capital or small letters) |
| `sort` | `?sort=price` or `?sort=-price` | Low to high, or high to low (default: newest first) |
| `page`, `limit` | `?page=2&limit=5` | Pagination (default page 1, 10 per page) |

You can combine them, for example:
`/api/products?category=Electronics&sort=-price&limit=2&page=1`

### 🔄 Stock adjustment
Send a number in `change`:
- `{ "change": 10 }` adds 10 to the stock (restock)
- `{ "change": -3 }` removes 3 from the stock (sale)

A sale larger than the available stock is rejected, so quantity never goes below zero.

---

## 🧪 How to Test with Postman

1. Make sure the server is running (`npm start`) and MongoDB is connected.
2. For **POST, PUT and PATCH** requests, open the **Body** tab, choose **raw**, then choose **JSON**, and paste the body. GET and DELETE need no body.
3. Create the sample products below first, then copy an `_id` from a response and use it in the `:id` URLs.

<details>
<summary>📥 <b>Sample products to create (click to open)</b></summary>

Send each line below as a separate `POST /api/products` request (12 products in 5 categories):

```json
{ "name": "Wireless Mouse", "sku": "ELEC-MS-101", "category": "Electronics", "price": 799, "quantity": 30, "reorderLevel": 10, "supplier": "Logitech India" }
{ "name": "Bluetooth Speaker", "sku": "ELEC-SP-102", "category": "Electronics", "price": 2499, "quantity": 8, "reorderLevel": 10, "supplier": "JBL India" }
{ "name": "Laptop", "sku": "ELEC-LP-103", "category": "Electronics", "price": 55000, "quantity": 5, "reorderLevel": 3, "supplier": "HP India" }
{ "name": "USB Keyboard", "sku": "ELEC-KB-104", "category": "Electronics", "price": 1299, "quantity": 40, "reorderLevel": 10, "supplier": "Logitech India" }
{ "name": "Cotton T-Shirt", "sku": "APRL-TS-201", "category": "Apparel", "price": 499, "quantity": 60, "reorderLevel": 20, "supplier": "Fab Textiles" }
{ "name": "Denim Jeans", "sku": "APRL-JN-202", "category": "Apparel", "price": 1799, "quantity": 18, "reorderLevel": 20, "supplier": "Fab Textiles" }
{ "name": "Study Table", "sku": "FURN-TB-812", "category": "Furniture", "price": 3999, "quantity": 2, "reorderLevel": 4, "supplier": "IKEA India" }
{ "name": "Office Chair", "sku": "FURN-CH-813", "category": "Furniture", "price": 6499, "quantity": 12, "reorderLevel": 5, "supplier": "IKEA India" }
{ "name": "Gel Pen Pack of 15", "sku": "STNY-PN-713", "category": "Stationery", "price": 140, "quantity": 60, "reorderLevel": 20, "supplier": "Cello Pens" }
{ "name": "A4 Notebook", "sku": "STNY-NB-714", "category": "Stationery", "price": 60, "quantity": 15, "reorderLevel": 20, "supplier": "Classmate" }
{ "name": "Basmati Rice 5kg", "sku": "GROC-RC-301", "category": "Groceries", "price": 650, "quantity": 50, "reorderLevel": 15, "supplier": "India Gate" }
{ "name": "Olive Oil 1L", "sku": "GROC-OL-302", "category": "Groceries", "price": 899, "quantity": 25, "reorderLevel": 10, "supplier": "Figaro" }
```

Four of these products (Bluetooth Speaker, Denim Jeans, Study Table and A4 Notebook) start at or below their reorder level, so they appear in the low-stock report.
</details>

### ✅ Test checklist

Run the tests in this order. Use `<id>` for an `_id` copied from a response (for tests 16 to 19, use the Study Table's `_id`).

| # | Test | Request | Expected result |
|---|---|---|---|
| 1 | Create a product | `POST /api/products` with any sample product | `201 Created`, with `stockValue` and `id` in the response |
| 2 | Duplicate SKU | Send the same POST body again | `409` "A product with this SKU already exists" |
| 3 | Validation rule | `POST` with `"price": -5` and a new SKU such as `"TEST-001"` | `400` "Validation failed: price: Price cannot be negative" |
| 4 | Get one product | `GET /api/products/<id>` | `200 OK` with the product |
| 5 | Invalid ID | `GET /api/products/123` | `400` "Invalid value for _id" |
| 6 | Product not found | `GET /api/products/64f1a2b3c4d5e6f7a8b9c0d1` | `404` "Product not found" |
| 7 | Update a product | `PUT /api/products/<id>` with `{ "price": 150 }` | `200 OK` with the new price |
| 8 | Update validation | `PUT /api/products/<id>` with `{ "price": -1 }` | `400` "Price cannot be negative" |
| 9 | Get all products | `GET /api/products` | `total: 12`, `page: 1`, `totalPages: 2`, `count: 10` |
| 10 | Filter by category | `GET /api/products?category=Electronics` | `total: 4`, only Electronics |
| 11 | Price range | `GET /api/products?minPrice=500&maxPrice=2000` | `total: 5` |
| 12 | Search | `GET /api/products?search=pen` | `total: 1`, the Gel Pen |
| 13 | Sorting | `GET /api/products?sort=-price` | Laptop (55000) first |
| 14 | Pagination | `GET /api/products?limit=5&page=2` | `page: 2`, `totalPages: 3`, `count: 5` |
| 15 | Combined | `GET /api/products?category=Electronics&sort=-price&limit=2` | `total: 4`, `totalPages: 2`, Laptop first |
| 16 | Restock | `PATCH /api/products/<id>/stock` with `{ "change": 10 }` | `200` "Stock updated", Study Table quantity 12 |
| 17 | Sale | `PATCH /api/products/<id>/stock` with `{ "change": -5 }` | `200` "Stock updated", quantity 7 |
| 18 | Sale too large | `PATCH` with `{ "change": -100 }` | `400` "Not enough stock. Available: 7" |
| 19 | Invalid stock input | `PATCH` with `{ "change": 0 }` | `400` "change must be a whole number other than 0" |
| 20 | Low-stock report | `GET /api/products/low-stock` | `count: 3` (the Study Table is no longer low after the restock) |
| 21 | Category summary | `GET /api/products/summary` | `categories: 5`, Electronics first with `totalStockValue: 370922` |
| 22 | Delete a product | `DELETE /api/products/<id>` | `200` "Product deleted" |
| 23 | Delete again | `DELETE` the same ID | `404` "Product not found" |
| 24 | Unknown route | `GET /api/wrong` | `404` "Route not found" |

---

## 📬 Example Responses

**Get all products** (`GET /api/products`)
```json
{
  "total": 12,
  "page": 1,
  "totalPages": 2,
  "count": 10,
  "products": [ ... ]
}
```

**Stock update** (`PATCH /api/products/:id/stock` with `{ "change": 10 }` on the Study Table)
```json
{
  "message": "Stock updated",
  "product": {
    "name": "Study Table",
    "sku": "FURN-TB-812",
    "category": "Furniture",
    "price": 3999,
    "quantity": 12,
    "reorderLevel": 4,
    "supplier": "IKEA India",
    "stockValue": 47988
  }
}
```

**Low-stock report** (`GET /api/products/low-stock`)
```json
{
  "count": 3,
  "lowStockItems": [ ... ]
}
```

**Category summary** (`GET /api/products/summary`)
```json
{
  "categories": 5,
  "summary": [
    {
      "_id": "Electronics",
      "totalItems": 4,
      "totalQuantity": 83,
      "totalStockValue": 370922,
      "avgPrice": 14899.25
    }
  ]
}
```

**Delete** (`DELETE /api/products/:id`)
```json
{ "message": "Product deleted", "id": "6af924378077e4be32cf4975" }
```

---

## 🛡️ Validation and Error Handling

All errors are handled in one place (`middleware/errorHandler.js`) and return JSON in this form: `{ "message": "..." }`.

| Status | When it happens |
|---|---|
| `200` | Request succeeded |
| `201` | Product created |
| `400` | Schema rule broken, invalid ID format, or invalid stock input |
| `404` | Product not found, or the URL does not exist |
| `409` | Duplicate SKU |
| `500` | Unexpected server error |

**Validation happens in two places:**
- 🧱 **Schema validation** (Mongoose): required fields, minimum values and unique SKU. It also applies on updates (`runValidators: true`).
- 🛡️ **Validation middleware** (`validateStock.js`): checks that `change` is a whole number other than 0 before the stock controller runs.

---

## ✅ Assignment Requirements Covered

| Requirement | Where it is |
|---|---|
| Product schema and validation | `models/Product.js` |
| Create Product API | `POST /api/products` |
| Get all products: filtering, sorting, pagination | `GET /api/products` |
| Get single product by ID | `GET /api/products/:id` |
| Update product details and stock adjustment | `PUT /api/products/:id`, `PATCH /api/products/:id/stock` |
| Delete product | `DELETE /api/products/:id` |
| Low-stock alert report (aggregation) | `GET /api/products/low-stock` |
| Category-wise inventory summary (aggregation) | `GET /api/products/summary` |
| Centralized error handling and input validation middleware | `middleware/errorHandler.js`, `middleware/validateStock.js` |
| Environment variables with dotenv | `.env`, `.env.example` |

---

Made with ❤️ using Node.js, Express and MongoDB.