-- Revertir columna image_url a media_url en entity_media por ser mas generico
ALTER TABLE min_cultura.entity_media RENAME COLUMN image_url TO media_url;
