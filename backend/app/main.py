from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import customers, orders, measurements

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tailor Shop Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(measurements.router)


@app.get("/")
def root():
    return {"message": "Tailor Shop API is running"}