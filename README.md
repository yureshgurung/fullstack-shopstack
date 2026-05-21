# ShopStack — React + FastAPI + SQLite

A full-stack product management app where:
- **Anyone** (no login) can browse all products
- **Logged-in owners** can create, edit, and delete **only their own** products

---

## Project Structure

```
project/
├── backend/
│   ├── main.py        ← FastAPI app, routes, auth
│   ├── database.py    ← SQLite connection (SQLAlchemy)
│   ├── models.py      ← DB tables: User, Product
│   ├── schemas.py     ← Pydantic request/response shapes
│   ├── crud.py        ← DB operations (create, read, update, delete)
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── context/AuthContext.jsx  ← login state, token storage
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── ProductModal.jsx    ← create/edit form
    │   ├── pages/
    │   │   ├── ProductsPage.jsx    ← public listing
    │   │   ├── DashboardPage.jsx   ← owner dashboard
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── api.js                  ← fetch helper
    │   ├── App.jsx                 ← routing
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup & Run

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

- API runs at: http://localhost:8000
- Auto-docs:   http://localhost:8000/docs   ← try all endpoints here!

> SQLite DB file (`products.db`) is created automatically on first run.

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

- App runs at: http://localhost:5173

---

## How it Works

### Database (SQLite — easiest to understand)
- **No installation needed** — it's just a file (`products.db`)
- Two tables: `users` and `products`
- `products.owner_id` links each product to its creator

### Auth Flow
1. Register → POST /register → password is **bcrypt hashed**, stored in DB
2. Login → POST /token → returns a **JWT token**
3. Token is saved in `localStorage` and sent as `Authorization: Bearer <token>` header
4. Protected routes read the token, decode it, find the user

### Permission Logic
| Action           | Who can do it         |
|------------------|-----------------------|
| View all products | Everyone (public)    |
| Create product   | Any logged-in user    |
| Edit product     | Only the owner        |
| Delete product   | Only the owner        |

---

## API Endpoints

| Method | Path                  | Auth? | Description          |
|--------|-----------------------|-------|----------------------|
| POST   | /register             | No    | Create account       |
| POST   | /token                | No    | Login → get token    |
| GET    | /me                   | Yes   | Get current user     |
| GET    | /products             | No    | List all products    |
| GET    | /products/{id}        | No    | Get one product      |
| POST   | /products             | Yes   | Create product       |
| PUT    | /products/{id}        | Yes   | Update own product   |
| DELETE | /products/{id}        | Yes   | Delete own product   |
