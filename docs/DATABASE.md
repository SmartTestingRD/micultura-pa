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
        string address "Dirección física (Si aplica)"
        string province "Provincia a nivel nacional"
        float latitude "Coordenada para Mapas Interactivos"
        float longitude "Coordenada para Mapas Interactivos"
        string contact_email
        string contact_phone
        int sector_id FK "Referencia principal al sector cultural"
        string status "ENUM: DRAFT, PUBLISHED, ARCHIVED"
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

    %% Relaciones
    INTERNAL_USERS ||--o{ CULTURAL_ENTITIES : "registra o aprueba"
    INTERNAL_USERS ||--o{ NEWS_ARTICLES : "escribe/publica"
    INTERNAL_USERS ||--o{ DOCUMENTS : "sube"
    
    CITIZENS ||--o{ CULTURAL_ENTITIES : "propone o reclama autoría"
    
    CULTURAL_SECTORS ||--o{ CULTURAL_ENTITIES : "agrupa (Directorio/Mapa)"
    
    CULTURAL_ENTITIES ||--o{ ENTITY_MEDIA : "posee (Fotos de perfil/Espacio)"
```

## Diccionario de Entidades Clave

1. **`INTERNAL_USERS` (Gestión Administrativa Interna):** 
   - Soporta exclusivamente a los funcionarios del Ministerio de Cultura. Tienen roles estrictos (`SUPER_ADMIN`, `EDITOR`) y son los únicos con permisos para publicar noticias, subir documentos legales y aprobar/rechazar entidades culturales.
2. **`CITIZENS` (Público General / Ciudadanos):**
   - Entidad apartada para los "ciudadanos de a pie" que se registran desde el portal público. Su cuenta les permite proponer entidades culturales (Ej: Registrar su propia banda musical o teatro), reclamar la autoría de un agente existente, y realizar futuros trámites gubernamentales asociados a su Cédula.
2. **`CULTURAL_SECTORS` (Sectores Culturales):**
   - Sirve como la tabla de catálogos estática para agrupar entidades bajo ramas específicas de arte (Música, Cine, Literatura). Soporta los carruseles de filtros.
3. **`CULTURAL_ENTITIES` (Entidades Culturales Polimórficas):**
   - **El corazón del sistema**. Representa simultáneamente a los "Agentes", "Espacios", "Manifestaciones" y "Eventos". 
   - En lugar de fragmentar 4 tablas distintas con datos idénticos (nombre, descripción, fotos, ubicación), usamos el patrón `entity_type` (Single Table Inheritance) para la indexación ultra veloz de búsquedas transversales. 
   - Contiene las propiedades `latitude` y `longitude` alimentando directamente la vista interactiva nativa del mapa.
4. **`ENTITY_MEDIA` (Multimedia):**
   - Almacena las URL de las fotografías asociadas a cualquier Entidad para renderizarlas en sus tarjetas o perfiles en el Directorio, sin sobrecargar la entidad original.
5. **`NEWS_ARTICLES` (Novedades) & `DOCUMENTS` (Documentos):**
   - Entidades aisladas que respaldan el portal de prensa público (`/novedades`) y el repositorio legislativo/abierto (`/documentos`).

## Recomendaciones a Nivel Infraestructura (DB)
- Configurar índices del tipo `B-TREE` en las columnas `entity_type` y `sector_id` de la tabla `CULTURAL_ENTITIES` ya que el portal filtra constantemente por estos campos.
- Incorporar indexación geoespacial (`PostGIS`) para las columnas de coordenadas (*latitude*, *longitude*) solo en caso de que en un futuro se decida implementar la funcionalidad "Filtrar por x kilómetros a la redonda de mi ubicación". En la versión actual 0.1.0 (marcadores globales sobre Panamá), campos flotantes indexados tradicionalmente son más que eficientes.
