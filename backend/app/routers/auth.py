from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
import uuid
import bcrypt

from ..database.db import get_db
from ..database.sqlalchemy_models import UserModel
from ..models.auth import UserRegister, UserLogin, Token, UserResponse
from ..models.user import UserProfile

SECRET_KEY = os.environ.get("JWT_SECRET")
# In production, require a secure JWT secret
if os.environ.get("RENDER") or os.environ.get("ENVIRONMENT") == "production":
    if not SECRET_KEY:
        raise ValueError("JWT_SECRET environment variable is required in production.")
else:
    # Fallback only for local development
    SECRET_KEY = SECRET_KEY or "super-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def verify_password(plain_password, hashed_password):
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_password, hashed_password)

def get_password_hash(password):
    if isinstance(password, str):
        password = password.encode('utf-8')
    # Generate salt and hash
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user = UserModel(
        id=str(uuid.uuid4()),
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        profile_json=None
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    token = create_access_token(data={"sub": user.id}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    token = create_access_token(data={"sub": user.id}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/login/json", response_model=Token)
def login_json(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == creds.email).first()
    if not user or not verify_password(creds.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    token = create_access_token(data={"sub": user.id}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserModel = Depends(get_current_user)):
    profile = UserProfile(**current_user.profile_json) if current_user.profile_json else None
    return UserResponse(id=current_user.id, email=current_user.email, profile=profile)

@router.put("/profile", response_model=UserResponse)
def update_profile(profile: UserProfile, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    current_user.profile_json = profile.dict()
    db.commit()
    db.refresh(current_user)
    return UserResponse(id=current_user.id, email=current_user.email, profile=profile)
