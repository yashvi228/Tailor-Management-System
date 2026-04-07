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

    measurement = models.Measurement(
        customer_id=data.customer_id,
        chest=data.chest,
        waist=data.waist,
        hips=data.hips,
        shoulder=data.shoulder,
        sleeve=data.sleeve,
        inseam=data.inseam,
        neck=data.neck,
        notes=data.notes
    )

    db.add(measurement)
    db.commit()
    db.refresh(measurement)

    return measurement


@router.put("/{id}")
def update_measurement(id: int, data: schemas.MeasurementCreate, db: Session = Depends(get_db)):

    m = db.query(models.Measurement).filter(models.Measurement.id == id).first()

    m.customer_id = data.customer_id
    m.chest = data.chest
    m.waist = data.waist
    m.hips = data.hips
    m.shoulder = data.shoulder
    m.sleeve = data.sleeve
    m.inseam = data.inseam
    m.neck = data.neck
    m.notes = data.notes

    db.commit()
    db.refresh(m)

    return m


@router.delete("/{id}")
def delete_measurement(id: int, db: Session = Depends(get_db)):

    m = db.query(models.Measurement).filter(models.Measurement.id == id).first()

    db.delete(m)
    db.commit()

    return {"message": "Measurement deleted"}