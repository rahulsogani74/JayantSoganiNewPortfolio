from flask_pymongo import PyMongo
from bson import ObjectId

mongo = PyMongo()

import datetime
import os

# Connect to MongoDB databases
def connect_to_databases():
    # Replace the below URLs with your actual MongoDB connection strings
    owns_it_db_url = os.getenv('MONGO_OWNS_IT_DB_URL')
    vidhan_db_url = os.getenv('MONGO_VIDHAN_DB_URL')
    rahul_db_url = os.getenv('MONGO_RAHUL_DB_URL')
    
    connect('owns_it', host=owns_it_db_url)
    connect('vidhan', host=vidhan_db_url)
    connect('rahul', host=rahul_db_url)

# Call the function to connect to the databases
connect_to_databases()

class BlogPost(Document):
    meta = {'collection': 'blogpost'}
    title = StringField(required=True)
    author = StringField(required=True)
    date = DateTimeField(default=datetime.datetime.utcnow)
    topic = StringField(required=True)
    user_id = ObjectIdField(required=True)

class Content(Document):
    meta = {'collection': 'content'}
    blog_id = ReferenceField(BlogPost, required=True)
    content = StringField(required=True)
    user_id = ObjectIdField(required=True)

class Like(Document):
    meta = {'collection': 'like'}
    user_id = ObjectIdField(required=True)
    blog_id = ReferenceField(BlogPost, required=True)
    blog_title = StringField()

class Comment(Document):
    meta = {'collection': 'comment'}
    user_id = ObjectIdField(required=True)
    blog_id = ReferenceField(BlogPost, required=True)
    text = StringField()
    date = DateTimeField(default=datetime.datetime.utcnow)

# Example usage
if __name__ == "__main__":
    # Example: Creating a blog post
    new_post = BlogPost(title="My First Blog", author="John Doe", topic="Introduction", user_id="some_user_id")
    new_post.save()

    # Example: Creating content for the blog post
    content = Content(blog_id=new_post, content="This is the content of the blog.", user_id="some_user_id")
    content.save()

    # Example: Creating a like for the blog post
    like = Like(user_id="some_user_id", blog_id=new_post, blog_title=new_post.title)
    like.save()

    # Example: Creating a comment on the blog post
    comment = Comment(user_id="some_user_id", blog_id=new_post, text="Great post!")
    comment.save()
