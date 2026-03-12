# Registro de Cambios (Changelog)

Todos los cambios, refactorizaciones y avances notables de este proyecto de ingeniería serán documentados en este archivo.

El formato que utilizamos se fundamenta fuertemente en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y este equipo sigue el versionado [SemVer](https://semver.org/lang/es/) para numerar los lanzamientos de cara al usuario.

---

## [0.2.0] - 2026-03-11

### Añadido (Added)
- **Portal Ciudadano - Mis Obras (`WorksList.tsx`)**: Implementación de un tablero de control (`/portal/obras`) donde los ciudadanos pueden gestionar su catálogo de obras. Incluye filtros por estado (Aprobados, En Revisión, Observados, Borradores), búsqueda en tiempo real, opciones de vista (Cuadrícula/Lista) y un carrusel de obras más destacadas.
- **Detalle Dinámico de Obras (`WorkDetail.tsx`)**: Nueva vista dedicada (`/portal/obras/:id`) para visualizar a profundidad todas las propiedades de una obra o registro cultural.
- **Motor de Inyección y Digerido de Metadatos**: El sistema ahora lee automáticamente el campo genérico `JSONB` (`metadata` en PostgreSQL) y renderiza iterativamente sus propiedades como "Información Adicional Técnica" en la UI, traduciendo llaves técnicas al español y limpiando estructuras de arrays dinámicos sin importar la cantidad de nuevos campos.
- **Flujo de Observación y Subsanación**: Habilitación de flujo bidireccional entre el Backoffice (evaluadores) y el Portal (Ciudadanos) para retroceder solicitudes al estado `OBSERVED`, requiriendo correcciones acompañadas por notas de auditoría, las cuales los creadores pueden enmendar y presionar "Corregido" para retornar al estado `UNDER_REVIEW`.
- Extensión de Query y Endpoints (`/api/portal/works/list`, `/api/portal/works/get`, `/api/backoffice/works/pending`) para mapear eficientemente descripciones directas y resoluciones nativas de imágenes `image_urls` utilizando subconsultas SQL sin sacrificar rendimiento.

---

## [0.1.0-alpha] - 2026-02-27

### Añadido (Added)
- Nueva iniciativa Documentación Código (`Documentation As Code`): Adición de repositorios de infraestructura como `ARCHITECTURE.md`, `TECH_STACK.md`, `REQUIREMENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`.
- Implementación de flujos de Registro e Inicio de Sesión mediante códigos de verificación de un solo uso (OTP) al correo electrónico para mejorar la experiencia y seguridad (eliminando el uso de contraseñas locales).
- Primer andamiaje del área administrativa (`Backoffice`) con enrutamiento protegido mediante JSON Web Tokens (JWT) y decodificación en frontend del nombre de usuario.
- Implementación base de contexto React global `ThemeContext` y el componente individual `ThemeToggle` para controlar las variantes Claro/Oscuro en la paleta de colores.
- Configuración fundamental `vercel.json` y `api/package.json` para facilitar un flujo nativo continuo a la infraestructura "Functions" de Vercel.

### Modificado (Changed)
- Las etiquetas de links nativos `<a>` en casi todos los componentes (tales como `Home`, `News`, `Directory`, y `Documents`) fueron cambiadas permanentemente por `<Link>` utilizando  `react-router-dom` a efectos de promover Single Page Applications limpias e instantáneas.
- Redireccionamiento generalizado de las importaciones del footer: De `sobre_sicultura.html` al enrutador moderno React de `/sobre`.
- Corrección de la propiedad CSS `@custom-variant dark` dentro del compilador original `Tailwind v4` para permitir los re-estilos visuales manuales desde el front.

### Corregido (Fixed)
- Solucionada visibilidad de elementos asincronos afectados por la clase CSS vacía `animate-on-scroll` distribuyendo el uso pragmático de un interceptor DOM `IntersectionObserver`.
- Subsanado problema crítico (`TypeError: Destructuring req.body Cannot read properties of undefined`) pre-visualizado en respuestas 500 del servidor Vercel.
- Resuelto bloqueo en los carretes modulares o `Carousels` estáticos introduciendo referencias (refs) de Desplazamientos JSX sobre los ejes absolutos X de componentes directores como *Carrusel de Categorías* (`Directory`, `Map`).
