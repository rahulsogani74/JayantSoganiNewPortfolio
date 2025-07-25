from config import get_db
from bson import ObjectId

db = get_db()

class SocialLink:
    def __init__(self, user_info_id, platform, url, id=None):
        self.user_info_id = user_info_id
        self.platform = platform
        self.url = url
        self.id = id

    def save(self):
        # Update or insert a new social link for the user and platform
        result = db.social_links.update_one(
            {"user_info_id": self.user_info_id, "platform": self.platform},  # Matching by user and platform
            {
                "$set": {
                    "url": self.url
                }
            },
            upsert=True  # If no match is found, a new document will be created
        )
        # If upsert creates a new record, the id will be returned in result
        if result.upserted_id:
            self.id = result.upserted_id
        else:
            # If updated, set the id to the current document's id
            existing_link = db.social_links.find_one({"user_info_id": self.user_info_id, "platform": self.platform})
            self.id = existing_link["_id"]

    def to_dict(self):
        return {
            "user_info_id": self.user_info_id,
            "platform": self.platform,
            "url": self.url
        }

    @staticmethod
    def get_all(user_info_id):
        links = list(db.social_links.find({"user_info_id": user_info_id}))
        return [
            {
                **link,
                "_id": str(link["_id"]),
                "user_info_id": str(link["user_info_id"])
            }
            for link in links
        ]
        
    @staticmethod
    def delete_all(user_info_id):
        # Delete all social links associated with the user
        db.social_links.delete_many({"user_info_id": user_info_id})