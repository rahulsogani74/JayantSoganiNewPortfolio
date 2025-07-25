from flask import Blueprint, request, jsonify
from models.ads import Ad
from bson import ObjectId
import base64

ads_bp = Blueprint('ads', __name__)

@ads_bp.route('/api/ads', methods=['GET'])
def get_ads():
    try:
        # Fetch all ads from the database
        ads = Ad.get_all_ads()
        
        # Sort ads by 'order', with the largest order number appearing first
        ads_sorted = sorted(ads, key=lambda x: x.get("order", 0), reverse=True)
        
        # Return ads with their base64 image strings decoded if needed
        return jsonify([{
            **ad,
            "_id": str(ad["_id"]),
            "image": ad["image"]  # Ensure base64 string is included
        } for ad in ads_sorted]), 200
    except Exception as e:
        print(f"Error fetching ads: {e}")
        return jsonify({"error": "Could not fetch ads"}), 500

@ads_bp.route('/api/ads', methods=['POST'])
def add_ad():
    try:
        data = request.json
        # Find the highest existing order value
        existing_ads = Ad.get_all_ads()
        max_order = max([ad.get("order", 0) for ad in existing_ads], default=0)
        
        ad = Ad(
            base64.b64decode(data["image"].split(",")[1]),  # Remove Base64 prefix if present and decode
            description=data["description"],
            link=data["link"],
            seen=data.get("seen", False),
            order=max_order + 1
        )
        ad_id = Ad.insert_ad(ad.to_dict())
        return jsonify({"_id": str(ad_id)}), 201
    except Exception as e:
        print(f"Error adding ad: {e}")
        return jsonify({"error": str(e)}), 500

@ads_bp.route('/api/ads/<ad_id>', methods=['PUT'])
def update_ad(ad_id):
    try:
        data = request.json

        if not ObjectId.is_valid(ad_id):
            return jsonify({"error": "Invalid ad ID"}), 400

        # If image is provided in the update request
        if "image" in data and data["image"]:
            # Decode base64 image if a new one is provided
            decoded_image = base64.b64decode(data["image"].split(",")[1])  # Remove Base64 prefix if present
            # Re-encode image to base64
            data["image"] = base64.b64encode(decoded_image).decode("utf-8")

        Ad.update_ad(ad_id, data)
        return jsonify({"message": "Ad updated successfully"}), 200

    except Exception as e:
        print(f"Error updating ad: {e}")
        return jsonify({"error": str(e)}), 500


@ads_bp.route('/api/ads/<ad_id>', methods=['DELETE'])
def delete_ad(ad_id):
    try:
        if not ObjectId.is_valid(ad_id):
            return jsonify({"error": "Invalid ad ID"}), 400
            
        Ad.delete_ad(ad_id)
        return jsonify({"message": "Ad deleted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ads_bp.route('/api/ads/reorder', methods=['PUT'])
def reorder_ads():
    try:
        data = request.json
        ads_to_update = data.get('ads')  # Expect an array of ads with ids and new orders
        
        if not ads_to_update:
            return jsonify({"error": "Missing required parameters"}), 400

        # Validate and update the ads in the database
        for ad in ads_to_update:
            current_id = ad.get('id')
            new_order = ad.get('newOrder')

            if not current_id or new_order is None:
                return jsonify({"error": "Missing required parameters for ad"}), 400

            if not ObjectId.is_valid(current_id):
                return jsonify({"error": "Invalid ad ID"}), 400

            # Call the swap_order method for each ad
            Ad.swap_order(current_id, new_order)
        
        # Return the updated list of ads
        ads = Ad.get_all_ads()
        ads_sorted = sorted(ads, key=lambda x: x.get("order", 0), reverse=True)
        
        return jsonify([{
            **ad,
            "_id": str(ad["_id"]),
            "image": ad["image"]
        } for ad in ads_sorted]), 200
        
    except Exception as e:
        print(f"Error reordering ads: {e}")
        return jsonify({"error": str(e)}), 500



@ads_bp.route('/api/ads/<ad_id>/toggle-seen', methods=['PUT'])
def toggle_seen(ad_id):
    try:
        if not ObjectId.is_valid(ad_id):
            return jsonify({"error": "Invalid ad ID"}), 400
            
        ad = Ad.get_ad(ad_id)
        if not ad:
            return jsonify({"error": "Ad not found"}), 404
            
        new_seen_status = not ad['seen']
        Ad.update_ad(ad_id, {'seen': new_seen_status})
        return jsonify({"message": "Seen status updated", "seen": new_seen_status}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@ads_bp.route('/api/ads/seen', methods=['GET'])
def get_seen_ads():
    try:
        # Get all ads
        ads = Ad.get_all_ads()

        # Filter ads by seen status
        seen_ads = [ad for ad in ads if ad.get("seen")]

        # Sort seen ads by 'order', largest number first (most recent)
        seen_ads_sorted = sorted(seen_ads, key=lambda x: x.get("order", 0), reverse=True)

        # Filter ads by unseen status
        unseen_ads = [ad for ad in ads if not ad.get("seen")]

        # Sort unseen ads by 'order', largest number first
        unseen_ads_sorted = sorted(unseen_ads, key=lambda x: x.get("order", 0), reverse=True)

        # Combine seen and unseen ads
        all_sorted_ads = seen_ads_sorted + unseen_ads_sorted

        return jsonify([{
            **ad,
            "_id": str(ad["_id"]),
            "image": ad["image"]  # Include base64 image if needed
        } for ad in all_sorted_ads]), 200

    except Exception as e:
        print(f"Error fetching seen ads: {e}")
        return jsonify({"error": "Could not fetch seen ads"}), 500
