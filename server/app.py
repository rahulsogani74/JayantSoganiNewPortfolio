from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from bson.objectid import ObjectId
from datetime import datetime

# Import configurations and routes
from config import get_db
from routes.user_info_routes import user_info_routes
from routes.ads_routes import ads_bp

# Initialize Flask app and SocketIO
app = Flask(__name__)
CORS(app)

# Database setup
db = get_db()
conversations_collection = db["conversations"]
messages_collection = db["messages"]

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Track active connections
active_connections = {
    'visitors': {},  # Map visitor IDs to socket IDs
    'owner': None    # Store the owner's socket ID
}

# Register blueprints
app.register_blueprint(user_info_routes)
app.register_blueprint(ads_bp)

### API Routes

@app.route('/get_conversations', methods=['GET'])
def get_conversations():
    try:
        conversations = list(conversations_collection.find().sort('created_at', -1))
        if not conversations:
            return jsonify({"message": "No conversations found"}), 404

        for conv in conversations:
            conv['_id'] = str(conv['_id'])
            conv['messages'] = list(
                messages_collection.find({'conversation_id': str(conv['_id'])})
                .sort('timestamp', -1)  # Sorting by timestamp (latest first)
                .limit(10)  # Fetch the latest 10 messages
            )
            for msg in conv['messages']:
                msg['_id'] = str(msg['_id'])
        return jsonify(conversations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/create_conversation', methods=['POST'])
def create_conversation():
    """Create a new conversation or fetch an existing one."""
    try:
        data = request.json
        name = data.get("name", "Visitor Chat")  # Default name
        profile_pic = data.get("profilePic", "")  # Default empty profile picture

        # Check if a conversation with the same name already exists
        existing_conversation = conversations_collection.find_one({"name": name})
        if existing_conversation:
            existing_conversation['_id'] = str(existing_conversation['_id'])
            return jsonify(existing_conversation), 200

        # Create a new conversation
        conversation = {
            "name": name,
            "profilePic": profile_pic,
            "created_at": datetime.now(),
        }
        result = conversations_collection.insert_one(conversation)
        conversation['_id'] = str(result.inserted_id)  # Convert ObjectId to string

        print(f"Conversation created: {conversation}")
        return jsonify(conversation), 201
    except Exception as e:
        print(f"Error creating conversation: {e}")
        return jsonify({"error": "Failed to create conversation", "details": str(e)}), 500


### SocketIO Handlers

@socketio.on('connect')
def handle_connect():
    """Handle new socket connection."""
    print(f"New connection established with SID: {request.sid}")


@socketio.on('join')
def handle_join(data):
    """Handle user joining."""
    user_type = data.get('user_type')
    user_id = data.get('user_id')

    if user_type == 'visitor':
        active_connections['visitors'][user_id] = request.sid
        print(f"Visitor {user_id} connected with SID: {request.sid}")
    elif user_type == 'owner':
        active_connections['owner'] = request.sid
        print(f"Portfolio Owner connected with SID: {request.sid}")


@socketio.on('send_message')
def handle_send_message(data):
    try:
        conversation_id = data.get('conversation_id')
        if not ObjectId.is_valid(conversation_id):
            print(f"Invalid conversation_id: {conversation_id}")
            emit('error', {'error': 'Invalid conversation ID'})
            return

        message_data = {
            "conversation_id": conversation_id,
            "message": data.get('message'),
            "sender": data.get('sender'),
            "timestamp": data.get('timestamp', datetime.now().isoformat()),  # Default to current timestamp
            "date": data.get('date', datetime.now().isoformat()),
        }

        result = messages_collection.insert_one(message_data)
        message_data['_id'] = str(result.inserted_id)

        print(f"Message saved: {message_data}")

        socketio.emit('receive_message', message_data, to=None)

    except Exception as e:
        print(f"Error handling message: {e}")
        emit('error', {'error': 'Failed to process message'})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle disconnection."""
    for user_id, sid in list(active_connections['visitors'].items()):
        if sid == request.sid:
            del active_connections['visitors'][user_id]
            print(f"Visitor {user_id} disconnected")
            break

    if active_connections['owner'] == request.sid:
        active_connections['owner'] = None
        print("Portfolio owner disconnected")


@app.route('/get_older_messages', methods=['GET'])
def get_older_messages():
    """Get older messages from a specific conversation."""
    try:
        conversation_id = request.args.get('conversation_id')
        skip = int(request.args.get('skip', 0))  # How many messages to skip
        limit = int(request.args.get('limit', 10))  # Limit the number of messages

        if not ObjectId.is_valid(conversation_id):
            return jsonify({"error": "Invalid conversation ID"}), 400

        # Retrieve older messages with pagination
        messages = list(
            messages_collection.find({'conversation_id': conversation_id})
            .sort('timestamp', -1)  # Sort messages by timestamp (latest first)
            .skip(skip)  # Skip the number of messages already loaded
            .limit(limit)  # Limit the number of messages to fetch
        )

        # Convert ObjectId to string for all messages
        for msg in messages:
            msg['_id'] = str(msg['_id'])

        return jsonify(messages), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


### Run the Application

if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
