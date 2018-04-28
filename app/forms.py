from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import InputRequired


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    firstname = StringField('First-name', validators=[InputRequired()])
    lastname = StringField('Last-name', validators=[InputRequired()])
    email = StringField('Email', validators=[InputRequired()])
    location = StringField('Location', validators=[InputRequired()])
    biography = TextAreaField('Biography',validators=[InputRequired()])
    photo= FileField('Profile Photo',validators=[FileRequired(),FileAllowed(['jpg', 'png'], 'Images only!')])
    
class PostForm(FlaskForm):
    user_id = StringField("", validators=[InputRequired()])
    photo = FileField('Profile Picture', validators=[FileRequired(), FileAllowed(['jpg','png'],'Image only!')])
    caption = TextAreaField('Caption', validators=[InputRequired()])    
    
    