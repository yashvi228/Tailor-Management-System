from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/measurements", tags=["Measurements"])


@router.get("/")
def get_measurements(db: Session = Depends(get_db)):
    return db.query(models.Measurement).all()


@router.post("/")
def create_measurement(data: schemas.MeasurementCreate, db: Session = Depends(get_db)):
    measurement = models.Measurement(**data.dict())

    db.add(measurement)
    db.commit()
    db.refresh(measurement)

    return measurement