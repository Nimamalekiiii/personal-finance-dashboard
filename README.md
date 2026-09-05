# Personal Finance Dashboard 💰

A web-based personal finance dashboard built with Python, Flask, SQLite and JavaScript.

## 📌 About

Personal Finance Dashboard is a web application designed to provide a clear overview of personal income and expenses.

The application allows users to register financial transactions, categorize them, view their income and expenses, and get an overview of their current balance.

The project was developed as a practical exercise in full-stack web development, combining a Flask backend with a JavaScript-based frontend and SQLite database.

##  Features

- Add income and expenses
- Categorize transactions
- Select transaction dates
- Search transactions
- Filter transactions by month
- View total income
- View total expenses
- Calculate current balance
- Delete transactions
- Visualize financial data with charts
- Light/dark theme toggle

##  Tech Stack

### Backend
- Python
- Flask
- SQLite

### Frontend
- HTML5
- CSS3
- JavaScript

### Libraries
- Chart.js
- Particles.js
- Google Fonts

## 🗄️ Database

The application uses SQLite for local data storage.

The database stores:

- Transaction name
- Amount
- Category
- Date
- Transaction type

Transactions are stored as either **income** or **expense**.

##  API Endpoints

The Flask backend provides endpoints for interacting with the application.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Loads the dashboard |
| POST | `/add` | Adds a new transaction |
| GET | `/expenses` | Retrieves stored transactions |
| DELETE | `/delete/<id>` | Deletes a transaction |
| GET | `/summary` | Returns income, expenses and balance |

##  Dashboard

The dashboard provides an overview of:

- Total income
- Total expenses
- Balance
- Transaction history
- Financial charts

##  Project Structure

```text
personal-finance-dashboard/
├── static/
│   ├── script.js
│   └── style.css
├── templates/
│   └── index.html
├── .gitignore
├── app.py
└── README.md
