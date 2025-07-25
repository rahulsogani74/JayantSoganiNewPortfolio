from pymongo import MongoClient

class Config:
    MONGO_URI = "mongodb+srv://rahulsogani:8440031383@cluster0.ye8bzqh.mongodb.net/jayantDB"
    
def get_db():
    client = MongoClient(Config.MONGO_URI)
    return client.get_database()
