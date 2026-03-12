# Arquitectura de Datos (Diagrama Entidad-Relación)

Con base en los **Requerimientos Funcionales** levantados (Directorio Cultural, Mapas Interactivos, Gestión de Identidad y Novedades), este documento expone el diseño del esquema relacional que soporta la base de datos **PostgreSQL**.

## Diagrama Entidad-Relación (ERD)

Este modelo conceptual utiliza las convenciones de `Mermaid` para ilustrar las relaciones entre las entidades fundamentales requeridas por la plataforma del Ministerio de Cultura.

```mermaid
erDiagram
    INTERNAL_USERS {
        uuid id PK
        string email UK "Correo corporativo (@micultura.gob.pa)"
        string password_hash "Contraseña encriptada bcrypt"
        string full_name "Nombre del funcionario / administrador"
        string role "Rol: SUPER_ADMIN, EDITOR, REVIEWER"
        boolean is_active "Estado de la cuenta"
        timestamp created_at
        timestamp updated_at
    }

    CITIZENS {
        uuid id PK
        string email UK "Correo personal del ciudadano"
        string full_name "Nombre completo"
        string id_card UK "Cédula de identidad (Opcional/Requerido para trámites)"
        string phone_number
        boolean is_verified "Email verificado (Validado vía OTP)"
        boolean authorizes_data_treatment "Aceptó uso de datos"
        boolean accepts_terms_conditions "Aceptó Términos"
        boolean accepts_privacy_policy "Aceptó Políticas de Privacidad"
        timestamp created_at
        timestamp updated_at
    }

    OTP_CODES {
        uuid id PK
        string email "Correo destino del código"
        string otp_code "Código de 6 dígitos"
        boolean is_used "Previene reutilización"
        timestamp expires_at "Vigencia predeterminada de 5 minutos"
        timestamp created_at
    }

    CULTURAL_SECTORS {
        int id PK
        string name UK "Artes Visuales, Música, Literatura, etc."
        string icon_identifier "ID del icono (ej. palette, music_note)"
        string description
    }

    CULTURAL_ENTITIES {
        uuid id PK
        string entity_type "ENUM: CULTURAL_AGENT, SPACE, EVENT, MANIFESTATION, HERITAGE"
        string name "Nombre legal o comercial"
        text description "Descripción detallada"
        jsonb metadata "Campo sin esquema para guardar propiedades únicas (Redes, roles, integrantes, año, etc)"
        string address "Dirección física (Si aplica)"
        string province "Provincia a nivel nacional"
        float latitude "Coordenada para Mapas Interactivos"
        float longitude "Coordenada para Mapas Interactivos"
        string contact_email
        string contact_phone
        int sector_id FK "Referencia principal al sector cultural"
        string status "ENUM: DRAFT, PUBLISHED, UNDER_REVIEW, OBSERVED, REJECTED, ARCHIVED"
        uuid created_by FK "Usuario que registró la entidad"
        timestamp created_at
        timestamp updated_at
    }

    ENTITY_MEDIA {
        uuid id PK
        uuid entity_id FK "A qué entidad pertenece"
        string media_url "Enlace público en balde de S3/Cloud"
        string media_type "ENUM: COVER_IMAGE, GALLERY_IMAGE, VIDEO"
        boolean is_featured "Si es la foto principal del carrusel"
    }

    NEWS_ARTICLES {
        uuid id PK
        string title "Titular de la noticia"
        string slug UK "URL amigable (SEO)"
        text content "Cuerpo enriquecido (HTML/Markdown)"
        string excerpt "Resumen corto"
        string cover_image_url
        string status "ENUM: DRAFT, PUBLISHED"
        uuid author_id FK "Redactor/Administrador"
        timestamp published_at "Programación de publicación"
        timestamp created_at
        timestamp updated_at
    }

    DOCUMENTS {
        uuid id PK
        string title "Nombre del recurso o documento legal"
        string file_url "Link directo de descarga al PDF/DOC"
        string category "Ej: Rendición de Cuentas, Legislación"
        uuid uploaded_by FK
        timestamp created_at
    }

    CULTURAL_ENTITIES_AUDIT_LOG {
        int id PK
        uuid entity_id FK "Entidad evaluada"
        uuid user_id FK "Evaluador Backoffice"
        string action "Acción ejecutada (ej. REVIEW)"
        string previous_status "Estado antes del cambio"
        string new_status "Estado posterior (ej. OBSERVED)"
        text comments "Comentarios, motivos u observaciones del evaluador"
        timestamp created_at
    }

    %% Relaciones
    INTERNAL_USERS ||--o{ CULTURAL_ENTITIES : "aprueba/observa"
    INTERNAL_USERS ||--o{ NEWS_ARTICLES : "escribe/publica"
    INTERNAL_USERS ||--o{ DOCUMENTS : "sube"
    INTERNAL_USERS ||--o{ CULTURAL_ENTITIES_AUDIT_LOG : "audita"
    
    CITIZENS ||--o{ CULTURAL_ENTITIES : "crea catálogos y piezas"
    
    CULTURAL_SECTORS ||--o{ CULTURAL_ENTITIES : "agrupa (Directorio/Mapa)"
    
    CULTURAL_ENTITIES ||--o{ ENTITY_MEDIA : "posee (Fotos de pieza/Espacio)"
    CULTURAL_ENTITIES ||--o{ CULTURAL_ENTITIES_AUDIT_LOG : "tiene un historial de revisiones"
```

## Diccionario de Entidades Clave

1. **`INTERNAL_USERS` (Gestión Administrativa Interna):** 
   - Soporta exclusivamente a los funcionarios del Ministerio de Cultura. Tienen roles estrictos (`SUPER_ADMIN`, `EDITOR`) y son los únicos con permisos para publicar noticias, subir documentos legales y aprobar/rechazar/observar entidades culturales.
2. **`CITIZENS` (Público General / Creadores):**
   - Entidad apartada para los "ciudadanos de a pie" y creadores. Su cuenta les permite ingresar al Portal de Obras, proponer piezas culturales (obras de arte, artesanías, etc.), y enviarlas a revisión.
3. **`CULTURAL_SECTORS` (Sectores Culturales):**
   - Sirve como la tabla de catálogos estática para agrupar entidades bajo ramas específicas de arte (Música, Cine, Literatura). Soporta los carruseles de filtros y selectores en formularios.
4. **`CULTURAL_ENTITIES` (Entidades Culturales Polimórficas - "Las Obras"):**
   - **El corazón del sistema**. Representa simultáneamente a los "Agentes", "Espacios", "Manifestaciones", "Eventos" y sobre todo "Obras Registradas". 
   - En lugar de fragmentar múltiples tablas con datos idénticos (nombre, descripción, fotos, ubicación), usamos el campo `entity_type` (Single Table Inheritance).
   - **El campo clave `metadata` (JSONB)**: Este campo flexible sin esquema aloja de forma dinámica y ultra veloz arreglos y objetos complejos específicos por cada categoría sin modificar las columnas (Ej. *Integrantes, Redes Sociales, Técnicas, Medidas, Año de Creación*, etc).
5. **`ENTITY_MEDIA` (Multimedia):**
   - Almacena las URL de las fotografías asociadas a cualquier Obra/Entidad. Reemplaza el enfoque de campo único para que una obra pueda tener galerías infinitas.
6. **`CULTURAL_ENTITIES_AUDIT_LOG` (Historial de Auditoría):**
   - Almacena el rastro bidireccional de estados de una obra. Por ejemplo, documenta exactamente el motivo de rechazo (campo `comments`) cuando un usuario de Backoffice transforma el estado de una obra ciudadana de `UNDER_REVIEW` hacia `OBSERVED`.

## Recomendaciones a Nivel Infraestructura (DB)
- Configurar índices del tipo `B-TREE` en las columnas `entity_type` y `sector_id` de la tabla `CULTURAL_ENTITIES`.
- Crear índices `GIN` (*Generalized Inverted Index*) sobre la columna `metadata` en PostgreSQL, habilitando que consultas de backend avancen filtrando rápidamente valores internos anidados en JSON.
- Incorporar indexación geoespacial (`PostGIS`) para las columnas de coordenadas solo si es necesario a gran escala en un futuro. En el volumen actual, campos flotantes tradicionales son óptimos.
