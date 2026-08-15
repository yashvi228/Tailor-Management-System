import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, stored_password: str) -> bool:
    try:
        return pwd_context.verify(password, stored_password)
    except (UnknownHashError, ValueError):
        # Backward compatibility for users created before password hashing.
        return stored_password == password


def create_access_token(data: dict) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def serialize_user(user: models.User) -> dict:
    return {"id": user.id, "email": user.email}


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    credentials_error = HTTPException(status_code=401, detail="Invalid or expired session")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_error
    except JWTError:
        raise credentials_error

    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user:
        raise credentials_error
    return user


# SIGNUP
@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    email = user.email.strip().lower()

    existing = db.query(models.User).filter(models.User.email == email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        email=email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Account created successfully", "user": serialize_user(new_user)}


# LOGIN
@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    email = user.email.strip().lower()

    db_user = db.query(models.User).filter(models.User.email == email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    password_valid = verify_password(user.password, db_user.password)

    if not password_valid:
        raise HTTPException(status_code=401, detail="Wrong password")

    if db_user.password == user.password:
        db_user.password = hash_password(user.password)
        db.commit()

    access_token = create_access_token({"sub": str(db_user.id), "email": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": serialize_user(db_user)
    }


@router.get("/me")
def me(current_user: models.User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.post("/change-password")
def change_password(
    data: schemas.PasswordChange,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")

    current_user.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
