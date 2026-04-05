from pydantic import BaseModel
from datetime import date
from typing import Optional
from .models import ProductionStatus

# Customer schemas
class CustomerBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class Customer(CustomerBase):
    id: int
    created_at: date

    class Config:
        orm_mode = True

# Measurement schemas
class MeasurementBase(BaseModel):
    chest: Optional[int] = None
    waist: Optional[int] = None
    hip: Optional[int] = None
    shoulder: Optional[int] = None
    sleeve_length: Optional[int] = None
    inseam: Optional[int] = None
    neck: Optional[int] = None

class MeasurementCreate(MeasurementBase):
    pass

class Measurement(MeasurementBase):
    id: int
    order_id: int

    class Config:
        orm_mode = True

# Order schemas
class OrderBase(BaseModel):
    order_date: date
    delivery_date: Optional[date] = None
    production_status: ProductionStatus = ProductionStatus.PENDING
    total_price: Optional[int] = None
    notes: Optional[str] = None

class OrderCreate(OrderBase):
    customer_id: int
    measurements: MeasurementCreate

class Order(OrderBase):
    id: int
    customer_id: int
    measurements: Optional[Measurement] = None

    class Config:
        orm_mode = True