-- Insert 10 mock internal users with different roles
-- Password for all is: Prueba01*

INSERT INTO min_cultura.internal_users (email, full_name, password_hash, role, is_active) VALUES
    ('admin1@cultura.gob.pa', 'Administrador Principal', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'ADMIN', true),
    ('admin2@cultura.gob.pa', 'Administrador Secundario', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'ADMIN', true),
    
    ('evaluador1@cultura.gob.pa', 'Evaluador Senior (Artes Visuales)', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'EVALUADOR', true),
    ('evaluador2@cultura.gob.pa', 'Evaluador Senior (Música)', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'EVALUADOR', true),
    ('evaluador3@cultura.gob.pa', 'Evaluador Especialista (Patrimonio)', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'EVALUADOR', true),
    ('evaluador4@cultura.gob.pa', 'Evaluador Trainee', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'EVALUADOR', true),
    
    ('editor1@cultura.gob.pa', 'Editor de Noticias', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'EDITOR', true),
    ('editor2@cultura.gob.pa', 'Editor de Documentos Públicos', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'EDITOR', true),
    
    ('analista1@cultura.gob.pa', 'Analista de Estadísticas', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'ANALISTA', true),
    
    ('inactivo1@cultura.gob.pa', 'Usuario Suspendido', '$2b$10$nqcLM9CZkNlSHSzhhak26OZMuq2XB.7lThW8JTVrJLJGySRzSaTrm', 'EDITOR', false)
ON CONFLICT (email) DO NOTHING;
