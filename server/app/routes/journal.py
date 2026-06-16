from flask import Blueprint
from flask import request
from flask import jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, UTC
from flask_jwt_extended import current_user
from app.services.journal_services import create_new_entry, get_entries, get_entry, put_entry, delete_entry
from app.extensions import db
from app.services.auth_services import user_lookup_callback

journal = Blueprint("journal", __name__)

@journal.route("/entry", methods=["POST"])
@jwt_required()
def create_entry():
    data = request.json

    if data:
        mood = data.get("mood")
        user_id = current_user.id
        sub_mood = data.get("sub-mood") 
        prompt = data.get("prompt")
        created_at = datetime.now(UTC)
        updated_at = datetime.now(UTC)
        text = data.get("text")

        return create_new_entry(mood, sub_mood, prompt, created_at, user_id, updated_at, text)

@journal.route("/entries", methods=["GET"])
@jwt_required()
def entries():
    return get_entries()


@journal.route("/entry/<int:id>", methods=["GET"])
@jwt_required()
def entry(id):
    return get_entry(id)

@journal.route("/entry/<int:id>", methods=["PUT"])
@jwt_required()
def update_entry(id):
    data = request.json

    if data:
        mood = data.get("mood")
        sub_mood = data.get("sub-mood")
        prompt = data.get("prompt")
        updated_at = datetime.now(UTC)
        text = data.get("text")

        return put_entry(id, mood, sub_mood, prompt, updated_at, text)

@journal.route("/entry/<int:id>", methods=["DELETE"])
@jwt_required()
def remove_entry(id):
    return delete_entry(id)