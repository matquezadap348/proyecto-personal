# TaskFlow

Aplicación web full stack de gestión de tareas.

## Stack tecnológico

Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication

Frontend
- React
- TypeScript
- TailwindCSS

Infraestructura
- Docker
- Docker Compose

## Funcionalidades

- Registro de usuarios
- Login seguro con JWT
- Crear tareas
- Editar tareas
- Marcar tareas como completadas
- Eliminar tareas

## Para iniciarlo
cd backend
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload