from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models,schemas

router = APIRouter(prefix="/customers")

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_customer(customer:schemas.CustomerCreate,db:Session=Depends(get_db)):
    new=models.Customer(**customer.dict())
    db.add(new)
    db.commit()
    db.refresh(new)
    return new

@router.get("/")
def get_customers(db:Session=Depends(get_db)):
    return db.query(models.Customer).all()