import jwt
import datetime
from models.user_model import User  # Adjust import based on your Python module structure
import os

read_only_user_token = None
JWT_SECRET = os.getenv("JWT_SECRET")  # Ensure JWT_SECRET is set in environment

async def create_read_only_user():
    try:
        # Check if a read-only user already exists
        existing_user = await User.objects.filter(role="ReadOnly").first()
        if not existing_user:
            # Create a new read-only user
            new_user = User(
                name="ReadOnlyUserName",
                email="readonly@Ownsit.xyz",
                password="ReadOnly@1234",  # It's recommended to hash passwords
                role="ReadOnly"
            )
            await new_user.save()
    except Exception as error:
        print("Error creating read-only user:", error)

async def generate_read_only_user_token():
    global read_only_user_token
    try:
        user = await User.objects.filter(role="ReadOnly").first()
        if not user:
            print("No read-only user found!")
            return None

        token = jwt.encode(
            {"userId": str(user.id), "userRole": user.role, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=10)},
            JWT_SECRET,
            algorithm="HS256"
        )
        read_only_user_token = token
        return token
    except Exception as error:
        print("Error generating read-only user token:", error)
        return None

def get_read_only_user_token():
    return read_only_user_token

async def regenerate_token_if_needed():
    global read_only_user_token
    try:
        decoded_token = jwt.decode(read_only_user_token, JWT_SECRET, algorithms=["HS256"])
        if datetime.datetime.fromtimestamp(decoded_token['exp']) <= datetime.datetime.now():
            # Token has expired, regenerate it
            await generate_read_only_user_token()
    except jwt.ExpiredSignatureError:
        # Token expired, regenerate
        await generate_read_only_user_token()
    except jwt.InvalidTokenError:
        # Invalid token, regenerate
        await generate_read_only_user_token()
    except Exception as error:
        print("Error during token regeneration:", error)
        await generate_read_only_user_token()

