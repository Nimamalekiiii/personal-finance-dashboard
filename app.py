from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

DATABASE = "expenses.db"




def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    c = conn.cursor()

    c.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()




@app.route("/")
def home():
    return render_template("index.html")



@app.route("/add", methods=["POST"])
def add_entry():
    try:
        data = request.get_json()

        name = data.get("name", "").strip()
        amount = data.get("amount")
        category = data.get("category", "").strip()
        date = data.get("date")
        entry_type = data.get("type")

        if not name or not category or not date or not entry_type:
            return jsonify({"error": "Missing required fields"}), 400

        try:
            amount = float(amount)
        except ValueError:
            return jsonify({"error": "Invalid amount"}), 400

        if entry_type not in ["income", "expense"]:
            return jsonify({"error": "Invalid type"}), 400

        
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": "Invalid date format"}), 400

        conn = get_db_connection()
        conn.execute(
            "INSERT INTO expenses (name, amount, category, date, type) VALUES (?, ?, ?, ?, ?)",
            (name, amount, category, date, entry_type)
        )
        conn.commit()
        conn.close()

        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/expenses")
def get_expenses():
    conn = get_db_connection()

    rows = conn.execute(
        "SELECT id, name, amount, category, date, type FROM expenses ORDER BY date DESC"
    ).fetchall()

    conn.close()

    return jsonify([tuple(row) for row in rows])



@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_entry(id):
    conn = get_db_connection()
    conn.execute("DELETE FROM expenses WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"status": "deleted"})




@app.route("/summary")
def get_summary():
    conn = get_db_connection()

    income = conn.execute(
        "SELECT SUM(amount) FROM expenses WHERE type='income'"
    ).fetchone()[0] or 0

    expense = conn.execute(
        "SELECT SUM(amount) FROM expenses WHERE type='expense'"
    ).fetchone()[0] or 0

    conn.close()

    return jsonify({
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense
    })



if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5050, debug=True)

