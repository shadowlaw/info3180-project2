"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app, db
from flask import render_template, request, redirect, url_for, flash, jsonify
from werkzeug.security import check_password_hash
from forms import *
from models import *
import os, datetime
import jwt
from functools import wraps


###
# Routing for your application.
###


@app.route('/')
def home():
    """Render website's home page."""
    return render_template('index.html')
    
    
def jwt_token(t):
    @wraps(t)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return jsonify({'error': 'Access Denied : No Token Found'}), 401
        else:
            try:
                userdata = jwt.decode(auth, app.config['SECRET_KEY'])
                currentUser = Users.query.filter_by(username = userdata['user']).first()
            except jwt.exceptions.InvalidSignatureError:
                return jsonify({'error':'Invalid Token'})
            except jwt.exceptions.DecodeError:
                return jsonify({'error': 'Invalid Token'})
            return t(currentUser,*args, **kwargs)
    return decorated
            
        
@app.route('/api/users/register')
def register():
    form = RegistrationForm()
    if request.method=='POST' and form.validate_on_submit():
        count = db.session.query(Users).count()
        uid = 10000 + count
        uname = form.username.data
        location=form.location.data
        bio=form.biography.data
        lname=form.lastname.data
        fname=form.firstname.data
        mail=form.email.data
        gender=form.gender.data
        photograph = form.photo.data
        date = datetime.date.today()
        filename = str(uid)+".jpg"
        photograph.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        user = Users(id= uid,first_name=fname, last_name = lname,gender=gender,location=location,bio= bio,email=mail,created_on=date)
        db.session.add(user)
        db.session.commit()
        flash('Profile created!', 'success')
        return redirect(url_for('profiles'))
    else:
        return render_template('profile.html', form = form)

@app.route('/api/auth/login',methods=["POST"])
def login():
     form = LoginForm()
     if request.method == "POST" and form.validate_on_submit():
         username = form.username.data
         password = form.password.data
         usersCheck = Users.query.filter_by(username=username).all()
         
         if len(usersCheck) == 0:
             return jsonify({'error': 'Invalid username or password'})
         elif not check_password_hash(usersCheck[0].password,password):
             return jsonify({'error': 'Invalid username or password'})
         else:
             user = usersCheck[0]
             jwt_token = jwt.encode({'user': user.username},app.config['SECRET_KEY'],algorithm = "HS256")
             response = {'message': 'User successfully logged in','token':jwt_token}
             return jsonify(response)             
     return flash_errors(form.errors(form))

@app.route('/api/auth/logout', methods = ['GET'])
@jwt_token
def logout(currentUser):
    if request.method == 'GET':
        return jsonify({'message': 'User successfully logged out'})
    return flash_errors(['Only GET requests are accepted'])
        
@app.route('/api/posts', methods = ['GET'])
def viewPosts():
    if request.method == 'GET':
        allPosts = Posts.query.all()
        return jsonify({'POSTS':allPosts})
    return flash_errors(['Only GET requests are accepted'])

@app.route('/api/users/{user_id}/posts', methods = ['POST'])
@app.route('/api/users/{user_id}/posts', methods = ['GET'])
@app.route('/api/users/{user_id}/follow', methods = ['POST'])


# Like Route
@app.route('/api/posts/<post_id>/like',methods = ['POST'])
@jwt_token
def like(currentUser,post_id):
    post = Posts.query.filter_by(post_id).first()
    
    if not post:
        return jsonify_errors(['post does not exist'])
        
    if request.method == 'POST':
        like = Likes(post_id = request.values.get('post_id'),user_id = request.values.get('user_id'))
        db.session.add(like)
        db.session.commit()
        
        total_likes = len(Like.query.filter_by(postid = post_id).all())
        return jsonify({'message': 'post liked','likes':total_likes})
    return flash_errors(['Only POST requests are accepted'])
    
    

# Flash errors from the form if validation fails
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error
            ), 'danger')


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
