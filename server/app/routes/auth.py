from flask import Blueprint
from flask import request
from flask import jsonify

from flask_jwt_extended import create_access_token
from app.services.auth_services import get_user_by_email_or_username, password_match, check_strong_password, register_user, user_login
auth = Blueprint("auth", __name__)

@auth.route("/signup", methods=["POST"])
def signup():
    data = request.json

    if data:
        name = data.get("name")
        surname = data.get("surname")
        email = data.get("email").lower().strip()
        username = data.get("username").lower().strip()
        password1 = data.get("password1")
        password2 = data.get("password2")

        if get_user_by_email_or_username(email, username):
            return jsonify({
                "message": "User already exists",
                "category": "failure"
            }), 409
        elif not password_match(password1, password2):
            return jsonify({
                "message": "Passwords are not a match.",
                "category": "failure"
            }), 400
        elif check_strong_password(password1) != "strong":
            return jsonify({
                "message":"Password is not strong enough",
                "category":"failure"
            }), 400
        else:
            return register_user(name, surname, email, username, password1)
    
@auth.route("/login", methods=["POST"])
def login():
    data = request.json

    if data:
        username = data.get("username")
        password = data.get("password")

        return user_login(username, password)
            

@auth.route("/logout", methods=["POST"])
def logout():
    pass