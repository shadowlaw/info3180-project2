from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect
import os

app = Flask(__name__)
csrf = CSRFProtect(app)

bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = "this is a super secure key"  # you should make this more random and unique
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://slxnadjmdxxpkv:feb22affae396e76175b20ae4dab4df49fc11f704f9975d8639ce06bfba10dc3@ec2-54-243-54-6.compute-1.amazonaws.com:5432/d2r5hgmnmcmvv8"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # added just to suppress a warning

UPLOAD_FOLDER ='./app/static/uploads'
PROFILE_IMG_UPLOAD_FOLDER = os.path.join("static/uploads", "profile_photos")
POST_IMG_UPLOAD_FOLDER = os.path.join("static/uploads", "posts")

db = SQLAlchemy(app)

app.config.from_object(__name__)
from app import views
