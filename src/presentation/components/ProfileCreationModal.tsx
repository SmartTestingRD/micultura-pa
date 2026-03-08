import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProfileCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProfileCreationModal: React.FC<ProfileCreationModalProps> = ({ isOpen, onClose }) => {
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        entity_type: 'CULTURAL_AGENT',
        name: '',
        province: '',
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/cultural-entities/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            setSuccessMessage(data.message || 'Su perfil ha sido creado y se encuentra en revisión. Se le notificará cuando sea aprobado y publicado.');
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 p-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-lora">Crear mi Perfil Cultural</h2>

                {successMessage ? (
                    <div className="text-center py-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-700 bg-green-50 p-4 rounded-lg font-medium">{successMessage}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Perfil</label>
                            <select
                                name="entity_type"
                                value={formData.entity_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                required
                            >
                                <option value="CULTURAL_AGENT">Agente Cultural (Físico o Jurídico)</option>
                                <option value="SPACE">Espacio Cultural / Museo</option>
                                <option value="EVENT">Evento o Festival</option>
                                <option value="MANIFESTATION">Manifestación / Patrimonio</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Entidad o Perfil</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="P. Ej. Teatro Nacional"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                placeholder="P. Ej. Panamá"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading || !formData.name}
                                className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Procesando...' : 'Solicitar Creación'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-4">
                            Deseas crear tu perfil. Este perfil iniciará en <span className="font-semibold text-gray-700">estado de revisión</span> hasta ser aprobado por el Ministerio de Cultura.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};
