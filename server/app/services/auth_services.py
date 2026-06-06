from app.models.user import User
from app.extensions import db, jwt
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash
import re
from flask import jsonify
from flask_jwt_extended import create_access_token

def get_user_by_email_or_username(email, username):
    return User.query.filter(or_(User.email == email, User.username == username)).first()

def password_match(password1, password2):
    return password1 == password2

def create_hash(password):
    return generate_password_hash(password)

def check_strong_password(password):
    score = 0
    if (len(password) >= 8):
        score += 1
    if re.search(r"\d", password):
        score += 1
    if re.search(r"[^a-zA-Z0-9_\\s]", password):
        score += 1
    if re.search(r"[A-Z]", password):
        score += 1
    if re.search(r"[a-z]", password):
        score += 1
    
    if score == 5:
        return "strong"
    elif score == 4 or score == 3:
        return "medium"
    elif score >= 2:
        return "weak"

def register_user(name, surname, email, username, password):
    new_user = User(name=name, surname=surname, email=email, username=username, password=create_hash(password))
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=new_user)
    return jsonify({
        "message":"New user created",
        "category":"success",
        "access_token": access_token
    }), 201

def user_login(username, password):
    user = User.query.filter_by(username=username).first()

    if user:
        if check_password_hash(user.password, password):
            access_token = create_access_token(identity=user)
            return jsonify({
                "message":"User logged in successfully",
                "category":"success",
                "access_token": access_token
            }), 200
        else: 
            return jsonify({
                "message":"Invalid username or password",
                "category":"failure"
            }), 401
    else:
        return jsonify({
            "message":"Invalid username or password",
            "category":"failure"
        }), 401
    
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()