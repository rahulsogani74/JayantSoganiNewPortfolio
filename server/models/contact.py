from config import get_db
from bson import ObjectId

db = get_db()

class Contact:
    def __init__(self, user_info_id, type, value, id=None):
        self.user_info_id = user_info_id
        self.type = type
        self.value = value
        self.id = id

    def save(self):
        if hasattr(self, 'id') and self.id:
            db.contacts.update_one(
                {"_id": ObjectId(self.id)},
                {"$set": self.to_dict()}
            )
        else:
            result = db.contacts.insert_one(self.to_dict())
            self.id = result.inserted_id

    def to_dict(self):
        return {
            "user_info_id": self.user_info_id,
            "type": self.type,
            "value": self.value
        }

    @staticmethod
    def get_all(user_info_id):
        contacts = list(db.contacts.find({"user_info_id": user_info_id}))
        return [
            {
                **contact,
                "_id": str(contact["_id"]),
                "user_info_id": str(contact["user_info_id"])
            }
            for contact in contacts
        ]
        
    @staticmethod
    def delete_all(user_info_id):
        try:
            db.contacts.delete_many({"user_info_id": user_info_id})
        except Exception as e:
            print(f"Error deleting skills for user {user_info_id}: {e}")