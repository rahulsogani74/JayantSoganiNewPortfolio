from config import get_db

db = get_db()

class UserInfo:
    def __init__(self, name, photo, title, description):
        self.name = name
        self.photo = photo
        self.title = title
        self.description = description

    def save(self):
        users_collection = db.userInfo
        result = users_collection.insert_one({
            "name": self.name,
            "photo": self.photo,
            "title": self.title,
            "description": self.description
        })
        self.id = result.inserted_id
        
    @classmethod
    def get_all(cls):
        users_collection = db.userInfo
        return list(users_collection.find())
    
    @classmethod
    def update_one(cls, filter, update):
        # This method will be used to update a single document
        users_collection = db.userInfo
        result = users_collection.update_one(filter, update)
        return result
