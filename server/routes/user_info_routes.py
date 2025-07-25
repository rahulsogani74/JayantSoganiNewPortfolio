from flask import Blueprint, request, jsonify
from bson import ObjectId

from models.userInfo import UserInfo
from models.education import Education
from models.experience import Experience
from models.project import Project
from models.skill import Skill
from models.social import SocialLink
from models.contact import Contact

user_info_routes = Blueprint('user_info_routes', __name__)

# Basic User Info Routes
@user_info_routes.route('/api/basic-info', methods=['GET'])
def get_basic_info():
    try:
        info_users = UserInfo.get_all()
        if not info_users:
            return jsonify({"error": "No user info found"}), 404
            
        user_info = info_users[0]
        return jsonify({
            "_id": str(user_info["_id"]),
            "name": user_info.get("name", ""),
            "photo": user_info.get("photo", ""),
            "title": user_info.get("title", ""),
            "description": user_info.get("description", "")
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_info_routes.route('/api/basic-info', methods=['POST'])
def save_basic_info():
    try:
        data = request.get_json()
        print("Received data:", data)
        # Retrieve all user info records, expecting only one or none.
        users_collection = UserInfo.get_all()
        
        if users_collection:
            # Assuming only one document should exist, access the first element
            existing_user_info = users_collection[0]
            print("Existing user info:", existing_user_info)  # Debugging line
            
            # Update the existing record
            UserInfo.update_one(
                {"_id": existing_user_info["_id"]},
                {"$set": {
                    "name": data.get("name", ""),
                    "photo": data.get("photo", ""),
                    "title": data.get("title", ""),
                    "description": data.get("description", "")
                }}
            )
            return jsonify({"message": "Basic info updated successfully", "id": str(existing_user_info["_id"])}), 200
        else:
            # Create a new record if none exists
            user_info = UserInfo(
                name=data.get("name", ""),
                photo=data.get("photo", ""),
                title=data.get("title", ""),
                description=data.get("description", "")
            )
            user_info.save()
            return jsonify({"message": "Basic info saved successfully", "id": str(user_info.id)}), 201

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
    
@user_info_routes.route('/api/user-info', methods=['GET'])
def get_user_info():
    try:
        info_users = UserInfo.get_all()
        if not info_users:
            return jsonify({"error": "No user info found"}), 404
            
        user_info = info_users[0]
            
        # Get all related data
        education_data = Education.get_all(str(user_info["_id"]))
        experience_data = Experience.get_all(str(user_info["_id"]))
        projects_data = Project.get_all(str(user_info["_id"]))
        skills_data = Skill.get_all(str(user_info["_id"]))
        social_links_data = SocialLink.get_all(str(user_info["_id"]))
        contacts_data = Contact.get_all(str(user_info["_id"]))

        # Combine all data in a single response
        combined_data = {
            "user_info": {
                "_id": str(user_info["_id"]),
                "name": user_info.get("name", ""),
                "photo": user_info.get("photo", ""),
                "title": user_info.get("title", ""),
                "description": user_info.get("description", "")
            },
            "education": education_data,
            "experience": experience_data,
            "projects": projects_data,
            "skills": skills_data,
            "social_links": social_links_data,
            "contacts": contacts_data
        }

        return jsonify(combined_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Combined POST API to save/update all user-related information
@user_info_routes.route('/api/user-info', methods=['POST'])
def save_user_info():
    try:
        data = request.get_json()
        user_info_data = data.get("user_info", {})
        
        # Save/update basic user info
        info_users = UserInfo.get_all()
        if info_users:
            existing_user_info = info_users[0]
            UserInfo.update_one(
                {"_id": existing_user_info["_id"]},
                {"$set": {
                    "name": user_info_data.get("name", ""),
                    "photo": user_info_data.get("photo", ""),
                    "title": user_info_data.get("title", ""),
                    "description": user_info_data.get("description", "")
                }}
            )
            user_info_id = str(existing_user_info["_id"])
        else:
            user_info = UserInfo(
                name=user_info_data.get("name", ""),
                photo=user_info_data.get("photo", ""),
                title=user_info_data.get("title", ""),
                description=user_info_data.get("description", "")
            )
            user_info.save()
            user_info_id = str(user_info.id)

        # Delete existing records and save new data for each section
        Education.delete_all(user_info_id)
        for edu in data.get("education", []):
            Education(
                user_info_id=user_info_id,
                degree=edu.get("degree", ""),
                institution=edu.get("institution", ""),
                year=edu.get("year", ""),
                description=edu.get("description", "")
            ).save()

        Experience.delete_all(user_info_id)
        for exp in data.get("experience", []):
            Experience(
                user_info_id=user_info_id,
                year=exp.get("year", ""),
                position=exp.get("position", ""),
                company=exp.get("company", ""),
                description=exp.get("description", ""),
                title=exp.get("title", None)
            ).save()

        Project.delete_all(user_info_id)
        for proj in data.get("projects", []):
            Project(
                user_info_id=user_info_id,
                name=proj.get("name", ""),
                description=proj.get("description", ""),
                technologies=proj.get("technologies", []),
                link=proj.get("link", ""),
                image=proj.get("image", "")
            ).save()

        Skill.delete_all(user_info_id)
        for skill in data.get("skills", []):
            Skill(
                user_info_id=user_info_id,
                name=skill.get("name", "")
            ).save()

        SocialLink.delete_all(user_info_id)
        for link in data.get("social_links", []):
            SocialLink(
                user_info_id=user_info_id,
                platform=link.get("platform", ""),
                url=link.get("url", "")
            ).save()

        Contact.delete_all(user_info_id)
        for contact in data.get("contacts", []):
            Contact(
                user_info_id=user_info_id,
                type=contact.get("type", ""),
                value=contact.get("value", "")
            ).save()

        return jsonify({"message": "User information saved successfully", "id": user_info_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500