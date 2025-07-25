from config import get_db
from bson import ObjectId

db = get_db()

class Project:
    def __init__(self, user_info_id, name, description, technologies, link, image, id=None):
        self.user_info_id = user_info_id
        self.name = name
        self.description = description
        self.technologies = technologies
        self.link = link
        self.image = image
        self.id = id

    def save(self):
        if hasattr(self, 'id') and self.id:
            db.projects.update_one(
                {"_id": ObjectId(self.id)},
                {"$set": self.to_dict()}
            )
        else:
            result = db.projects.insert_one(self.to_dict())
            self.id = result.inserted_id

    def to_dict(self):
        return {
            "user_info_id": self.user_info_id,
            "name": self.name,
            "description": self.description,
            "technologies": self.technologies,
            "link": self.link,
            "image": self.image
        }

    @staticmethod
    def get_all(user_info_id):
        projects = list(db.projects.find({"user_info_id": user_info_id}))
        return [
            {
                **proj,
                "_id": str(proj["_id"]),
                "user_info_id": str(proj["user_info_id"])
            }
            for proj in projects
        ]
        
    @staticmethod
    def delete_all(user_info_id):
        try:
            db.projects.delete_many({"user_info_id": user_info_id})
        except Exception as e:
            print(f"Error deleting skills for user {user_info_id}: {e}")