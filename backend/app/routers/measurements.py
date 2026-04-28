from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from .. import models, database
import shutil
import os

router = APIRouter(prefix="/measurements", tags=["Measurements"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# GET all
@router.get("/")
def get_measurements(db: Session = Depends(database.get_db)):
    return db.query(models.Measurement).all()


# CREATE with image upload
@router.post("/")
def create_measurement(
    customer_id: int = Form(...),
    garment_type: str = Form(...),
    chest: float = Form(None),
    waist: float = Form(None),
    hips: float = Form(None),
    shoulder: float = Form(None),
    sleeve: float = Form(None),
    inseam: float = Form(None),
    neck: float = Form(None),
    notes: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(database.get_db),
):

    image_path = None

    # save image
    if file:
        file_location = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        image_path = file_location

    new_measurement = models.Measurement(
        customer_id=customer_id,
        garment_type=garment_type,
        chest=chest,
        waist=waist,
        hips=hips,
        shoulder=shoulder,
        sleeve=sleeve,
        inseam=inseam,
        neck=neck,
        notes=notes,
        image=image_path,
    )

    db.add(new_measurement)
    db.commit()
    db.refresh(new_measurement)

    return new_measurement