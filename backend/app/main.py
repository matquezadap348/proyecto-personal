from fastapi import FastAPI

from app.database.database import engine, Base
from app.models.user import User
from app.models.task import Task
from app.routes.user import router as user_router
from app.routes.auth import router as auth_router
from app.routes.task import router as task_router

app = FastAPI(title="TaskFlow API")

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(task_router)


@app.get("/")
def root():
    return {"message": "TaskFlow API listo"}


Base.metadata.create_all(bind=engine)