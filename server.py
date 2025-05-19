from flask import Flask, request, jsonify
import sqlite3
import bcrypt  # Import bcrypt for password hashing
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Ensure SQLite stores passwords as BLOB (binary format)
def create_users_table():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password BLOB NOT NULL
        )
    """)
    conn.commit()
    conn.close()

create_users_table()  # Ensure table exists at startup

# Register a new user (Hash password before storing)
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"message": "Invalid input data"}), 400

        username = data['username']
        password = data['password']

        # Hash the password before storing (bcrypt requires bytes)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()

        try:
            # Ensure that hashed_password is in bytes and inserted as BLOB (binary format)
            cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
                           (username, sqlite3.Binary(hashed_password)))  # Using sqlite3.Binary to store it correctly
            conn.commit()
            return jsonify({"message": "Registration successful!"}), 200
        except sqlite3.IntegrityError:
            return jsonify({"message": "User already exists!"}), 400
        finally:
            conn.close()
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}"}), 500

# Login a user (Verify hashed password)
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"message": "Invalid input data"}), 400

        username = data['username']
        password = data['password']

        conn = sqlite3.connect("database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
        stored_user = cursor.fetchone()
        conn.close()

        if stored_user:
            # Ensure the stored password is in bytes format
            stored_hashed_password = stored_user[0]

            # Verify the entered password with the stored hashed password
            if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password):
                return jsonify({"message": "Login successful!"}), 200
            else:
                return jsonify({"message": "Invalid username or password!"}), 401
        else:
            return jsonify({"message": "Invalid username or password!"}), 401
    except Exception as e:
        return jsonify({"message": "Invalid username or password!"}), 401

# Root Route
@app.route("/")
def home():
    return "Welcome to BinaryBytes Backend!"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
