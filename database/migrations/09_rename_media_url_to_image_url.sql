-- Renombrar columna media_url a image_url en entity_media para alojar las representaciones de Vercel Blob
ALTER TABLE min_cultura.entity_media RENAME COLUMN media_url TO image_url;
