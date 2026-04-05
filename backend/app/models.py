from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum

class ProductionStatus(str, enum.Enum):
    PENDING = "pending"
    CUTTING = "cutting"
    SEWING = "sewing"
    QUALITY_CHECK = "quality_check"
    COMPLETED = "completed"
    DELIVERED = "delivered"

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, index=True)
    email = Column(String)
    address = Column(String)
    created_at = Column(Date, server_default="CURRENT_DATE")

    orders = relationship("Order", back_populates="customer")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    order_date = Column(Date, nullable=False)
    delivery_date = Column(Date)
    production_status = Column(Enum(ProductionStatus), default=ProductionStatus.PENDING)
    total_price = Column(Integer)  # in smallest currency unit, e.g. cents
    notes = Column(String)

    customer = relationship("Customer", back_populates="orders")
    measurements = relationship("Measurement", back_populates="order", uselist=False)

class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), unique=True)
    chest = Column(Integer)
    waist = Column(Integer)
    hip = Column(Integer)
    shoulder = Column(Integer)
    sleeve_length = Column(Integer)
    inseam = Column(Integer)
    neck = Column(Integer)

    order = relationship("Order", back_populates="measurements")