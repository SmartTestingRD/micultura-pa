-- Migración para crear catálogos base adicionales de de registro de obras

-- 1. Tabla de Tipos de Registro (Main Type: Obra, Agente, Espacio, Evento)
CREATE TABLE IF NOT EXISTS min_cultura.register_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    value VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Tabla de Sub Clasificaciones (Persona, Agrupación, Empresa)
CREATE TABLE IF NOT EXISTS min_cultura.sub_classifications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    value VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Categorías de Obras (Artesanía, Pintura, Escultura, etc)
CREATE TABLE IF NOT EXISTS min_cultura.work_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    value VARCHAR(100) UNIQUE NOT NULL
);

-- Insertar Tipos de Registro
INSERT INTO min_cultura.register_types (name, value) VALUES 
('Obra o Múltiple Singular', 'obra'), 
('Agente Cultural', 'agente'), 
('Espacio Cultural', 'espacio'), 
('Evento Cultural', 'evento')
ON CONFLICT (value) DO NOTHING;

-- Insertar Sub Clasificaciones
INSERT INTO min_cultura.sub_classifications (name, value) VALUES 
('Persona (Artista individual)', 'Personas'), 
('Agrupación (Banda, colectivo)', 'Agrupaciones'), 
('Empresa o Emprendimiento', 'Empresas y emprendimientos')
ON CONFLICT (value) DO NOTHING;

-- Insertar Categorías de Obra genéricas
INSERT INTO min_cultura.work_categories (name, value) VALUES 
('Artesanía', 'Artesanía'), 
('Pintura', 'Pintura'), 
('Escultura', 'Escultura'), 
('Fotografía', 'Fotografía'), 
('Grabado / Gráfica', 'Grabado / Gráfica'), 
('Arte Digital', 'Arte Digital'), 
('Diseño de Moda / Joyería', 'Diseño de Moda / Joyería'), 
('Instalación', 'Instalación'), 
('Textil', 'Textil'), 
('Mobiliario', 'Mobiliario'), 
('Audiovisual (Corto, Video}', 'Audiovisual (Corto, Video}'), 
('Obra Literaria / Poesía', 'Obra Literaria / Poesía'), 
('Publicación / Zine', 'Publicación / Zine'), 
('Otro', 'Otro')
ON CONFLICT (value) DO NOTHING;
