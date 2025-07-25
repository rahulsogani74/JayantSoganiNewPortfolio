import os
import jwt
import json
import time
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo

from flask_cors import CORS
from flask_mongoengine import MongoEngine
from dotenv import load_dotenv
from apscheduler.schedulers.background import BackgroundScheduler
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt

from routes import blogs_router

# Load environment variables
load_dotenv()

app = Flask(__name__)

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

# Database configuration
app.config["MONGO_URI"] = {
    "db": os.getenv("DB_NAME"),
    "host": os.getenv("DB_URI")
}
mongo = PyMongo(app)

# Load JWT secret
JWT_SECRET = os.getenv("JWT_SECRET", "Jayant@sogani@1@3$5^7*98&6%4#2!1")

# Model definitions (User model example)
class User(db.Document):
    name = db.StringField(required=True)
    email = db.StringField(required=True, unique=True)
    password = db.StringField(required=True)

# Routes and business logic
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name, email, password, confirm_password = data["name"], data["email"], data["password"], data["confirmPassword"]

    if password != confirm_password:
        return jsonify(message="Passwords do not match."), 400

    if User.objects(email=email):
        return jsonify(message="Email already exists."), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, password=hashed_password)
    new_user.save()
    return jsonify(message="Registration successful"), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email, password = data["email"], data["password"]

    user = User.objects(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify(message="Invalid Email and Password"), 400

    token = jwt.encode({"userId": str(user.id)}, JWT_SECRET, algorithm="HS256")
    login_response = {
        "userId": str(user.id),
        "name": user.name,
        "message": "Login successful",
        "token": token
    }
    return jsonify(login_response), 200

# In-memory sessions for logout (for demo)
active_sessions = {}

@app.route("/logout", methods=["POST"])
def logout():
    token = request.headers.get("token")
    if not token:
        return jsonify(error="Token not provided"), 400

    if token in active_sessions:
        del active_sessions[token]
        return jsonify(message="Successfully logged out"), 200
    else:
        return jsonify(error="Invalid session"), 401

# Example search route
@app.route("/search", methods=["GET"])
def search():
    term = request.args.get("term")
    view = request.args.get("view")

    results = []
    if view == "blogs":
        # Implement search in BlogPost model (not defined here)
        pass
    elif view == "people":
        results = User.objects(name__icontains=term)

    return jsonify(results=[user.to_json() for user in results])

# Run scheduled tasks
scheduler = BackgroundScheduler()

def analyze_user_activity():
    # Implement analyze user activity functionality
    print("Analyzing user activity...")

scheduler.add_job(analyze_user_activity, 'interval', minutes=30)
scheduler.start()

# Middleware for JWT token verification
@app.before_request
def verify_token():
    token = request.headers.get("x-access-token")
    if token:
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user_id = data.get("userId")
        except jwt.ExpiredSignatureError:
            return jsonify(error="TOKEN_EXPIRED", message="JWT token has expired"), 401
        except jwt.InvalidTokenError:
            return jsonify(error="INTERNAL_SERVER_ERROR", message="Invalid token"), 500

app.register_blueprint(blogs_router)

# Start the app
if __name__ == "__main__":
    app.run(port=os.getenv("PORT", 5001))
    app.run(debug=True)

