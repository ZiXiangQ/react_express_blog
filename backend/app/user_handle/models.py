"""
用户模型 - 对应 user_handle/models.py
"""
from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class User(Base):
    __tablename__ = "user_handle_user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(254), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<User(username={self.username})>"
