from config import get_db
from bson import ObjectId

db = get_db()

class Education:
    def __init__(self, user_info_id, degree, institution, description, year, id=None):
        self.user_info_id = user_info_id
        self.degree = degree
        self.institution = institution
        self.year = year
        self.description = description
        self.id = id

    def save(self):
        education_collection = db.education
        document = {
            "user_info_id": self.user_info_id,
            "degree": self.degree,
            "institution": self.institution,
            "year": self.year,
            "description": self.description
        }
        
        if hasattr(self, 'id') and self.id:
            education_collection.update_one(
                {"_id": ObjectId(self.id)},
                {"$set": document}
            )
        else:
            result = education_collection.insert_one(document)
            self.id = result.inserted_id

    @staticmethod
    def get_all(user_info_id):
        education_collection = db.education
        education = list(education_collection.find({"user_info_id": user_info_id}))
        return [
            {
                **edu,
                "_id": str(edu["_id"]),
                "user_info_id": str(edu["user_info_id"])
            }
            for edu in education
        ]
        
    @staticmethod
    def delete_all(user_info_id):
        education_collection = db.education
        education_collection.delete_many({"user_info_id": user_info_id})