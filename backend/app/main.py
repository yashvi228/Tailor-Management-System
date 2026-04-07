from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models

from .routers import customers, orders, measurements


# create tables
models.Base.metadata.create_all(bind=engine)


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# routers
app.include_router(customers)
app.include_router(orders)
app.include_router(measurements)


@app.get("/")
def home():
    return {"message": "Tailor Management API Running"}