from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models import Customer,Order

router=APIRouter(prefix="/dashboard")

def get_db():
    db=SessionLocal()
    yield db
    db.close()

@router.get("/stats")
def stats(db:Session=Depends(get_db)):
    customers=db.query(Customer).count()
    orders=db.query(Order).count()

    return {
        "total_customers":customers,
        "total_orders":orders
    }