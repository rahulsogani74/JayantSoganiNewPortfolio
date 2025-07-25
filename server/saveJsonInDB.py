import json
from models.userInfo import UserInfo
from models.education import Education
from models.experience import Experience
from models.project import Project
from models.skill import Skill
from models.social import SocialLink
from models.contact import Contact
# Load your JSON data
with open('PortfolioUserData.json', 'r') as file:
    data = json.load(file)
       
# Saving the data
user_info = UserInfo(data["name"], data["photo"], data["description"])
user_info.save()
 
# Save Contact data
for contact_data in data['contacts']:
    contact = Contact(contact_data['type'], contact_data['value'])
    contact.save()

# Save Education data
for education_data in data['education']:
    education = Education(education_data['degree'], education_data['institution'], education_data['year'])
    education.save()

# Save Experience data
for experience_data in data['experience']:
    experience = Experience(experience_data['position'], experience_data['company'], experience_data['year'])
    experience.save()

# Save Project data
for project_data in data['projects']:
    project = Project(
        project_data['name'], 
        project_data['description'], 
        project_data['image'], 
        project_data['technologies'], 
        project_data['link']
    )
    project.save()

# Save Skills data
for skill_name in data['skills']:
    skill = Skill(skill_name)
    skill.save()

for social in data["socialLinks"]:
    social_link = SocialLink(social["platform"], social["url"])
    social_link.save()

print("All data saved successfully!")
