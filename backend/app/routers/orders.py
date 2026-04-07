from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models,schemas

router = APIRouter(prefix="/orders")

def get_db():
    db=SessionLocal()
    yield db
    db.close()

@router.post("/")
def create_order(data:schemas.OrderCreate,db:Session=Depends(get_db)):
    order=models.Order(**data.dict())
    db.add(order)
    db.commit()
    return order

@router.get("/")
def get_orders(db:Session=Depends(get_db)):
    return db.query(models.Order).all()