-- 1. Create Catalogs Master Table
CREATE TABLE IF NOT EXISTS min_cultura.catalogs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'STUDIES_LEVEL', 'SPACE_MANAGEMENT_TYPE'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Catalog Items Table
CREATE TABLE IF NOT EXISTS min_cultura.catalog_items (
    id SERIAL PRIMARY KEY,
    catalog_id INTEGER REFERENCES min_cultura.catalogs(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL, -- The slug saved in the DB (e.g., 'high-school', 'public-national')
    label VARCHAR(255) NOT NULL, -- The text shown to the user (e.g., 'Secundaria', 'Pública Nacional')
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(catalog_id, value)
);

-- 3. Seed the Catalogs and Items with Legacy Data
DO $$
DECLARE
    studies_id INT;
    management_id INT;
    access_id INT;
    payment_id INT;
BEGIN
    -- STUDIES_LEVEL
    INSERT INTO min_cultura.catalogs (name, description) VALUES ('STUDIES_LEVEL', 'Niveles de estudio para agentes culturales') RETURNING id INTO studies_id;
    INSERT INTO min_cultura.catalog_items (catalog_id, value, label, sort_order) VALUES
        (studies_id, 'none', 'Ninguno', 1),
        (studies_id, 'basic', 'Básica', 2),
        (studies_id, 'high-school', 'Secundaria', 3),
        (studies_id, 'technical', 'Técnico', 4),
        (studies_id, 'bachelor', 'Licenciatura/Superior', 5),
        (studies_id, 'master', 'Maestría', 6),
        (studies_id, 'doctoral', 'Doctorado', 7);

    -- SPACE_MANAGEMENT_TYPE
    INSERT INTO min_cultura.catalogs (name, description) VALUES ('SPACE_MANAGEMENT_TYPE', 'Tipos de gestión para espacios culturales') RETURNING id INTO management_id;
    INSERT INTO min_cultura.catalog_items (catalog_id, value, label, sort_order) VALUES
        (management_id, 'public-national', 'Pública Nacional', 1),
        (management_id, 'public-municipal', 'Pública Municipal', 2),
        (management_id, 'private-business', 'Empresa Privada', 3),
        (management_id, 'private-individual', 'Individuo Privado', 4),
        (management_id, 'private-non-profit-entity', 'Entidad Privada sin Fines de Lucro', 5),
        (management_id, 'private-university', 'Universidad Privada', 6),
        (management_id, 'public-private', 'Público-Privada', 7),
        (management_id, 'community', 'Comunitaria', 8),
        (management_id, 'church', 'Iglesia', 9),
        (management_id, 'mixed-board-trustees', 'Patronato Mixto', 10),
        (management_id, 'other-administration', 'Otra Administración', 11),
        (management_id, 'not-apply', 'No Aplica', 12);

    -- SPACE_ACCESS_TYPE
    INSERT INTO min_cultura.catalogs (name, description) VALUES ('SPACE_ACCESS_TYPE', 'Tipos de acceso para espacios culturales') RETURNING id INTO access_id;
    INSERT INTO min_cultura.catalog_items (catalog_id, value, label, sort_order) VALUES
        (access_id, 'free', 'Libre', 1),
        (access_id, 'restricted', 'Restringido', 2),
        (access_id, 'previous-request', 'Con Solicitud Previa', 3);

    -- SPACE_PAYMENT_SCHEME
    INSERT INTO min_cultura.catalogs (name, description) VALUES ('SPACE_PAYMENT_SCHEME', 'Esquema de pago para espacios culturales') RETURNING id INTO payment_id;
    INSERT INTO min_cultura.catalog_items (catalog_id, value, label, sort_order) VALUES
        (payment_id, 'free-admission', 'Entrada Gratuita', 1),
        (payment_id, 'entry-price', 'Precio de Entrada', 2),
        (payment_id, 'voluntary-donation', 'Donación Voluntaria', 3);

END $$;
