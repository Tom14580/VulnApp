# VulnApp 🔓

A deliberately vulnerable full-stack web application built with:

- **Frontend:** React (Vite)
- **Backend:** Flask (Python)
- **Database:** SQLite

This project is designed for **learning and demonstrating common web vulnerabilities** such as:

- IDOR (Insecure Direct Object Reference)
- Stored XSS
- SQL Injection (in login)
- Broken Authentication (session handling)

⚠️ This app is intentionally insecure.  
Do **NOT** deploy to production.

---

# 📸 Features

- User registration & login (SQLi vulnerable)
- Session-based authentication
- Feed with user posts
- Profile pages (IDOR vulnerable via `?userId=` in URL)
- Stored XSS in posts
- Admin endpoint (no proper access control)

# Setup Instructions

cd backend
pip install -r requirements.txt
python app.py

runs on: **http://127.0.0.1:5000**

cd frontend
npm install
npm run dev

runs on **http://127.0.0.1:5000**