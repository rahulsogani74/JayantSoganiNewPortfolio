from config import get_db
from bson import ObjectId

db = get_db()

class Experience:
    def __init__(self, user_info_id, year, description, position, company, title=None, id=None):
        self.user_info_id = user_info_id
        self.year = year
        self.position = position
        self.company = company
        self.description = description
        self.title = title
        self.id = id

    def save(self):
        try:
            if hasattr(self, 'id') and self.id:
                db.experiences.update_one(
                    {"_id": ObjectId(self.id)},
                    {"$set": self.to_dict()}
                )
            else:
                result = db.experiences.insert_one(self.to_dict())
                self.id = result.inserted_id
        except Exception as e:
            print(f"Error saving experience: {str(e)}")

    def to_dict(self):
        return {
            "user_info_id": self.user_info_id,
            "year": self.year,
            "position": self.position,
            "company": self.company,
            "description": self.description,
            "title": self.title
        }

    @staticmethod
    def get_all(user_info_id):
        try:
            experiences_collection = db.experiences
            experiences = list(experiences_collection.find({"user_info_id": user_info_id}))
            return [
                {
                    **exp,
                    "_id": str(exp["_id"]),
                    "user_info_id": str(exp["user_info_id"])
                }
                for exp in experiences
            ]
        except Exception as e:
            print(f"Error fetching experiences: {str(e)}")
            return []

    @staticmethod
    def delete_all(user_info_id):
        try:
            experiences_collection = db.experiences
            experiences_collection.delete_many({"user_info_id": user_info_id})
        except Exception as e:
            print(f"Error deleting experiences: {str(e)}")

