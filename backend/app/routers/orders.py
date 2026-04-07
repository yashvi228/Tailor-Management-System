from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/")
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()


@router.post("/")
def create_order(data: schemas.OrderCreate, db: Session = Depends(get_db)):

    order = models.Order(
        customer_id=data.customer_id,
        description=data.description,
        due_date=data.due_date,
        amount=data.amount

    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


@router.put("/{id}")
def update_order(id: int, data: schemas.OrderCreate, db: Session = Depends(get_db)):

    order = db.query(models.Order).filter(models.Order.id == id).first()

    order.customer_id = data.customer_id
    order.description = data.description
    order.due_date = data.due_date
    order.amount = data.amount

    db.commit()
    db.refresh(order)

    return order


@router.delete("/{id}")
def delete_order(id: int, db: Session = Depends(get_db)):

    order = db.query(models.Order).filter(models.Order.id == id).first()

    db.delete(order)
    db.commit()

    return {"message": "Order deleted"}