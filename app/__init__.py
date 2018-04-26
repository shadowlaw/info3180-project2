from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
csrf = CSRFProtect(app)

bcrypt = Bcrypt(app)
app.config['SECRET_KEY'] = "this is a super secure key"  # you should make this more random and unique
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://app_api:password@localhost/photogram"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True  # added just to suppress a warning

UPLOAD_FOLDER ='./app/static/uploads'

db = SQLAlchemy(app)

app.config.from_object(__name__)
from app import views
