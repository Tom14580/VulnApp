import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

schema_path = os.path.join(BASE_DIR, "schema.sql")
db_path = os.path.join(BASE_DIR, "database.db")

with open(schema_path, "r") as f:
    schema = f.read()

conn = sqlite3.connect(db_path)
conn.executescript(schema)
conn.execute( # insert an admin user for testing purposes
    "INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)",
    ("admin", "adminpass", 1)
)
conn.commit()
conn.close()

print("Database initialized at:", db_path)