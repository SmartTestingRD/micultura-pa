import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertTriangle, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkModalProps {
    isOpen: boolean;
    onClose: () => void;
    work: any | null;
    onResubmitted: () => void;
}

export const CitizenSubsanarModal: React.FC<WorkModalProps> = ({ isOpen, onClose, work, onResubmitted }) => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(false);

    if (!isOpen || !work) return null;

    const handleResubmit = async () => {
        try {
            setActionLoading(true);

            const payload = { entityId: work.id };

            const response = await fetch('/api/portal/works/resubmit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al subsanar el trámite');
            }

            onResubmitted();
            onClose();

        } catch (err: any) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex py-4 items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col m-4 animate-fade-in relative ring-1 ring-slate-200">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-600 bg-blue-100 p-2 rounded-lg">assignment</span>
                            <h2 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Expediente de tu Trámite</h2>
                        </div>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Revisa las observaciones del evaluador y decide si estás listo para reenviar.</p>
                    </div>
                </div>

                {/* Body - Scrollable content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">

                    {/* Observaciones destacadas */}
                    {work.metadata?.reviewer_notes && (
                        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={20} className="text-red-600" />
                                <h3 className="font-bold text-red-900">Observaciones del Evaluador</h3>
                            </div>
                            <p className="text-red-800 text-sm whitespace-pre-wrap pl-7">{work.metadata.reviewer_notes}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Columna Izquierda: Información de la Obra */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                    Métricas de la Declaración
                                </h3>
                                <dl className="space-y-4 text-sm">
                                    <div>
                                        <dt className="text-slate-500 font-medium">Título / Nombre</dt>
                                        <dd className="text-[#0f172a] font-bold text-base mt-0.5">{work.title}</dd>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <dt className="text-slate-500 font-medium">Categoría / Tipo</dt>
                                            <dd className="text-blue-700 font-medium bg-blue-50 px-3 py-1 rounded inline-block mt-0.5">
                                                {work.category || 'No especificada'}
                                            </dd>
                                        </div>
                                        <div className="flex-1">
                                            <dt className="text-slate-500 font-medium">Fecha de Inicio / Año</dt>
                                            <dd className="text-slate-800 font-semibold mt-0.5">{work.metadata?.yearStarted || 'No especificada'}</dd>
                                        </div>
                                    </div>

                                    <div>
                                        <dt className="text-slate-500 font-medium">Descripción Conceptual</dt>
                                        <dd className="text-slate-700 mt-1 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[100px]">
                                            {work.description || work.metadata?.description || 'No especificada'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            {(work.metadata?.techniques || work.metadata?.dimensions) && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                        Detalles Técnicos
                                    </h3>
                                    <dl className="grid grid-cols-2 gap-4 text-sm bg-slate-50 border border-slate-200 p-4 rounded-xl">
                                        <div>
                                            <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Técnicas / Materiales</dt>
                                            <dd className="text-slate-800 font-semibold mt-1 truncate" title={work.metadata.techniques}>
                                                {work.metadata.techniques || '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-slate-500 font-medium text-xs uppercase tracking-wider">Dimensiones</dt>
                                            <dd className="text-slate-800 font-semibold mt-1">
                                                {work.metadata.dimensions || '-'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha: Imágenes y Adicionales */}
                        <div className="space-y-8">
                            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 h-full">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                                    Evidencia Visual Subida
                                </h3>
                                {(work.image_urls?.length > 0 || work.metadata?.imageUrls?.length > 0 || work.metadata?.imageUrl) ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {(work.image_urls || work.metadata?.imageUrls || [work.metadata?.imageUrl]).map((url: string, idx: number) => (
                                            <a key={idx} href={url} target="_blank" rel="noreferrer" className="block relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-colors group">
                                                <img src={url} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
                                                    <span className="text-white opacity-0 group-hover:opacity-100 font-medium text-xs bg-black/50 px-2 py-1 rounded">Ver amplia</span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-white">
                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                        <p className="text-sm text-center">No aportaste imágenes o fotografías para este registro.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Actions */}
                <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between rounded-b-2xl">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            navigate(`/portal/registrar-obra/${work.id}`);
                        }}
                        className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm"
                        disabled={actionLoading}
                    >
                        Re-Editar Datos
                    </button>

                    <button
                        type="button"
                        onClick={handleResubmit}
                        disabled={actionLoading}
                        className="px-6 py-2.5 border border-green-600 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        {actionLoading && <Loader2 size={16} className="animate-spin" />}
                        Aplicar Subsanación (Corregido)
                    </button>
                </div>

            </div>
        </div>
    );
};
