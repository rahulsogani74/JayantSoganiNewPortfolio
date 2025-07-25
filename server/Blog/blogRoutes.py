from flask import Flask, request, jsonify
from flask_mongoengine import MongoEngine
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

# Initialize Flask app and extensions
app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'db': 'your_database_name',
    'host': 'localhost',
    'port': 27017
}
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
db = MongoEngine(app)
jwt = JWTManager(app)

# Define schemas
class BlogPost(db.Document):
    title = db.StringField(required=True)
    author = db.StringField(required=True)
    date = db.DateTimeField(required=True)
    topic = db.StringField(required=True)
    user_id = db.ReferenceField('User')

class Content(db.Document):
    blog_id = db.ReferenceField(BlogPost)
    content = db.StringField(required=True)
    user_id = db.ReferenceField('User')

class Like(db.Document):
    user_id = db.ReferenceField('User')
    blog_id = db.ReferenceField(BlogPost)

class Comment(db.Document):
    user_id = db.ReferenceField('User')
    blog_id = db.ReferenceField(BlogPost)
    text = db.StringField(required=True)

class User(db.Document):
    # Define User fields here
    pass

class UserProfile(db.Document):
    user_id = db.ReferenceField(User)
    photo = db.BinaryField()

# Middleware to authenticate JWT
@app.route('/createBlog', methods=['POST'])
@jwt_required()
def create_blog():
    blog_data = request.json
    user_id = get_jwt_identity()

    blog_post = BlogPost(
        title=blog_data['title'],
        author=blog_data['author'],
        date=blog_data['date'],
        topic=blog_data['topic'],
        user_id=user_id
    )

    try:
        saved_blog_post = blog_post.save()
        content = Content(
            blog_id=saved_blog_post,
            content=blog_data['content'],
            user_id=user_id
        )
        content.save()
        return jsonify(message="Blog post added successfully"), 201
    except Exception as e:
        return jsonify(error="An error occurred while adding the blog post", actualError=str(e)), 500

@app.route('/getBlogs', methods=['GET'])
def get_blogs():
    try:
        blog_posts = BlogPost.objects()
        sanitized_blog_posts = []
        for post in blog_posts:
            user_profile = UserProfile.objects(user_id=post.user_id).first()
            photo = None
            if user_profile and user_profile.photo:
                photo = f"data:image/png;base64,{user_profile.photo.decode()}"
            sanitized_blog_posts.append({
                "_id": str(post.id),
                "title": post.title,
                "author": post.author,
                "date": post.date,
                "topic": post.topic,
                "user_id": str(post.user_id),
                "photo": photo
            })
        return jsonify(sanitized_blog_posts)
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/getBlogDetails/<blog_id>', methods=['GET'])
@jwt_required()
def get_blog_details(blog_id):
    user_id = get_jwt_identity()
    try:
        blog = BlogPost.objects.get(id=blog_id)
        is_authorized = blog.user_id == user_id
        return jsonify(blog=blog.to_json(), authorized=is_authorized)
    except BlogPost.DoesNotExist:
        return jsonify(error="Blog not found"), 404
    except Exception as e:
        return jsonify(error="Internal server error"), 500

@app.route('/getBlogContent/<blog_id>', methods=['GET'])
@jwt_required()
def get_blog_content(blog_id):
    try:
        content = Content.objects(blog_id=blog_id).first()
        if content:
            return jsonify(content=content.content, content_id=str(content.id))
        else:
            return jsonify(error="Content not found for the specified blog ID"), 404
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/getUserBlogs/<user_id>', methods=['GET'])
@jwt_required()
def get_user_blogs(user_id):
    try:
        user_blogs = BlogPost.objects(user_id=user_id)
        sanitized_user_blogs = [{
            "title": post.title,
            "author": post.author,
            "date": post.date,
            "topic": post.topic
        } for post in user_blogs]
        return jsonify(sanitized_user_blogs)
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/editBlog/<blog_id>', methods=['PUT'])
@jwt_required()
def edit_blog(blog_id):
    data = request.json
    title = data.get('title')
    topic = data.get('topic')
    content = data.get('content')

    try:
        updated_blog = BlogPost.objects(id=blog_id).update(set__title=title, set__topic=topic)
        updated_content = Content.objects(blog_id=blog_id).update(set__content=content)

        return jsonify(message="Blog and content updated successfully")
    except Exception as e:
        return jsonify(error="An error occurred while editing the blog post", actualError=str(e)), 500

@app.route('/deleteBlog/<blog_id>', methods=['DELETE'])
@jwt_required()
def delete_blog(blog_id):
    try:
        deleted_blog = BlogPost.objects.get(id=blog_id)
        deleted_blog.delete()
        return jsonify(message="Blog deleted successfully")
    except BlogPost.DoesNotExist:
        return jsonify(message="Blog not found"), 404
    except Exception as e:
        return jsonify(error="An error occurred while deleting the blog post", actualError=str(e)), 500

@app.route('/likeBlog/<blog_id>', methods=['POST'])
@jwt_required()
def like_blog(blog_id):
    user_id = get_jwt_identity()

    try:
        existing_like = Like.objects(user_id=user_id, blog_id=blog_id).first()
        if existing_like:
            return jsonify(error="User has already liked this blog"), 400

        new_like = Like(user_id=user_id, blog_id=blog_id)
        new_like.save()

        BlogPost.objects(id=blog_id).update(add_to_set__likes=new_like.id)
        return jsonify(message="Blog liked successfully")
    except Exception as e:
        return jsonify(error="An error occurred while liking the blog post", actualError=str(e)), 500

@app.route('/getLikes/<blog_id>', methods=['GET'])
@jwt_required()
def get_likes(blog_id):
    user_id = get_jwt_identity()

    try:
        likes = Like.objects(blog_id=blog_id)
        already_liked = any(like.user_id == user_id for like in likes)
        return jsonify(likes=likes, alreadyLiked=already_liked)
    except Exception as e:
        return jsonify(error="An error occurred while fetching likes", actualError=str(e)), 500

@app.route('/unlikeBlog/<blog_id>', methods=['POST'])
@jwt_required()
def unlike_blog(blog_id):
    user_id = get_jwt_identity()

    try:
        removed_like = Like.objects(user_id=user_id, blog_id=blog_id).first()
        if removed_like:
            removed_like.delete()
            BlogPost.objects(id=blog_id).update(pull__likes=removed_like.id)
            return jsonify(message="Blog unliked successfully")
        else:
            return jsonify(error="User has not liked this blog"), 400
    except Exception as e:
        return jsonify(error="An error occurred while unliking the blog post", actualError=str(e)), 500

@app.route('/likeOrUnlikeBlog/<blog_id>', methods=['POST'])
@jwt_required()
def like_or_unlike_blog(blog_id):
    user_id = get_jwt_identity()

    try:
        existing_like = Like.objects(user_id=user_id, blog_id=blog_id).first()
        if existing_like:
            existing_like.delete()
            BlogPost.objects(id=blog_id).update(pull__likes=existing_like.id)
            return jsonify(message="Blog unliked successfully")
        else:
            new_like = Like(user_id=user_id, blog_id=blog_id)
            new_like.save()
            BlogPost.objects(id=blog_id).update(add_to_set__likes=new_like.id)
            return jsonify(message="Blog liked successfully")
    except Exception as e:
        return jsonify(error="An error occurred while liking/unliking the blog", actualError=str(e)), 500

@app.route('/commentBlog/<blog_id>', methods=['POST'])
@jwt_required()
def comment_blog(blog_id):
    user_id = get_jwt_identity()
    text = request.json.get('text')

    try:
        new_comment = Comment(user_id=user_id, blog_id=blog_id, text=text)
        new_comment.save()

        BlogPost.objects(id=blog_id).update(add_to_set__comments=new_comment.id)
        return jsonify(message="Comment added successfully")
    except Exception as e:
        return jsonify(error="An error occurred while commenting on the blog post", actualError=str(e)), 500

@app.route('/getComments/<blog_id>', methods=['GET'])
@jwt_required()
def get_comments(blog_id):
    try:
        comments = Comment.objects(blog_id=blog_id)
        user_ids = [comment.user_id for comment in comments]

        users = User.objects(id__in=user_ids)
        user_name_map = {str(user.id): user.name for user in users}

        comments_with_usernames = [{
            "_id": str(comment.id),
            "user_id": str(comment.user_id),
            "text": comment.text,
            "username": user_name_map.get(str(comment.user_id), "Unknown")
        } for comment in comments]

        return jsonify(comments=comments_with_usernames)
    except Exception as e:
        return jsonify(error="An error occurred while fetching comments", actualError=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
