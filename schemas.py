from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    email: str

class User(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Document(BaseModel):
    id: int
    filename: str
    user_id: int
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

class Report(BaseModel):
    id: int
    document_id: int
    user_id: int
    report_content: str
    generated_at: datetime
    
    class Config:
        from_attributes = True
