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
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://lmpxecwaaxsise:47da5b91c1f6c6373bc721a12d89333179589602dd2dd99af4b0826bfcee2aaa@ec2-23-23-142-5.compute-1.amazonaws.com:5432/d6p863j1eo19b8"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # added just to suppress a warning

UPLOAD_FOLDER ='./app/static/uploads'
PROFILE_IMG_UPLOAD_FOLDER = os.path.join("static/uploads", "profile_photos")
POST_IMG_UPLOAD_FOLDER = os.path.join("static/uploads", "posts")

db = SQLAlchemy(app)

app.config.from_object(__name__)
from app import views
