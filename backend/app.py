from flask import Flask, request, jsonify, session, g
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "dev_secret_key" # deliberately weak
CORS( # enable CORS for all routes to allow the frontend to make requests to the backend
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]
)
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = False # should be dev only

DATABASE = "database.db"

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()

@app.route("/")
def home():
    return {"message": "Vulnerable Social App API"}

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    db = get_db()

    try:
        db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)", # parameterized query to prevent SQL injection
            (username, password)
        )
        db.commit()
        return {"message": "User registered"}
    except:
        return {"error": "Username already exists"}, 400


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    db = get_db()

    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'" # vulnerable to SQL injection

    user = db.execute(query).fetchone()

    if user:
        session["user_id"] = user["id"]
        session["is_admin"] = user["is_admin"]
        session["username"] = user["username"]
        return {"message": "Logged in"}
    else:
        return {"error": "Invalid credentials"}, 401
    

@app.route("/profile")
def profile():
    user_id = request.args.get("user_id") # IDOR vulnerability as any user can access any profile by changing the user_id parameter
    # to fix this, we should check if the user_id matches the logged in user's ID

    db = get_db()

    user = db.execute(
        "SELECT id, username, is_admin FROM users WHERE id = ?",
        (user_id,)
    ).fetchone()

    if user:
        return {
            "id": user["id"],
            "username": user["username"],
            "is_admin": user["is_admin"]
        }
    else:
        return {"error": "User not found"}, 404


@app.route("/admin")
def admin_panel():
    if "user_id" not in session: # only checks if the user is logged in, but does not check if they are an admin
        return {"error": "Not logged in"}, 401

    db = get_db()

    users = db.execute("SELECT id, username, is_admin FROM users").fetchall()

    return {
        "message": "Welcome to the admin panel",
        "users": [dict(user) for user in users]
    }


@app.route("/create_post", methods=["POST"])
def create_post():
    if "user_id" not in session:
        return {"error": "Not logged in"}, 401

    data = request.get_json()
    content = data.get("content")

    db = get_db()

    db.execute(
        "INSERT INTO posts (user_id, content) VALUES (?, ?)",
        (session["user_id"], content)
    )
    db.commit()

    return {"message": "Post created"}


@app.route("/posts")
def get_posts():
    db = get_db()

    posts = db.execute(
        """
        SELECT posts.id, posts.content, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        """
    ).fetchall()

    return {
        "posts": [dict(post) for post in posts]
    }


@app.route("/me")
def me():
    if "user_id" not in session:
        return {"error": "Not logged in"}, 401
    return {
        "id": session.get("user_id"),
        "username": session.get("username")
    }

if __name__ == "__main__":
    app.run(debug=True) # debug true (misconfiguration)