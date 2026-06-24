from flask import Blueprint
from flask import request
from flask import jsonify
from app.models.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services.auth_services import get_user_by_email_or_username, password_match, check_strong_password, register_user, user_login, update_user_account, confirm_delete_user
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

@auth.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user:
        return jsonify({
            "name": user.name,
            "surname": user.surname,
            "email": user.email,
        }), 200

@auth.route("/update-user", methods=["POST"])
@jwt_required()
def update_user():
    data = request.json
    if data:
        user_id = get_jwt_identity()
        name = data.get("name")
        surname = data.get("surname")
        email = data.get("email")
        password1 = data.get("password1")
        password2 = data.get("password2")
        return update_user_account(user_id, name, surname, email, password1, password2)
    else:
        return jsonify({"message": "Error updating details. Please try again later."}), 401
   

@auth.route("/user", methods=["DELETE"])
@jwt_required()
def delete_user():
    user_id = get_jwt_identity()
    return confirm_delete_user(user_id)