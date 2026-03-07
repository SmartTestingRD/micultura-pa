-- Schema Initialization for Ministerio de Cultura

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS min_cultura;

-- 2. Create INTERNAL_USERS table
CREATE TABLE IF NOT EXISTS min_cultura.internal_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'EDITOR',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create CITIZENS table (Public Registrations)
CREATE TABLE IF NOT EXISTS min_cultura.citizens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Now nullable as we use OTP
    full_name VARCHAR(255) NOT NULL,
    id_card VARCHAR(100) UNIQUE,
    phone_number VARCHAR(50),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    authorizes_data_treatment BOOLEAN NOT NULL DEFAULT false,
    accepts_terms_conditions BOOLEAN NOT NULL DEFAULT false,
    accepts_privacy_policy BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create CULTURAL_SECTORS table
CREATE TABLE IF NOT EXISTS min_cultura.cultural_sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    icon_identifier VARCHAR(50),
    description TEXT
);

-- 5. Create CULTURAL_ENTITIES table (Polymorphic table for Agents, Spaces, Events, etc)
CREATE TABLE IF NOT EXISTS min_cultura.cultural_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- CULTURAL_AGENT, SPACE, EVENT, MANIFESTATION, HERITAGE
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    province VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    sector_id INTEGER REFERENCES min_cultura.cultural_sectors(id),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    created_by UUID REFERENCES min_cultura.internal_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create ENTITY_MEDIA table
CREATE TABLE IF NOT EXISTS min_cultura.entity_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES min_cultura.cultural_entities(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(50) NOT NULL, -- COVER_IMAGE, GALLERY_IMAGE, VIDEO
    is_featured BOOLEAN NOT NULL DEFAULT false
);

-- 7. Create NEWS_ARTICLES table
CREATE TABLE IF NOT EXISTS min_cultura.news_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    author_id UUID REFERENCES min_cultura.internal_users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create DOCUMENTS table
CREATE TABLE IF NOT EXISTS min_cultura.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    category VARCHAR(100),
    uploaded_by UUID REFERENCES min_cultura.internal_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create OTP_CODES table (Transversal OTP System)
CREATE TABLE IF NOT EXISTS min_cultura.otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cultural_entities_type ON min_cultura.cultural_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_cultural_entities_sector ON min_cultura.cultural_entities(sector_id);

-- Unique Indexes for authentication tables (Ensuring email searches are fast and unique)
CREATE UNIQUE INDEX IF NOT EXISTS idx_internal_users_email ON min_cultura.internal_users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_citizens_email ON min_cultura.citizens(email);
