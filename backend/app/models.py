from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)


class Customer(Base):

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    phone = Column(String)
    address = Column(String)
    email = Column(String)


class Measurement(Base):

    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    garment_type = Column(String)

    chest = Column(Float)
    waist = Column(Float)
    hips = Column(Float)
    shoulder = Column(Float)
    sleeve = Column(Float)
    inseam = Column(Float)
    neck = Column(Float)
    image = Column(String)  
    notes = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)


class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    description = Column(String)

    amount = Column(Float)

    status = Column(String, default="Pending")

    order_date = Column(Date)

    due_date = Column(Date)


class Invoice(Base):

    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    order_id = Column(Integer, ForeignKey("orders.id"))

    amount = Column(Float)

    status = Column(String, default="Pending")

    created_at = Column(DateTime, default=datetime.utcnow)