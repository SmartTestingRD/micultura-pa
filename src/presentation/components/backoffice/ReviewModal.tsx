import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: any;
    onReviewed: () => void;
}

// Helper for translating entity type
const getEntityTypeLabel = (type: string) => {
    switch (type) {
        case 'CULTURAL_AGENT': return 'Gestor Cultural';
        case 'SPACE': return 'Espacio Cultural';
        case 'GROUP': return 'Agrupación';
        case 'COMPANY': return 'Empresa Cultural';
        case 'FESTIVAL': return 'Festival';
        default: return type.replace(/_/g, ' ');
    }
};

// Helper for mapping standard SIC keys to readable Spanish
const getReadableKey = (key: string) => {
    const map: Record<string, string> = {
        'sic_subcategory': 'Subcategoría',
        'sic_studies_level': 'Nivel Educativo',
        'sic_contact_facebook': 'Facebook',
        'sic_contact_instagram': 'Instagram',
        'sic_contact_twitter': 'X/Twitter',
        'sic_activities_start_year': 'Año de Inicio (Actividades)',
        'sic_capacity': 'Capacidad Aforo',
        'sic_management_type': 'Tipo de Administración',
    };
    if (map[key]) return map[key];

    return key.replace(/^sic_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, profile, onReviewed }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionReason, setActionReason] = useState('');

    if (!isOpen || !profile) return null;

    const handleReview = async (newStatus: 'CONFIRMED' | 'REJECTED' | 'PAUSED') => {
        if ((newStatus === 'REJECTED' || newStatus === 'PAUSED') && !actionReason.trim()) {
            setError('Debe proporcionar un motivo para esta acción.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/backoffice/profiles/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    entityId: profile.entity_id,
                    newStatus,
                    reason: actionReason
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update profile status');
            }

            onReviewed(); // Trigger refresh on parent
            setActionReason('');
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Validación de Registro</h2>
                        <p className="text-sm text-slate-500 mt-1">Revisa detalladamente la información antes de aprobar.</p>
                    </div>
                    <button
                        onClick={() => {
                            setActionReason('');
                            onClose();
                        }}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body (Scrollable Profile Details) */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
                            Error: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Section 1: Entity Metadata */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                Datos del Perfil Cultural
                            </h3>
                            <dl className="space-y-4 text-sm">
                                <div>
                                    <dt className="text-slate-500 font-medium font-sans">Nombre / Razón Social</dt>
                                    <dd className="font-bold text-slate-900 mt-1">{profile.profile_name}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 font-medium font-sans">Tipo de Registro</dt>
                                    <dd className="font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-md inline-block mt-1">
                                        {getEntityTypeLabel(profile.entity_type)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 font-medium font-sans">Provincia Registrada</dt>
                                    <dd className="font-medium text-slate-900 mt-1">{profile.province}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 font-medium font-sans">Descripción de la Actividad</dt>
                                    <dd className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {profile.description || 'No se proporcionó descripción detallada.'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Section 2: Citizen Account Info */}
                        <div className="flex flex-col">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                    Contacto del Ciudadano
                                </h3>
                                <dl className="space-y-4 text-sm">
                                    <div>
                                        <dt className="text-slate-500 font-medium font-sans">Nombre del Solicitante</dt>
                                        <dd className="font-bold text-slate-900 mt-1 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm text-green-600">verified_user</span>
                                            {profile.citizen_name}
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <dt className="text-slate-500 font-medium font-sans">Correo (Validado)</dt>
                                            <dd className="font-medium text-slate-900 mt-1 break-all">{profile.contact_email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500 font-medium font-sans">Teléfono</dt>
                                            <dd className="font-medium text-slate-900 mt-1">{profile.contact_phone || 'N/A'}</dd>
                                        </div>
                                    </div>
                                </dl>
                            </div>

                            {/* Standardized Table for Metadata */}
                            {profile.metadata && Object.keys(profile.metadata).length > 0 && (
                                <div className="mt-8 flex-1">
                                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                        Información Complementaria
                                    </h3>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-slate-600">Atributo</th>
                                                    <th className="px-4 py-3 font-semibold text-slate-600 border-l border-slate-200">Valor Adicional</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {Object.entries(profile.metadata).map(([key, value]) => (
                                                    <tr key={key} className="hover:bg-slate-50">
                                                        <td className="px-4 py-3 text-slate-700 font-medium w-1/2">
                                                            {getReadableKey(key)}
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-900 font-bold border-l border-slate-100 break-words w-1/2">
                                                            {String(value) || <span className="text-slate-400 italic">Vacío</span>}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Acciones Secundarias (Motivo) */}
                <div className="px-8 pt-4 bg-slate-50 border-t border-slate-100">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Motivo de Rechazo o Pausa (Requerido para estas acciones):
                    </label>
                    <textarea
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none h-20"
                        placeholder="Ej. El documento de identidad no es legible..."
                        value={actionReason}
                        onChange={(e) => setActionReason(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* Footer (Actions) */}
                <div className="px-8 py-5 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
                    <button
                        onClick={() => handleReview('REJECTED')}
                        disabled={loading}
                        className="px-6 py-2.5 border-2 border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                        Rechazar
                    </button>

                    <button
                        onClick={() => handleReview('PAUSED')}
                        disabled={loading}
                        className="px-6 py-2.5 border-2 border-slate-300 text-slate-600 hover:bg-slate-100 font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                        Pausar
                    </button>

                    <button
                        onClick={() => handleReview('CONFIRMED')}
                        disabled={loading}
                        className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/30 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <span className="material-symbols-outlined text-lg">check_circle</span>}
                        Aprobar y Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};
