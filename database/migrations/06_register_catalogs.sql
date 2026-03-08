-- Migración para crear catálogos de de registro de obras

-- 1. Tabla de Roles (Para individuos: Artesano, Escritor, etc.)
CREATE TABLE IF NOT EXISTS min_cultura.cultural_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 2. Tabla de Servicios (Para empresas: Produccion, Venta, etc.)
CREATE TABLE IF NOT EXISTS min_cultura.cultural_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Insertar Sectores (Si no existen ya)
INSERT INTO min_cultura.cultural_sectors (name) VALUES 
('Artes Escénicas'), ('Artes Visuales'), ('Artesanías'), 
('Audiovisual'), ('Danza'), ('Diseño'), ('Música'), ('Literatura')
ON CONFLICT (name) DO NOTHING;

-- Insertar Roles 
INSERT INTO min_cultura.cultural_roles (name) VALUES 
('Artesano'), ('Cantante/Músico'), ('Escritor'), 
('Pintor/Visual'), ('Creador de eventos'), ('Servicios culturales')
ON CONFLICT (name) DO NOTHING;

-- Insertar Servicios
INSERT INTO min_cultura.cultural_services (name) VALUES 
('Producción Audiovisual'), ('Gestión Cultural'), 
('Venta de Arte'), ('Formación/Talleres')
ON CONFLICT (name) DO NOTHING;
