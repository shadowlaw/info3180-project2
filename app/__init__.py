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
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://ajlnzyeyfdyqmr:d49e01c9e341b929299dddbf28de69c5129cb68c8a4a598be5f4a3faf347e77b@ec2-174-129-41-64.compute-1.amazonaws.com:5432/d9nnhbajbimvol'"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # added just to suppress a warning

UPLOAD_FOLDER ='./app/static/uploads'
PROFILE_IMG_UPLOAD_FOLDER = os.path.join("static/uploads", "profile_photos")
POST_IMG_UPLOAD_FOLDER = os.path.join("static/uploads", "posts")

db = SQLAlchemy(app)

app.config.from_object(__name__)
from app import views
