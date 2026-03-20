from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, case


from app.database.database import get_db
from app.models.project import Project
from app.models.user import User
from app.models.task import Task
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.dependencies import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_project = Project(**project.model_dump(), owner_id=current_user.id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(
        Project.id,
        Project.title,
        Project.description,
        Project.owner_id,
        func.count(Task.id).label("task_count"),
        func.coalesce(func.sum(case((Task.completed == True, 1), else_=0)), 0).label("completed_task_count")
    ).outerjoin(Task, Project.id == Task.project_id)\
     .filter(Project.owner_id == current_user.id)\
     .group_by(Project.id).all()

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, project_update: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by the current user")

    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print(f"DEBUG: User {current_user.id} trying to delete project {project_id}")
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found or not owned by the current user")

    db.delete(project)
    db.commit()
    return None