from sys import prefix
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import invoices
from .database import engine
from . import models
from .routers import auth
from .routers import customers, orders, measurements

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routers
app.include_router(customers, prefix="/api")
app.include_router(orders, prefix="/api")
app.include_router(measurements, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(invoices.router,prefix="/api")
@app.get("/")
def home():
    return {"message": "Tailor Management API Running"}