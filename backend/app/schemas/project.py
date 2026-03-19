from typing import Optional
from pydantic import BaseModel, ConfigDict

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    owner_id: int

    model_config = ConfigDict(from_attributes=True)