from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas, database, models

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    return crud.create_order(db, order)

@router.get("/", response_model=list[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    orders = crud.get_orders(db, skip=skip, limit=limit)
    return orders

@router.get("/{order_id}", response_model=schemas.Order)
def read_order(order_id: int, db: Session = Depends(database.get_db)):
    db_order = crud.get_order(db, order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.patch("/{order_id}/status")
def update_status(order_id: int, status: models.ProductionStatus, db: Session = Depends(database.get_db)):
    db_order = crud.update_order_status(db, order_id, status)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": db_order.production_status}

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(database.get_db)):
    crud.delete_order(db, order_id)
    return {"ok": True}