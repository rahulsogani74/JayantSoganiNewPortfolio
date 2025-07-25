from pymongo import MongoClient
import os

client = MongoClient(os.getenv('MONGO_OWNS_IT_DB_URL'))
OwnsItDB = client.get_database()

client_vidhan = MongoClient(os.getenv('MONGO_VIDHAN_DB_URL'))
VidhanDB = client_vidhan.get_database()

client_rahul = MongoClient(os.getenv('MONGO_RAHUL_DB_URL'))
RahulDB = client_rahul.get_database()
