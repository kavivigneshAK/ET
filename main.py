from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from contextlib import asynccontextmanager
import os
import shutil
from bson import ObjectId

from database import connect_to_mongo, close_mongo_connection, get_database
import models
from core_analysis import generate_forensic_report

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(title="IPO X-Ray API (MongoDB)", lifespan=lifespan)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/users/", response_model=models.UserDB, response_model_by_alias=False)
async def create_user(user: models.UserBase, db: AsyncIOMotorDatabase = Depends(get_database)):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.UserDB(**user.model_dump())
    result = await db.users.insert_one(new_user.model_dump(by_alias=True))
    new_user_db = await db.users.find_one({"_id": result.inserted_id})
    return new_user_db

@app.post("/upload/", response_model=models.DocumentDB, response_model_by_alias=False)
async def upload_document(user_id: str, file: UploadFile = File(...), db: AsyncIOMotorDatabase = Depends(get_database)):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user_id format")

    db_user = await db.users.find_one({"_id": user_id})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(UPLOAD_DIR, f"{user_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    new_doc = models.DocumentDB(
        filename=file.filename,
        filepath=file_path,
        user_id=user_id
    )
    result = await db.documents.insert_one(new_doc.model_dump(by_alias=True))
    final_doc = await db.documents.find_one({"_id": result.inserted_id})
    return final_doc

@app.post("/analyze/{document_id}", response_model=models.ReportDB, response_model_by_alias=False)
async def analyze_document(document_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    if not ObjectId.is_valid(document_id):
        raise HTTPException(status_code=400, detail="Invalid document_id format")

    db_doc = await db.documents.find_one({"_id": document_id})
    if not db_doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    existing_report = await db.reports.find_one({"document_id": document_id})
    if existing_report:
        return existing_report
        
    try:
        report_content = await generate_forensic_report(db_doc["filepath"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Configuration Error: {str(e)}")
    except PermissionError as e:
        raise HTTPException(status_code=429, detail=f"Rate Limit/Quota: {str(e)}")
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=f"Upstream Provider Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
        
    new_report = models.ReportDB(
        document_id=document_id,
        user_id=db_doc["user_id"],
        report_content=report_content
    )
    result = await db.reports.insert_one(new_report.model_dump(by_alias=True))
    final_report = await db.reports.find_one({"_id": result.inserted_id})
    return final_report

@app.get("/reports/user/{user_id}", response_model=list[models.ReportDB], response_model_by_alias=False)
async def get_user_reports(user_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    reports_cursor = db.reports.find({"user_id": user_id})
    reports = await reports_cursor.to_list(length=100)
    return reports

@app.get("/reports/{report_id}", response_model=models.ReportDB, response_model_by_alias=False)
async def get_single_report(report_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Invalid report_id format")
    db_report = await db.reports.find_one({"_id": report_id})
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    return db_report
