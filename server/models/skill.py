from config import get_db
from bson import ObjectId

db = get_db()

class Skill:
    def __init__(self, user_info_id, name, id=None):
        self.user_info_id = user_info_id
        self.name = name
        self.id = id

    def save(self):
        if hasattr(self, 'id') and self.id:
            db.skills.update_one(
                {"_id": ObjectId(self.id)},
                {"$set": self.to_dict()}
            )
        else:
            result = db.skills.insert_one(self.to_dict())
            self.id = result.inserted_id

    def to_dict(self):
        return {
            "user_info_id": self.user_info_id,
            "name": self.name
        }

    @staticmethod
    def get_all(user_info_id):
        try:
            print("Using user_info_id as string:", user_info_id)  # Debug line
            skills = list(db.skills.find({"user_info_id": user_info_id}))  # No conversion to ObjectId
            print("Fetched Skills:", skills)  # Debug line
            return [
                {
                    **skill,
                    "_id": str(skill["_id"]),
                    "user_info_id": str(skill["user_info_id"])
                }
                for skill in skills
            ]
        except Exception as e:
            print("Error fetching skills:", e)
            return []

    @staticmethod
    def delete_all(user_info_id):
        try:
            db.skills.delete_many({"user_info_id": user_info_id})
        except Exception as e:
            print(f"Error deleting skills for user {user_info_id}: {e}")