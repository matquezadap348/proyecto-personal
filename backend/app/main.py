from fastapi import FastAPI

from app.database.database import engine, Base
from app.models.user import User
from app.routes.user import router as user_router


app = FastAPI(title="TaskFlow API")

app.include_router(user_router)


@app.get("/")
def root():
    return {"message": "TaskFlow API listo"}


Base.metadata.create_all(bind=engine)