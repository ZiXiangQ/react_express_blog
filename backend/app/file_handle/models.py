"""
文件处理模型 - 对应 file_handle/models.py
"""
from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_name = Column(String(255), nullable=False)
    project_key = Column(String(255), nullable=False)
    visible_users = Column(Text, nullable=False)

    def __repr__(self):
        return f"<Project(project_name={self.project_name})>"


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    system_config_path = Column(String(1024), nullable=False)

    def __repr__(self):
        return f"<SystemSetting(system_config_path={self.system_config_path})>"
