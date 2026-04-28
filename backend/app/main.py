from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import engine
from . import models

from .routers import customers, orders, measurements
from .routers import auth
from .routers import invoices

# ✅ STEP 1: Create app FIRST
app = FastAPI()

# ✅ STEP 2: Mount uploads folder
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ STEP 3: Create DB tables
models.Base.metadata.create_all(bind=engine)

# ✅ STEP 4: CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ STEP 5: Routers
app.include_router(customers, prefix="/api")
app.include_router(orders, prefix="/api")
app.include_router(measurements, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(invoices.router, prefix="/api")

# ✅ Home route
@app.get("/")
def home():
    return {"message": "Tailor Management API Running"}