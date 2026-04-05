from sqlalchemy.orm import Session
from . import models, schemas

# Customer CRUD
def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, customer_update: schemas.CustomerCreate):
    db_customer = get_customer(db, customer_id)
    for var, value in vars(customer_update).items():
        setattr(db_customer, var, value) if value else None
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int):
    db_customer = get_customer(db, customer_id)
    db.delete(db_customer)
    db.commit()
    return db_customer

# Order CRUD
def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()

def create_order(db: Session, order: schemas.OrderCreate):
    # Create measurements first
    meas_data = order.measurements.dict()
    db_measurement = models.Measurement(**meas_data)
    db.add(db_measurement)
    db.flush()

    # Create order
    order_data = order.dict(exclude={'measurements'})
    db_order = models.Order(**order_data, measurements=[db_measurement])
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_status(db: Session, order_id: int, status: models.ProductionStatus):
    db_order = get_order(db, order_id)
    db_order.production_status = status
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = get_order(db, order_id)
    db.delete(db_order)
    db.commit()
    return db_order