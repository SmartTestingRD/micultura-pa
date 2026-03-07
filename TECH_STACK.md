# Stack Tecnológico

Este documento define las tecnologías exactas, lenguajes, frameworks y dependencias utilizadas en el desarrollo de la plataforma, extraídas de la configuración de construcción actual del repositorio.

## Base y Runtime
| Tecnología | Versión / Detalle | Propósito |
| :--- | :--- | :--- |
| **Node.js** | Entorno Local | Runtime de JavaScript en el lado del servidor y herramientas de compilación. |
| **TypeScript** | `~5.9.3` | Lenguaje principal de todo el repositorio (Frontend, Backend, y Configuración). Transpilador de tipado estricto. |

## Capa Frontend (Presentación)
| Tecnología | Versión / Detalle | Propósito |
| :--- | :--- | :--- |
| **React** | `^19.2.0` | Librería principal para la construcción de la interfaz de usuario. |
| **React DOM** | `^19.2.0` | Renderizador web para React. |
| **Vite** | `^7.3.1` | Empaquetador y servidor de desarrollo ultra rápido con soporte de Hot-Module Replacement (HMR). |
| **React Router DOM** | `^7.13.1` | Enrrutador oficial de la aplicación (Single Page Application). |
| **Tailwind CSS** | `^4.2.1` | Framework CSS utilitario. Configurado globalmente vía `@tailwindcss/vite`. |
| **Lucide React** | `^0.575.0` | Paquete de iconos SVG escalables consistentes. |

## Capa Backend e Infraestructura
| Tecnología | Versión / Detalle | Propósito |
| :--- | :--- | :--- |
| **Express** | `^5.2.1` | Framework backend minimalista utilizado para el entorno local. |
| **PostgreSQL (`pg`)** | `^8.19.0` | Cliente oficial de Node.js para interactuar con la base de datos PostgreSQL. |
| **JSON Web Token (JWT)**| `^9.0.3` | Generación y validación de tokens seguros de autenticación para protección de rutas. |
| **Bcrypt.js** | `^3.0.3` | Encriptación (hashing) algorítmica y salting de contraseñas de administrador. |
| **Cors** | `^2.8.6` | Middleware de Express para permitir el Intercambio de Recursos de Origen Cruzado. |
| **Dotenv** | `^17.3.1` | Carga variables de entorno críticas desde arreglos `.env`. |

## Herramientas de Desarrollo (DevTools)
| Tecnología | Versión / Detalle | Propósito |
| :--- | :--- | :--- |
| **ESLint** | `^9.39.1` | Linter modular del código base mediante reglas estáticas para TypeScript y React Hooks. |
| **TSX / TS-Node** | `^4.21.0` / `^10.9.2` | Ejecuta de forma directa los archivos `.ts` de node sin una transpilación pre-hecha. |
| **Concurrently** | `^9.2.1` | Permite arrancar y mantener vivo tanto Vite (Frontend) como Express (Backend local) con un solo comando. |

## Plataforma y Despliegue
- **Hosting / CI-CD**: **Vercel**. El sistema utiliza el entorno Edge de Vercel para servir las vistas estáticas del Frontend de React, operando su lógica de negocio de Backend sobre infraestuctura **Serverless** (`Vercel Functions`) que corren en Node (CommonJS mapping configurado en `api/`).
