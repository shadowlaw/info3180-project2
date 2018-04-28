from . import db
from werkzeug.security import generate_password_hash


class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(255))
    caption = db.Column(db.String(255))
    created_on = db.Column(db.String(80))

    
    def __init__(self,user_id,photo,caption,created_on):
        #self.id = id
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    email = db.Column(db.String(255))
    location = db.Column(db.String(80))
    biography = db.Column(db.String(255))
    profile_photo = db.Column(db.String(255))
    joined_on = db.Column(db.String(80))
    
    def __init__(self, username, password, first_name, last_name, email, location, biography, profile_photo, joined_on):
        self.username = username
        self.password = generate_password_hash(password)
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.location = location
        self.biography = biography
        self.profile_photo = profile_photo
        self.joined_on = joined_on
    

class Likes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer)
    
    def __init__(self,post_id,user_id):
        self.user_id = user_id
        self.post_id = post_id
        
    
    
class Follows(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    follower_id = db.Column(db.Integer)
    
    def __init__(self,user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id
    
    