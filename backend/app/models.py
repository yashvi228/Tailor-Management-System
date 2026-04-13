from sqlalchemy import Column,Integer,String,ForeignKey,Float , DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):

    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)

    email = Column(String,unique=True,index=True)

    password = Column(String)
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

    customer_id = Column(Integer, ForeignKey("customers.id"))

    description = Column(String)

    amount = Column(Float)

    due_date = Column(String)

    status = Column(String, default="Pending")

class Invoice(Base):

    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    order_id = Column(Integer, ForeignKey("orders.id"))

    amount = Column(Float)

    status = Column(String, default="Pending")

    created_at = Column(DateTime, default=datetime.utcnow)
