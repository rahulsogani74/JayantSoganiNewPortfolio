from config import get_db
from bson import ObjectId
import base64

# Getting the MongoDB collection
db = get_db()  # Ensure this returns the actual collection, not just the database

ads_collection = db["ads"]

class Ad:
    def __init__(self, image, description, link, seen=False, order=None):
        self.image = base64.b64encode(image).decode("utf-8")  # Encode image to Base64
        self.description = description
        self.link = link
        self.seen = seen
        self.order = order

    def to_dict(self):
        return {
            "image": self.image,
            "description": self.description,
            "link": self.link,
            "seen": self.seen,
            "order": self.order
        }
        

    @classmethod
    def get_all_ads(cls):
        return list(db.ads.find().sort("order", 1))


    @staticmethod
    def insert_ad(ad_data):
        try:
            # Insert ad data into the collection
            return db.ads.insert_one(ad_data).inserted_id
        except Exception as e:
            print(f"Database Insert Error: {e}")
            raise

    @staticmethod
    def update_ad(ad_id, ad_data):
        # Remove _id field if it exists in the data
        ad_data.pop("_id", None)
        db.ads.update_one({"_id": ObjectId(ad_id)}, {"$set": ad_data})

    @staticmethod
    def delete_ad(ad_id):
        db.ads.delete_one({"_id": ObjectId(ad_id)})

    @staticmethod
    def get_ad(ad_id):
        return db.ads.find_one({"_id": ObjectId(ad_id)})

    @staticmethod
    def get_all_ads():
        # Assuming you're using MongoDB or similar to store the ads
        return db.ads.find()  # db.ads is your collection of ads

    @staticmethod
    def update_order(ad_id, new_order):
        """
        Update the 'order' of an ad and adjust other ads' orders accordingly.
        """
        try:
            if not ad_id or new_order is None:
                raise ValueError("ad_id and new_order are required")

            # Find the current ad and its order
            current_ad = ads_collection.find_one({"_id": ObjectId(ad_id)})
            if not current_ad:
                raise ValueError(f"Ad with id {ad_id} not found")

            current_order = current_ad.get("order")
            if current_order == new_order:
                return  # No changes needed

            # Shift other ads' orders
            if current_order < new_order:
                # Decrease order of ads between current_order and new_order
                ads_collection.update_many(
                    {"order": {"$gt": current_order, "$lte": new_order}},
                    {"$inc": {"order": -1}}
                )
            else:
                # Increase order of ads between new_order and current_order
                ads_collection.update_many(
                    {"order": {"$gte": new_order, "$lt": current_order}},
                    {"$inc": {"order": 1}}
                )

            # Update the order of the current ad
            ads_collection.update_one(
                {"_id": ObjectId(ad_id)},
                {"$set": {"order": new_order}}
            )
        except Exception as e:
            print(f"Error updating ad order: {e}")
            raise


    @staticmethod
    def save(ad_data):
        """
        Save a new ad to the database.
        """
        try:
            ad_data.pop("_id", None)  # Ensure '_id' is not in the save data
            ads_collection.insert_one(ad_data)
        except Exception as e:
            print(f"Error saving ad: {e}")
            raise
        
    @staticmethod
    def swap_order(current_id, target_order):
        """
        Swap the order between two ads
        """
        try:
            # Get the current ad
            current_ad = db.ads.find_one({"_id": ObjectId(current_id)})
            if not current_ad:
                raise ValueError(f"Ad with id {current_id} not found")

            current_order = current_ad.get("order")
            
            # Find the ad with the target order
            target_ad = db.ads.find_one({"order": target_order})
            if not target_ad:
                # If no ad exists with target_order, simply update current ad
                db.ads.update_one(
                    {"_id": ObjectId(current_id)},
                    {"$set": {"order": target_order}}
                )
                return True

            # Swap orders between the two ads
            db.ads.update_one(
                {"_id": ObjectId(current_id)},
                {"$set": {"order": target_order}}
            )
            db.ads.update_one(
                {"_id": target_ad["_id"]},
                {"$set": {"order": current_order}}
            )
            return True
            
        except Exception as e:
            print(f"Error swapping ad order: {e}")
            raise