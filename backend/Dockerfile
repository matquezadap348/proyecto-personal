# 1. Usamos una versión oficial y ligera de Python
FROM python:3.11-slim

# 2. Le decimos a Docker dónde trabajar dentro del contenedor
WORKDIR /app

# 3. Copiamos el archivo de dependencias primero
COPY requirements.txt .

# 4. Instalamos las librerías necesarias
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copiamos todo el resto de tu código al contenedor
COPY . .

# 6. Exponemos el puerto por el que escuchará FastAPI
EXPOSE 8000

# 7. El comando exacto para encender el servidor dentro de la caja
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]