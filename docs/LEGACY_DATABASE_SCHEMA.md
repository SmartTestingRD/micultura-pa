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
