# Política de Seguridad

El equipo de infraestructura del **Ministerio de Cultura de Panamá** toma seriamente la confidencialidad de la información y la integridad e invulneración operacional de toda la plataforma de código abierto desarrollada.

## Versiones Soportadas

Actualmente, solo las construcciones consolidadas marcadas como **Último Release Estable** reciben retroalimentación y actualizaciones críticas por parte de los ingenieros centrales. Las versiones catalogadas como "Alpha" o "Beta" continúan considerándose bajo inestabilidad potencial.

| Versión | Perfil | Estado de Soporte Activo |
| ------- | :---: | :----------------------: |
| 1.0.x   | Producción | ❌  No publicada todavía  |
| **0.1.x**   | **Alpha Core** | **✅ Total**                    |

## Cómo Reportar una Vulnerabilidad

> [!NOTE]
> **Arquitectura Passwordless (Sin Contraseña):**  
> Para mitigar vectores severos de filtrado masivo ("Data Breaches"), robos por fuerza bruta y reciclamiento de contraseñas cruzadas, este proyecto ha optado desde la base (`v0.1.0`) por eliminar el almacenamiento local de cadenas estáticas e `hashes` bcrypt. Toda la identificación y autorización del ciudadano o administradores es despachada exclusivamente mediante envío efímero de Correos de Contraseña Única (Código OTP) e intercambio directo por JSON Web Tokens temporales, caducando a los 5 minutos y 24 horas, respectivamente.

Si un experto tecnológico, investigador de ciberseguridad o un usuario identifica deficiencias potenciales u hoyos de explotación (tales como `Inyección SQL`, vulneración `Cross-Site Scripting XSS`, fugas de Expiración en tokens JWT, saltos y falsificaciones `CSRF`), **solicitamos encarecidamente NO generar "Issues" abiertos dentro del rastreador público del repositorio.**

Procedimiento de reporte oficial:
1. Contactar urgentemente en privado al Líder Técnico de Repositorio o mantenedor directo enviando un correo con los detalles probatorios. (Correo *Pendiente de Definición Gubernamental*).
2. Asegurar en el mensaje de correo evidencia adjunta, los pasos analíticos exactos para reproducir empíricamente el modelo fallido, y la potencial severidad técnica que acarrea la brecha. 
3. El equipo acusará recibo en un plazo no mayor a **48 horas laborables**, iniciando la apertura de una rama de contención confidencial inmediata (`hotfix-security`) para blindar el error antes de que el público lo adquiera mediante un parche retroactivo de urgencia.

Toda contribución que preserve el entorno neutral y fiable de MiCultura agradece una acción discreta y pragmática.

## Matriz de Control de Acceso basado en Roles (RBAC)

El acceso a las APIs y al portal (tanto de Ciudadanos como Backoffice) obedece al atributo `role` del JSON Web Token emitido durante el login OTP o Admin.

| Rol en DB / JWT | Alcance Principal | Capacidades Autorizadas |
| ---------------- | :---------------: | :---------------------- |
| `CITIZEN` / `citizen` | Portal de Creadores | - Leer y actualizar su Perfil de Ciudadano.<br>- Crear, autoguardar (borradores) y enviar registros a la base de `cultural_entities` (Obras, Agentes, Espacios).<br>- Leer catálogos públicos. |
| `EDITOR` | Portal / Backoffice | - Leer y revisar entidades culturales creadas por los ciudadanos.<br>- Crear registros en nombre de ciudadanos asistidos (Soporte). |
| `SUPER_ADMIN` | Backoffice | - Acceso irrestricto a la aprobación/rechazo de perfiles de ciudadanos.<br>- Cambio de estado de Obras, Eventos y Entidades.<br>- Administración de catálogos y metadata.<br>- Delegar capacidades excepcionales (Crear registros en nombre de ciudadanos). |
| `OPERATIVE` / `ADMIN` | Backoffice (Legado) | - Roles para operadores internos del Ministerio enfocados en revisión, sin privilegios directos de creación sobre el Perfil del Creador. |

> [!IMPORTANT]
> **Filtro de Endpoint:** Múltiples endpoints como `/api/portal/works/create.ts` bloquean proactivamente las peticiones (HTTP 403 Forbidden) si el token decodificado no pertenece a `CITIZEN`, `EDITOR` o `SUPER_ADMIN`, garantizando que empleados internos sin el rol de atención al ciudadano no manipulen perfiles de terceros.
