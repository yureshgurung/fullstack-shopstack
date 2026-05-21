from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ── User ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Token ─────────────────────────────────────────────────────────────────────
class Token(BaseModel):
    access_token: str
    token_type: str


# ── Product ───────────────────────────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock: int = 0


class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    category: Optional[str]
    image_url: Optional[str]
    stock: int
    owner_id: int
    created_at: datetime
    owner: UserOut

    class Config:
        from_attributes = True
