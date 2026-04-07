from sqlalchemy import Column,Integer,String,ForeignKey,Float
from sqlalchemy.orm import relationship
from .database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    phone = Column(String)
    address = Column(String)
    email=Column(String)


class Measurement(Base):

    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    chest = Column(Float)
    waist = Column(Float)
    hips = Column(Float)
    shoulder = Column(Float)
    sleeve = Column(Float)
    inseam = Column(Float)
    neck = Column(Float)

    notes = Column(String)



class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer)

    description = Column(String)

    amount = Column(Float)

    due_date = Column(String)

    status = Column(String, default="Pending")