-- Migración para crear tabla de auditoría (tracking) de entidades culturales (Obras, Espacios, etc)

CREATE TABLE IF NOT EXISTS min_cultura.cultural_entities_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES min_cultura.cultural_entities(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- Ej: 'PROFILE_CREATED', 'STATUS_CHANGE', 'DATA_UPDATE', 'MEDIA_ADDED'
    previous_status VARCHAR(50),      -- Ej: 'DRAFT', 'PENDING'
    new_status VARCHAR(50),           -- Ej: 'PENDING', 'PUBLISHED', 'REJECTED'
    performer_role VARCHAR(50) NOT NULL, -- Ej: 'CITIZEN', 'SUPER_ADMIN', 'EDITOR', 'SYSTEM'
    performed_by_email VARCHAR(255) NOT NULL, -- Correo de quien ejecutó la acción
    reason TEXT,                      -- Motivo (Especialmente para rechazos/pausas desde Admin)
    changes_summary JSONB,            -- Resumen de qué datos cambiaron
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indice para búsquedas rápidas por ID de obra (útil para mostrar la bitácora)
CREATE INDEX IF NOT EXISTS idx_cultural_entities_audit_log_entity_id ON min_cultura.cultural_entities_audit_log(entity_id);
