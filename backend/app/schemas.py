from pydantic import BaseModel

class CustomerCreate(BaseModel):
    name:str
    phone:str
    address:str

class MeasurementCreate(BaseModel):
    customer_id: int
    chest: float
    waist: float
    hips: float
    shoulder: float
    sleeve: float
    inseam: float
    neck: float
    notes: str | None = None

class OrderCreate(BaseModel):
    customer_id:int
    dress_type:str
    price:str
    status:str