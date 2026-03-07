# Estructura del Esquema Heredado (backup_legacy)

Este documento describe la estructura relacional de la base de datos heredada del Sistema de Información Cultural (Sicultura), la cual ha sido exportada al esquema `backup_legacy` para consulta y procesos de migración (ETL) hacia el nuevo sistema.

## Contexto del Negocio y Funcionalidad del Sistema Legado

El esquema `backup_legacy` almacena los datos históricos del **Sistema de Información Cultural (Sicultura)**. Este sistema fue concebido originalmente como un gran directorio y repositorio digital para mapear el ecosistema cultural del país.

Para entender la estructura de los datos, es importante conocer las reglas de negocio originales que dictaron este diseño:

### 1. Sistema Basado en Entidades Separadas (Directorios)
En lugar de tratar a todos los actores culturales por igual, el negocio dictaba que cada tipo de registro tenía requerimientos de información tan distintos que merecían su propia tabla, creando múltiples "directorios" separados:
- **`entries_agents` (Agentes Culturales):** Son las personas físicas o jurídicas (artistas, artesanos, productores, gestores, fundaciones). Contiene datos como su nivel de estudios, si son residentes en Panamá, y enlaces a todas sus redes sociales de contacto.
- **`entries_spaces` (Espacios Culturales):** Son lugares físicos (museos, teatros, bibliotecas, academias). Almacena información sobre su accesibilidad, horarios e infraestructura.
- **`entries_events` (Eventos):** Exposiciones, conciertos, festivales. Tiene un ciclo de vida con fechas de inicio y fin.
- **`entries_manifestations` (Manifestaciones Culturales):** Datos sobre el patrimonio inmaterial, tradiciones, danzas o expresiones folclóricas. Relacionado fuertemente con su estado de salvaguardia (`sic_state`).

### 2. Clasificación Flexible y Taxonomías
El negocio requería que los agentes y espacios no pertenecieran a una sola categoría rígida, sino que pudieran estar "etiquetados" en múltiples áreas transversales (ej. un Agente puede ser de "Artes Visuales" y "Gestión Cultural" al mismo tiempo).
Por ello, se implementó un sistema de **Taxonomías** (`taxonomy_groups` y `taxonomy_terms`).
- Todas las categorías, subcategorías, regiones geográficas (provincias, distritos) y tipos de actividades existen como filas en `taxonomy_terms`.
- Las tablas con sufijo `_activities` o `_sectors` (ej. `entries_agents_activities`) son el puente que permite a un agente o espacio tener múltiples clasificaciones.

### 3. El Modelo de Aprobación (Publicación)
Cualquier registro ingresado en el sistema antiguo pasaba por un flujo de aprobación. Por eso casi todas las entidades principales contienen campos booleanos como:
- `published` (Publicado y visible al público)
- `sic_in_revision` (En revisión por un moderador)
- `sic_entry_archived` (Archivado u oculto intencionalmente)

### 4. Gestión de Archivos y Multimedia
Los usuarios subían portadas, galerías de fotos o documentos adjuntos a sus perfiles. En lugar de crear columnas para imágenes en cada tabla, el sistema legacy centralizó todos los archivos en **`entry_assets`**. 
Para saber a quién pertenece una foto, el registro utiliza una relación polimórfica combinando el ID del registro (`entry_id`) y el nombre de la tabla de donde viene (`entry_collection`, por ejemplo: "entries_agents"). Lo mismo aplica para las coordenadas geográficas centralizadas en **`entry_locations`**.

---

## Flujo Operativo Completo (Step-by-Step)

Para comprender mejor cómo esta estructura soportaba el negocio, a continuación se detalla el ciclo de vida característico de la información en Sicultura (Ejemplo: Un Agente Cultural):

### 1. El Registro Inicial (Creación del Perfil)
- Un usuario (artista, gestor, museo) ingresaba al portal y solicitaba crear su perfil.
- El sistema insertaba un nuevo registro en la tabla correspondiente a su naturaleza. Si era una persona, creaba una fila en **`entries_agents`**; si era una entidad física (como un teatro), lo hacía en **`entries_spaces`**.
- En este punto inicial, campos como `published` nacían en `false` y `sic_in_revision` en `true`. El perfil estaba "creado" pero oculto al público.

### 2. Clasificación del Perfil (Taxonomías)
- Durante el registro, el sistema le pedía al usuario seleccionar a qué sectores pertenecía, dónde estaba ubicado o qué actividades realizaba.
- El catálogo de opciones para responder a eso ya existía dentro de **`taxonomy_groups`** y **`taxonomy_terms`** (Administrado previamente por el Ministerio).
- Cuando el usuario guardaba, el sistema **no** guardaba esas respuestas en la tabla del perfil. En su lugar, creaba registros de enlace. Insertaba filas en **`entries_agents_activities`** o **`entries_spaces_sectors`**, uniendo el `ID` del usuario con el `ID` de las taxonomías seleccionadas (Artes Visuales, Danza, Provincia de Panamá, etc.).

### 3. Carga de Multimedia y Geolocalización
- El usuario necesitaba subir su foto de perfil, logotipos o galería de obras.
- El sistema subía físicamente la imagen al servidor y luego insertaba un registro en la tabla global **`entry_assets`** atado al `ID` del creador y la procedencia (ej. `entry_collection = 'entries_agents'`).
- Si el usuario marcaba su ubicación en el mapa, las coordenadas (latitud y longitud) no iban en la tabla principal, sino que se insertaba un nuevo registro en la tabla global **`entry_locations`** atado al `ID` original.

### 4. Flujo de Aprobación (Moderación Backoffice)
- Un funcionario (administrador) del Ministerio entraba a una vista interna o backoffice.
- El backoffice consultaba aquellos registros con firma de revisión (`SELECT * FROM entries_agents WHERE sic_in_revision = true`).
- El moderador abría el perfil, validaba que todo fuera lícito y hacía clic en "Aprobar".
- Esto lanzaba un `UPDATE` en la tabla: cambiaba `sic_in_revision = false` y ponía `published = true`. Además, el campo `sic_review_notification_sent` pasaba a `true` (disparando un correo al usuario confirmando su aprobación).

### 5. Publicación y Consumo (Directorio Público)
- El ciudadano común entraba al directorio público.
- Si buscaba "Pintores en Panamá", el sistema armaba una consulta que unía (mediante `JOIN`) las tablas `entries_agents`, con `entries_agents_activities` (para filtrar por el término 'Pintura' en la provincia 'Panamá'), buscando solo aquellos con `published = true`.
- Extraía la imagen de `entry_assets` mediante otro `JOIN` y el resultado se dibujaba en la pantalla como el perfil público validado del artista.

### Cierre de Ciclo Vital
Si un evento terminaba, se ocultaba del listado activo mediante la superación de su campo cronológico `date` en **`entries_events`**. Si un agente cerraba operaciones o un administrador lo daba de baja por incumplimiento, se marcaba la fila activando `sic_entry_archived = true`, sacándolo virtualmente de los resultados de búsqueda pública sin borrar sus registros relacionales en la base de datos.
