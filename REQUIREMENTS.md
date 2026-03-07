# Requerimientos del Sistema

Este documento define la base de los requerimientos funcionales y no funcionales que la plataforma "Ministerio de Cultura de Panamá" está diseñada para cumplir.

## Requerimientos Funcionales

Los requerimientos funcionales detallan los casos de uso específicos que los usuarios interactuando con el sistema podrán efectuar.

1. **Gestión de Identidad y Acceso (Roles)**
   - El sistema debe permitir inicio de sesión protegido por credenciales cifradas para usuarios de tipo "Administrador" (Dashboard administrativo).
   - El sistema debe mantener sesiones activas mediante JSON Web Tokens (JWT).

2. **Exploración del Directorio Cultural**
   - El sistema debe ofrecer un Directorio de Agentes y Espacios Culturales (`/directorio`).
   - El ecosistema debe proporcionar un carrusel interactivo que permita filtrar datos por "Sectores Culturales" (Ej: Artes Visuales, Música, Literatura).

3. **Mapas Interactivos**
   - El sistema debe renderizar un mapa público interactivo (`/mapa`) que posicione eventos y espacios culturales geolocalizados a nivel nacional.
   - El mapa debe disponer de filtros categorizados similares a los del directorio.

4. **Visualización de Estadísticas**
   - El portal debe presentar métricas, indicadores o cuadros de mando (`/estadisticas`) sobre el impacto de la gestión del Ministerio.

5. **Noticias y Novedades**
   - El sistema debe contar con un panel paginado e interactivo para visualizar artículos, notas de prensa y noticias destacadas (`/novedades`).

6. **Preferencias Globales del Usuario**
   - El portal debe permitir el intercambio fluido, a decisión del usuario, entre temas visuales Oscuro ("Dark Mode") y Claro ("Light Mode"). Las preferencias deben recordarse a nivel almacenamiento de navegador (LocalStorage).

## Requerimientos No Funcionales

Restricciones, cualidades de arquitectura y métricas de calidad que el ecosistema debe aplicar.

1. **Seguridad**
   - **Autenticación Fuerte**: Las contraseñas en la capa transaccional deben protegerse usando hashes aleatorios `Bcrypt`.
   - **Prevensión de Exposición**: Toda comunicación clave del backend que exponga la base de datos debe ser blindada, usando rutas de la API en el servidor u operando mediante patrones "Proxy" que oculten API keys de terceros.

2. **Desempeño y Experiencia de Usuario (UX)**
   - **SPA Responsivo**: El cambio de páginas debe ejecutarse sin recarga completa del navegador mediante ruteo a nivel del cliente web (React Router DOM).
   - **Animaciones Suaves y Feedback Visua**l: Debe implementar una estrategia `animate-on-scroll` garantizando que los bloques surjan conforme se navega.

3. **Escalabilidad, Portabilidad y Despliegue**
   - **Despliegue Habilitado sin Servidor Central**: El Backend no debe depender de máquinas de estado fijas, admitiendo funciones sin estado autoejecutables en servicios en la nube (Serverless Functions) para tolerancia a altos picos de tráfico.
   - **Neutralidad de Entornos**: Deberá comportarse de forma simétrica e infalible tanto en un entorno local de ejecución (`Express`) como en la provisión final de Vercel.
