# Guía de Contribución (CONTRIBUTING)

¡Gracias por tu interés en contribuir al "Ministerio de Cultura de Panamá"! 

Aspiramos a que este proyecto crezca como un software ordenado, predecible y altamente sostenible. Por esta razón, hemos estipulado este manual de operación para todos los ingenieros que formen parte del equipo.

## 1. Flujo de Trabajo con Ramas (Git Flow)

Adoptamos una versión adaptada de **Git Flow** para el control de versiones:
- **`main`**: Es la única rama que refleja el estado real en Producción. Por motivos de configuración continua (CI/CD en Vercel) ningún desarrollador hace *push* directo a `main`.
- **`develop`**: Es la rama de integración donde residen todas las características recién implementadas antes de una versión (`release`).
- Ramas de características (`feature/nombredelatarea`): Todas las nuevas contribuciones nacen derivándose desde `develop`. Una vez finalizada la prueba funcional, se hace un "Merge Request/Pull Request" hacia `develop`.
- Ramas de arreglos `fix/...` o `hotfix/...`: Siguen la misma lógica que los *features*, destinándose a mitigaciones rápidas.

> **Regla de Oro**: Siempre haz *pull* de la rama origen (sea main o develop) antes de crear la tuya. Mantén tu repositorio local sincronizado.

## 2. Estándares para el Formato de Commits

La historia de los cambios y aportes debe ser analógica a la documentación legible para un humano. Exigimos seguir la convención **Conventional Commits**.

**Formato Fijo:**
`<tipo>[alcance opcional]: <descripción imperativa>`

**Tipos Reconocidos en el Proyecto:**
- `feat`: Introduce una nueva característica orientada a negocio.
- `fix`: Resuelve un defecto comprobable (Bug) en el código.
- `docs`: Abarca cambios exclusivos de los archivos `.md` de documentación.
- `style`: Formateo de las sentencias del código de acuerdo al linter (Ej: Eslint, tabulaciones, no añade lógica).
- `refactor`: Limpieza que no implica agregar nuevos features ni arreglar bugs explícitos.
- `perf`: Rediseño de una porción de código destinada exclusivamente a que el programa vaya más deprisa o consuma menos.
- `test`: Tareas de verificación (unit tests).
- `chore`: Modificaciones de mantenimiento, tooling o configuración de empaquetadores (vite, npm dependencias).

**✅ Ejemplos Correctos:**
- `feat(auth): Integrate bcrypt middleware for user registration`
- `fix(ui): Correct category carousel scroll ref mapping`
- `docs: Create architecture markdown overview`

**❌ Ejemplos Incorrectos (Serán Rechazados):**
- `cambios en el login lol`
- `update`
- `fixed dark mode`

## 3. Normas de Estilo y Código

Este repositorio utiliza el sistema de tipado estricto `TypeScript` de la mano con `ESLint`. Sigue estas reglas al codificar:

- **Escribe todo el código base en inglés** (nombres de variables, clases funcionales, nombres de tablas, columnas asíncronas). Mantén el español explícitamente contenido a la interfaz visual (textos, modales HTML, logs hacia el cliente final, descripciones en Bases de datos).
- Jamás manipules el DOM directamente con selectores tradicionales como `document.querySelectorAll()` salvo que sea estrictamente ineludible. Deben priorizarse los `Hooks` y `useRefs` de React.
- Extrae toda la lógica compleja en *Hooks* personalizados (`useTheme`, `useAuth`) para que los componentes UI mantengan su principio de responsabilidad única.

Recomendamos utilizar Extensiones de "Autoforma" en editores base y cerciorarse de correr `npm run lint` antes de consolidar el cambio permanentemente.
