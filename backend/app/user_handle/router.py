"""
用户路由 - 对应 user_handle/views.py + user_handle/urls.py
"""
import hashlib
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.common.api_response import success_response, error_response
from app.user_handle.models import User
from app.user_handle.schemas import UserCreate, UserUpdate, LoginRequest, ModifyPasswordRequest, UserOut

router = APIRouter(prefix="/user_handle", tags=["用户管理"])


def md5_hash(password: str) -> str:
    return hashlib.md5(password.encode('utf-8')).hexdigest()


def generate_token() -> str:
    return hashlib.sha256(os.urandom(32)).hexdigest()


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """登录"""
    user = db.query(User).filter(User.username == request.username).first()
    if not user:
        return error_response("用户不存在")
    if user.password == md5_hash(request.password):
        token = generate_token()
        from fastapi.responses import JSONResponse
        response = JSONResponse(content={"code": 0, "message": "登录成功"})
        response.headers["sid"] = token
        return response
    else:
        return error_response("用户名或密码错误")


@router.post("/create")
def create_user(request: UserCreate, db: Session = Depends(get_db)):
    """创建用户"""
    # 检查用户名是否已存在
    existing = db.query(User).filter(
        (User.username == request.username) | (User.email == request.email)
    ).first()
    if existing:
        return error_response("用户名或邮箱已存在")

    user = User(
        username=request.username,
        email=request.email,
        password=md5_hash(request.password),
        is_active=request.is_active
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return success_response("用户创建成功", UserOut.model_validate(user).model_dump())


@router.post("/get_all_user")
def get_all_users(db: Session = Depends(get_db)):
    """获取所有用户信息"""
    users = db.query(User).all()
    users_data = [UserOut.model_validate(u).model_dump() for u in users]
    return success_response("获取用户信息成功", users_data)


@router.post("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """获取单个用户信息"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return error_response("用户未找到")
    return success_response("获取用户信息成功", UserOut.model_validate(user).model_dump())


@router.post("/{user_id}/update")
def update_user(user_id: int, request: UserUpdate, db: Session = Depends(get_db)):
    """更新用户信息"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return error_response("用户未找到")

    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return success_response("更新成功", UserOut.model_validate(user).model_dump())


@router.post("/{user_id}/delete")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """删除用户"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return error_response("用户未找到")
    db.delete(user)
    db.commit()
    return success_response("删除成功")


@router.post("/{user_id}/modify_password")
def modify_password(user_id: int, request: ModifyPasswordRequest, db: Session = Depends(get_db)):
    """修改密码"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return error_response("用户未找到")
    user.password = md5_hash(request.password)
    db.commit()
    return success_response("密码修改成功")
