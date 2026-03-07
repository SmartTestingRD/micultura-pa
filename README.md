# Ministerio de Cultura de Panamá

![Build Status](https://img.shields.io/badge/status-0.1.0--alpha-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-white?logo=express&logoColor=black)

Portal web y sistema de gestión para el **Ministerio de Cultura de Panamá (MiCultura)**. Esta plataforma integra un directorio cultural, mapas interactivos, visualización de estadísticas, gestión documental y un panel de administración seguro administrado mediante Clean Architecture.

## 🚀 Estado de Construcción

Actualmente el proyecto se encuentra en la versión **0.1.0-alpha**.
- **Frontend:** Estructura de vistas completada (Home, Directorio, Mapa, Estadísticas, Novedades, Documentos, Sobre Sicultura). Integración de Dark Mode global vía React Context y componentes de autenticación dinámica (LoginModal, RegistrationModal).
- **Backend:** Servicios API base configurados de forma híbrida (Express local y Serverless Functions en Vercel). Funciones de Autenticación sin contraseña (OTP vía Email) y Proxy estabilizadas con soporte CommonJS. Enrutamiento del Backoffice protegido por JWT.
- **Base de Datos:** Configuración inicial con PostgreSQL mapeada en la capa de datos. Tablas de Ciudadanos (CITIZENS) y validación de OTP (OTP_CODES) implementadas y funcionales.

## 📦 Guía Rápida de Instalación

### Prerrequisitos
- Node.js (v18 o superior recomendado)
- PostgreSQL (para la base de datos local)

### Configuración del Entorno local
1. Clona el repositorio:
   ```bash
   git clone https://github.com/cabepi/panama_min_cultura.git
   cd panama_min_cultura
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno. Copia el archivo de ejemplo y ajusta los valores:
   ```bash
   cp .env.example .env
   ```

### 🛠 Comandos de Desarrollo

El proyecto está configurado para ejecutar de forma concurrente el frontend (Vite) y el backend local (Express) con un solo comando:

```bash
# Iniciar frontend y backend en entorno de desarrollo (con recarga en vivo)
npm run dev

# Compilar para producción (TypeScript + Vite build)
npm run build

# Previsualizar el build de producción localmente
npm run preview
```

## 📚 Estructura Principal
El código se organiza siguiendo principios de Clean Architecture:
- `src/presentation/`: Componentes de React, Páginas, Contextos de estado global (`Auth`,`Theme`).
- `src/domain/`: Lógica de negocio y definiciones de entidades TypeScript.
- `src/data/`: Acceso a la base de datos y servicios externos.
- `src/server/`: Servidor Express de desarrollo local.
- `api/`: Funciones Serverless nativas para la plataforma de Vercel.

### Documentación del Proyecto
- [Arquitectura Detallada (ARCHITECTURE.md)](./ARCHITECTURE.md)
- [Esquema de Base de Datos (DATABASE.md)](./DATABASE.md)
- [Stack Tecnológico (TECH_STACK.md)](./TECH_STACK.md)
- [Requerimientos (REQUIREMENTS.md)](./REQUIREMENTS.md)
- [Guía de Contribución (CONTRIBUTING.md)](./CONTRIBUTING.md)
- [Políticas de Seguridad (SECURITY.md)](./SECURITY.md)
- [Registro de Cambios (CHANGELOG.md)](./CHANGELOG.md)

---
*Desarrollado para el Ministerio de Cultura de Panamá.*
