import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface WorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    work: any;
    onReviewed: () => void;
}

export const ReviewWorkModal: React.FC<WorkModalProps> = ({ isOpen, onClose, work, onReviewed }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionReason, setActionReason] = useState('');
    const [showReasonInput, setShowReasonInput] = useState<'REJECTED' | 'OBSERVED' | null>(null);

    if (!isOpen || !work) return null;

    const handleReview = async (newStatus: 'APPROVED' | 'REJECTED' | 'OBSERVED') => {
        if ((newStatus === 'REJECTED' || newStatus === 'OBSERVED') && !showReasonInput) {
            setShowReasonInput(newStatus);
            return;
        }

        if ((newStatus === 'REJECTED' || newStatus === 'OBSERVED') && !actionReason.trim()) {
            setError('Debe proporcionar un motivo para esta acción.');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/backoffice/works/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    entityId: work.id,
                    newStatus,
                    reason: actionReason
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al procesar la revisión');
            }

            onReviewed(); 
            setActionReason('');
            setShowReasonInput(null);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReason = () => {
        setShowReasonInput(null);
        setActionReason('');
        setError('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-slide-up">

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-600">assignment</span>
                            Expediente del Trámite
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Modo lectura: Revise toda la información declarada por el ciudadano.</p>
                    </div>
                    <button
                        onClick={() => {
                            setActionReason('');
                            setShowReasonInput(null);
                            onClose();
                        }}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body (Scrollable Details) */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
                            Error: {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Column 1 */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                    Información General
                                </h3>
                                <dl className="space-y-4 text-sm">
                                    <div>
                                        <dt className="text-slate-500 font-medium">Título / Nombre</dt>
                                        <dd className="font-bold text-slate-900 mt-1 text-lg">{work.title}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 font-medium">Categoría / Tipo</dt>
                                        <dd className="font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-md inline-block mt-1">
                                            {work.entity_type === 'obra' ? (work.metadata?.category || 'Obra') : 'Ficha / Entidad'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 font-medium">Fecha de Emisión</dt>
                                        <dd className="font-medium text-slate-900 mt-1">{new Date(work.created_at).toLocaleDateString()}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-slate-500 font-medium">Descripción Conceptual</dt>
                                        <dd className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px]">
                                            {work.description || work.metadata?.description || 'No especificada'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {/* Ficha specific info like Members or Roles */}
                            {work.metadata?.mainType !== 'obra' && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                        Datos de Ficha
                                    </h3>
                                    <dl className="space-y-4 text-sm">
                                        <div>
                                            <dt className="text-slate-500 font-medium">Sub-clasificación</dt>
                                            <dd className="font-medium text-slate-900 mt-1">{work.metadata?.subType || 'No especificada'}</dd>
                                        </div>
                                        {/* Roles / Services */}
                                        {(work.metadata?.roles?.length > 0 || work.metadata?.artisticRoles?.length > 0) && (
                                            <div>
                                                <dt className="text-slate-500 font-medium">Roles Artísticos</dt>
                                                <dd className="mt-1 flex flex-wrap gap-2">
                                                    {(work.metadata?.roles || work.metadata?.artisticRoles || []).map((r: string) => (
                                                        <span key={r} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">{r}</span>
                                                    ))}
                                                </dd>
                                            </div>
                                        )}
                                        {/* Members */}
                                        {work.metadata?.members?.length > 0 && (
                                            <div>
                                                <dt className="text-slate-500 font-medium">Integrantes</dt>
                                                <dd className="mt-2 space-y-2">
                                                    {work.metadata.members.map((m: any, idx: number) => (
                                                        <div key={idx} className="bg-slate-50 p-2 rounded flex justify-between text-xs border border-slate-100">
                                                            <span className="font-semibold text-slate-800">{m.name}</span>
                                                            <span className="text-slate-500">{m.role}</span>
                                                        </div>
                                                    ))}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}

                             {/* Obra specific info like Techniques */}
                             {work.metadata?.mainType === 'obra' && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                        Detalles Técnicos
                                    </h3>
                                    <dl className="space-y-4 text-sm">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <dt className="text-slate-500 font-medium">Técnica(s)</dt>
                                                <dd className="font-medium text-slate-900 mt-1">{work.metadata?.techniques || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500 font-medium">Dimensiones</dt>
                                                <dd className="font-medium text-slate-900 mt-1">{work.metadata?.dimensions || 'N/A'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500 font-medium">Año de Inicio</dt>
                                                <dd className="font-medium text-slate-900 mt-1">{work.metadata?.year || work.metadata?.yearStarted || 'N/A'}</dd>
                                            </div>
                                        </div>
                                    </dl>
                                </div>
                            )}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-8">
                            {/* Images and Documents */}
                             <div>
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                    Evidencia Visual
                                </h3>
                                {(work.image_urls?.length > 0 || work.metadata?.imageUrls?.length > 0 || work.metadata?.imageUrl) ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {(work.image_urls || work.metadata?.imageUrls || [work.metadata?.imageUrl]).map((url: string, idx: number) => (
                                            <a key={idx} href={url} target="_blank" rel="noreferrer" className="block relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-colors group cursor-zoom-in">
                                                <img src={url} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">open_in_new</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-6 text-center text-slate-500 flex flex-col items-center">
                                        <ImageIcon size={32} className="text-slate-300 mb-2" />
                                        <p className="text-sm">El ciudadano no aportó imágenes o fotografías para este registro.</p>
                                    </div>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                                <h3 className="text-md font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-blue-600 text-sm">person</span>
                                    Ciudadano Solicitante
                                </h3>
                                <dl className="space-y-3 text-sm">
                                    <div>
                                        <dt className="text-blue-700/70 font-medium text-xs uppercase tracking-wider">Nombre</dt>
                                        <dd className="font-bold text-blue-900 mt-0.5">{work.citizen_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-blue-700/70 font-medium text-xs uppercase tracking-wider">Email Registrado</dt>
                                        <dd className="font-medium text-blue-900 mt-0.5">{work.citizen_email}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Update / Action Section */}
                {showReasonInput ? (
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 animate-slide-up">
                        <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                            {showReasonInput === 'REJECTED' ? <span className="material-symbols-outlined text-red-500">cancel</span> : <AlertTriangle size={18} className="text-amber-500" />}
                            Justificación requerida para {showReasonInput === 'REJECTED' ? 'Rechazar' : 'Subsanar'}:
                        </label>
                        <p className="text-xs text-slate-500 mb-3">Este mensaje será enviado y visible para el ciudadano <strong>{work.citizen_name}</strong>.</p>
                        <textarea
                            className="w-full border border-slate-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none min-h-[100px] shadow-inner mb-4"
                            placeholder={showReasonInput === 'REJECTED' 
                                ? "Ej. Las obras literarias no aplican para esta categoría. Debe registrarla en la Dirección Nacional de Derecho de Autor."
                                : "Ej. La fotografía #2 es ilegible. Por favor, cargue una imagen de mayor resolución de la técnica aplicada."
                            }
                            value={actionReason}
                            onChange={(e) => setActionReason(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                            <button
                                onClick={handleCancelReason}
                                disabled={loading}
                                className="px-5 py-2 text-slate-600 hover:bg-slate-200 font-medium rounded-xl transition-colors text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleReview(showReasonInput)}
                                disabled={loading || !actionReason.trim()}
                                className={`px-6 py-2 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm disabled:opacity-50 ${
                                    showReasonInput === 'REJECTED' 
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30' 
                                    : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                                }`}
                            >
                                {loading && <Loader2 className="animate-spin" size={16} />}
                                Confirmar {showReasonInput === 'REJECTED' ? 'Rechazo' : 'Observación'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="px-8 py-5 bg-white border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
                        <button
                            onClick={() => handleReview('REJECTED')}
                            disabled={loading}
                            className="px-6 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all disabled:opacity-50 text-sm"
                        >
                            Rechazar
                        </button>

                        <button
                            onClick={() => handleReview('OBSERVED')}
                            disabled={loading}
                            className="px-6 py-2 border border-amber-300 text-amber-600 hover:bg-amber-50 font-bold rounded-xl transition-all disabled:opacity-50 text-sm flex items-center gap-1.5"
                        >
                            <AlertTriangle size={16} />
                            Observar / Subsanar
                        </button>

                        <button
                            onClick={() => handleReview('APPROVED')}
                            disabled={loading}
                            className="px-8 py-2 bg-[#002a4e] hover:bg-blue-900 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-900/20 flex items-center gap-2 disabled:opacity-50 text-sm ml-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <span className="material-symbols-outlined text-[18px]">verified</span>}
                            Aprobar (Publicar)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
