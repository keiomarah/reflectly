from flask import Flask
from .extensions import db, jwt, cors
from dotenv import load_dotenv
import os
from .routes.auth import auth
from .routes.journal import journal

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(journal, url_prefix="/journal")

    create_database(app)
    return app

def create_database(app):
    with app.app_context():
        db.create_all()