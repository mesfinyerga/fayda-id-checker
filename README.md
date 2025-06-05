# Fayda ID Checker System

A professional, mock-based ID verification platform for Ethiopian Fayda National IDs, developed using FastAPI (backend) and React + Material UI (frontend).

---

## ✅ Features

- 🔒 Role-based Authentication (JWT)
- 🌐 Multi-language support: English & Amharic
- 📄 PDF export for verification results
- 📊 Admin dashboard with visual statistics
- 🔁 Modular backend and frontend architecture

---

## ⚙️ Tech Stack

| Layer       | Technology               |
|-------------|---------------------------|
| Frontend    | React, Material UI        |
| Backend     | FastAPI, Pydantic         |
| Database    | PostgreSQL (local)        |
| Auth        | JWT Tokens                |
| Extras      | Docker (optional), GitHub Actions (optional) |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/mesfinyerga/fayda-id-checker.git
cd fayda-id-checker

# Backend Setup
cd fayda_backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m app.db.init_db  # create the SQLite database tables
uvicorn main:app --reload #uvicorn app.main:app --reload

# Frontend Setup
cd ../frontend
npm install
npm run dev
