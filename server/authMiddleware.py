import jwt
import datetime
from functools import wraps
from flask import request, jsonify, g
from models.user_model import User  # Adjust import based on your Python module structure
from DefaultUsers.read_only_user_controller import regenerate_token_if_needed, get_read_only_user_token

JWT_SECRET = "your_jwt_secret"  # Replace with actual environment variable

def authenticate_token(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        access_token = request.headers.get("token")
        if not access_token:
            return jsonify({
                "error": "TOKEN_MISSING",
                "message": "JWT token is missing in the request headers",
                "logout": True
            }), 401

        try:
            decoded_token = jwt.decode(access_token, JWT_SECRET, algorithms=["HS256"])
            user_id = decoded_token.get("userId")
            exp = decoded_token.get("exp")

            if exp < datetime.datetime.now().timestamp():
                return jsonify({
                    "error": "TOKEN_EXPIRED",
                    "message": "JWT token has expired, please login to obtain a new one",
                    "logout": True
                }), 401

            logged_in_user = await User.objects.get(id=user_id)  # Adjust to your ORM
            if not logged_in_user:
                return jsonify({
                    "error": "USER_NOT_FOUND",
                    "message": "User Not Found"
                }), 500

            g.logged_in_user = logged_in_user
            return await func(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({
                "error": "TOKEN_EXPIRED",
                "message": "JWT token has expired",
                "logout": True
            }), 401
        except jwt.InvalidTokenError as error:
            return jsonify({
                "error": "INTERNAL_SERVER_ERROR",
                "message": str(error),
                "logout": True
            }), 403
        except Exception as error:
            return jsonify({
                "error": "INTERNAL_SERVER_ERROR",
                "message": str(error),
                "logout": True
            }), 500

    return wrapper

def authenticate_user(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        access_token = request.headers.get("token")
        user_id = None
        if access_token:
            try:
                decoded_token = jwt.decode(access_token, JWT_SECRET, algorithms=["HS256"])
                exp = decoded_token.get("exp")

                if exp >= datetime.datetime.now().timestamp():
                    user_id = decoded_token.get("userId")
            except jwt.InvalidTokenError as error:
                print("Error in token verification:", error)

        g.logged_in_user_id = user_id
        return await func(*args, **kwargs)

    return wrapper

def verify_token_and_role(required_role):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            token = (
                request.headers.get("authorization").split(" ")[1]
                if "authorization" in request.headers else None
            ) or request.json.get("token") or request.args.get("token")

            if not token:
                try:
                    await regenerate_token_if_needed()
                    token = get_read_only_user_token()
                    if not token:
                        return jsonify({
                            "error": "Access Denied",
                            "message": "Token is missing",
                            "token": None
                        }), 401
                except Exception as error:
                    print("Error regenerating token:", error)
                    return jsonify({"error": "Internal Server Error"}), 500

            try:
                decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
                g.user = decoded
                if decoded.get("userRole") != required_role:
                    return jsonify({"error": "Unauthorized"}), 403
                return await func(*args, **kwargs)
            except jwt.InvalidTokenError:
                return jsonify({"error": "Invalid Token"}), 403

        return wrapper
    return decorator
