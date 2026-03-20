# VORTEX | TaskFlow

Aplicación web profesional para la gestión de proyectos y tareas con una interfaz moderna y rápida.

---

## Tecnologías que utilizamos

Para este proyecto elegimos un stack moderno y potente:

### **Frontend (Lo que ves)**
* **React 18**: Para una interfaz rápida y reactiva.
* **TypeScript**: Para que el código sea más seguro y libre de errores.
* **TailwindCSS**: Para el diseño oscuro (Dark Mode) y efectos neón.
* **Dnd-kit**: Para poder arrastrar y soltar tareas (Drag & Drop) de forma fluida.

### **Backend (El cerebro)**
* **FastAPI**: Un servidor de Python de alto rendimiento y muy rápido.
* **PostgreSQL**: Una base de datos robusta para guardar toda la información.
* **SQLAlchemy**: Para conectar Python con la base de datos de forma eficiente.
* **JWT (Tokens)**: Para que el inicio de sesión sea seguro.

### **Infraestructura**
* **Docker & Docker Compose**: Para que el proyecto se pueda ejecutar en cualquier computadora con un solo comando, sin instalar nada extra.

---

## Lo más destacado

* **Barras de progreso**: Mira cuánto te falta para terminar un proyecto de un vistazo.
* **Notificaciones**: Avisos visuales cada vez que completas una tarea.
* **Seguridad**: Rutas protegidas para que solo tú veas tus proyectos.
* **Diseño Neón**: Una estética futurista y limpia.

---

## Cómo hacerlo funcionar

Es muy fácil si tienes **Docker** instalado:

1. Clona este repositorio.
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta el comando:
   ```bash
   docker compose up -d --build