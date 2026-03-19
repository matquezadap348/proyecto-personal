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

## Para ver el backend
cd backend
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload

## Para ver el frontend
cd frontend
npm run dev

## Despliegue con Docker (Recomendado)

Asegúrate de tener Docker y Docker Compose instalados.

1. Clonar el repositorio.
2. Desde la raíz, ejecutar:
   ```bash
   docker compose up -d --build