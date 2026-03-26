from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserDB(UserBase):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class DocumentDB(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    filename: str
    filepath: str
    user_id: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class ReportDB(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    document_id: str
    user_id: str
    report_content: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
