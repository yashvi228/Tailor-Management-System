from fastapi import APIRouter, Depends , HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from .auth import get_current_user

router = APIRouter(prefix="/invoices", tags=["invoices"])


@router.get("/")
def get_invoices(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Invoice).filter(models.Invoice.owner_id == current_user.id).all()


@router.post("/")
def create_invoice(
    invoice: schemas.InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    customer = db.query(models.Customer).filter(
        models.Customer.id == invoice.customer_id,
        models.Customer.owner_id == current_user.id,
    ).first()
    order = db.query(models.Order).filter(
        models.Order.id == invoice.order_id,
        models.Order.owner_id == current_user.id,
    ).first()
    if not customer or not order:
        raise HTTPException(status_code=404, detail="Customer or order not found")

    new_invoice = models.Invoice(owner_id=current_user.id, **invoice.dict())

    db.add(new_invoice)

    db.commit()

    db.refresh(new_invoice)

    return new_invoice

@router.put("/{id}")
def update_invoice(
    id: int,
    data: schemas.InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):

    invoice = db.query(models.Invoice).filter(
        models.Invoice.id == id,
        models.Invoice.owner_id == current_user.id,
    ).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    customer = db.query(models.Customer).filter(
        models.Customer.id == data.customer_id,
        models.Customer.owner_id == current_user.id,
    ).first()
    order = db.query(models.Order).filter(
        models.Order.id == data.order_id,
        models.Order.owner_id == current_user.id,
    ).first()
    if not customer or not order:
        raise HTTPException(status_code=404, detail="Customer or order not found")

    invoice.customer_id = data.customer_id
    invoice.order_id = data.order_id
    invoice.amount = data.amount
    invoice.status = data.status

    db.commit()
    db.refresh(invoice)

    return invoice
@router.delete("/{id}")
def delete_invoice(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):

    invoice = db.query(models.Invoice).filter(
        models.Invoice.id == id,
        models.Invoice.owner_id == current_user.id,
    ).first()

    if not invoice:
        raise HTTPException(
            status_code=404,
            detail="Invoice not found"
        )

    db.delete(invoice)
    db.commit()

    return {"message": "Invoice deleted successfully"}
