from pydantic import BaseModel
from typing import Optional


# ----------------------------
# CUSTOMER SCHEMA
# ----------------------------

class CustomerCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None


class Customer(CustomerCreate):
    id: int

    class Config:
        from_attributes = True


# ----------------------------
# MEASUREMENTS SCHEMA
# ----------------------------

class MeasurementCreate(BaseModel):

    customer_id: int

    chest: float
    waist: float
    hips: float
    shoulder: float
    sleeve: float
    inseam: float
    neck: float

    notes: Optional[str] = None


class Measurement(MeasurementCreate):
    id: int

    class Config:
        from_attributes = True


# ----------------------------
# ORDERS SCHEMA
# ----------------------------

class OrderCreate(BaseModel):

    customer_id: int
    description: str
    amount: float
    due_date: str
    status : str


class Order(OrderCreate):
    id: int

    class Config:
        from_attributes = True