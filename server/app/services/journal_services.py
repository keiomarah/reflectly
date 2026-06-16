from app.models.journal_entry import JournalEntry
from app.extensions import db
from flask import jsonify
from flask_jwt_extended import current_user
def create_new_entry(mood, sub_mood, prompt, created_at, user_id, updated_at, text):
    new_entry = JournalEntry(mood=mood, sub_mood=sub_mood, user_id=user_id, prompt=prompt, created_at=created_at, updated_at=updated_at, text=text)
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({
        "message":"Entry added successfully"
    }), 200


def get_entries():
    return jsonify([
        {   
            "id": entry.id,
            "mood": entry.mood,
            "submood": entry.sub_mood,
            "prompt": entry.prompt,
            "text": entry.text,
            "created-at": entry.created_at
        }
        for entry in current_user.entries
    ]), 200

def get_entry(id): 
    entry = db.session.get(JournalEntry, id)

    if entry:
        return jsonify({
            "id": entry.id,
            "mood": entry.mood,
            "sub_mood": entry.sub_mood,
            "prompt": entry.prompt,
            "text": entry.text

        }), 200
    else:
        return jsonify({
            "message": "Entry not found"
        }), 404

def put_entry(id, mood, sub_mood, prompt, updated_at, text):
    entry = db.session.get(JournalEntry, id)
    if entry:
        entry.mood = mood
        entry.sub_mood = sub_mood
        entry.prompt = prompt
        entry.updated_at = updated_at
        entry.text = text

        db.session.commit()
        return jsonify({
            "message": "Entry successfully updated"
        }), 200

def delete_entry(id):
    entry = db.session.get(JournalEntry, id)
    if entry:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({
            "message": "Entry successfully deleted"
        }), 200