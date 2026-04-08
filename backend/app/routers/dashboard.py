from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Customer, Order, Measurement

router = APIRouter(prefix="/dashboard")

@router.get("/stats")
def stats(db: Session = Depends(get_db)):
    customers = db.query(Customer).count()
    orders = db.query(Order).count()
    measurements = db.query(Measurement).count()

    return {
        "total_customers": customers,
        "total_orders": orders,
        "total_measurements": measurements
    }
