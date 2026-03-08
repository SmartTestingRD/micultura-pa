import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function VerifyEntity() {
    const { id } = useParams<{ id: string }>();
    const [status, setStatus] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // We fetch specific data from a public endpoint, 
                // but since we haven't built a specific public endpoint yet, we'll simulate the load
                // or use a temporary GET if available. For now we will mock the visual.
                // In a real scenario we'd call: await fetch(`/api/public/entities/${id}`);

                // MOCKING DATA FOR VISUAL DEMO
                setTimeout(() => {
                    setTitle('Obra en Revisión');
                    setStatus('UNDER_REVIEW');
                    setLoading(false);
                }, 1500);

            } catch (err) {
                setError('No se pudo encontrar el registro.');
                setLoading(false);
            }
        };

        if (id) fetchStatus();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-slate-500 font-medium">Buscando información del registro...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h1 className="text-xl font-bold text-slate-800 mb-2">Registro no encontrado</h1>
                <p className="text-slate-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header Institucional Simple */}
            <header className="bg-white border-b border-slate-200 py-4 px-8 shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#0f172a] tracking-tight">Ministerio de Cultura</h1>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">República de Panamá</p>
                </div>
                <div className="text-sm border border-blue-100 bg-blue-50 text-blue-700 py-1.5 px-3 rounded-md font-medium">
                    Consulta Pública
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="bg-[#0f172a] p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        <h2 className="text-white text-2xl font-bold mb-2">Estado del Registro</h2>
                        <p className="text-slate-400 text-sm">ID: {id}</p>
                    </div>

                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <h3 className="text-lg text-slate-500 font-medium mb-1">Título de la Obra</h3>
                            <p className="text-2xl font-bold text-slate-800">{title}</p>
                        </div>

                        <div className="border border-amber-200 bg-amber-50 rounded-xl p-6 flex flex-col items-center text-center">
                            {status === 'UNDER_REVIEW' && (
                                <>
                                    <Clock size={48} className="text-amber-500 mb-4" />
                                    <h4 className="text-xl font-bold text-amber-900 mb-2">En Revisión</h4>
                                    <p className="text-amber-700 text-sm leading-relaxed max-w-sm">
                                        Esta obra o perfil se encuentra actualmente bajo evaluación por el equipo del Ministerio de Cultura.
                                        Aún no posee un certificado oficial emitido.
                                    </p>
                                </>
                            )}

                            {status === 'APPROVED' && (
                                <>
                                    <CheckCircle size={48} className="text-green-500 mb-4" />
                                    <h4 className="text-xl font-bold text-green-900 mb-2">Aprobado y Vigente</h4>
                                    <p className="text-green-700 text-sm leading-relaxed max-w-sm">
                                        Esta obra o perfil está formalmente registrado en el Directorio Nacional de Cultura.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                        <p className="text-xs text-slate-400">Este es un documento de consulta pública. Sistema Nacional de Cultura.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
