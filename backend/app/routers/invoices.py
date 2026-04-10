from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.get("/")
def get_invoices(db: Session = Depends(get_db)):
    return db.query(models.Invoice).all()


@router.post("/")
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):

    new_invoice = models.Invoice(**invoice.dict())

    db.add(new_invoice)

    db.commit()

    db.refresh(new_invoice)

    return new_invoice