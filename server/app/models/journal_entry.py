from app.extensions import db
from sqlalchemy import func

class JournalEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    mood = db.Column(db.String(150))
    sub_mood = db.Column(db.String(150))
    prompt = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime)