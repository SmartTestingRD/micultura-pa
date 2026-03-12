import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Edit2, Share2, Eye, Heart, Calendar, Menu, Image as ImageIcon, QrCode } from 'lucide-react';
import { SidebarPortal } from '../components/portal/SidebarPortal';
import { HeaderPortal } from '../components/portal/HeaderPortal';

export default function WorkDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const [work, setWork] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileStatus, setProfileStatus] = useState<string | null>(null);

    const fetchWorkDetail = useCallback(async () => {
        if (!token || !id) return;
        try {
            // Fetch profile status for Sidebar
            const responseStatus = await fetch('/api/portal/profile-status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (responseStatus.ok) {
                const statusData = await responseStatus.json();
                setProfileStatus(statusData.status);
            }

            // Fetch work detail
            const res = await fetch(`/api/portal/works/get?id=${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const data = await res.json();
                setWork(data);
            } else {
                setError('No se pudo cargar la información de la obra.');
            }
        } catch (err) {
            console.error('Error fetching work data:', err);
            setError('Ocurrió un error de conexión.');
        } finally {
            setIsLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchWorkDetail();
    }, [fetchWorkDetail]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex font-sans">
                <SidebarPortal isPublished={profileStatus === 'CONFIRMED'} />
                <div className="flex-1 flex flex-col min-w-0">
                    <HeaderPortal />
                    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <span className="text-slate-500">Cargando detalles de la obra...</span>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !work) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex font-sans">
                <SidebarPortal isPublished={profileStatus === 'CONFIRMED'} />
                <div className="flex-1 flex flex-col min-w-0">
                    <HeaderPortal />
                    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 text-center p-12 max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold mb-2 text-slate-800">Obra no encontrada</h2>
                            <p className="text-slate-500 mb-6">{error || 'El registro que buscas no existe o no tienes acceso a él.'}</p>
                            <button className="px-6 py-2.5 bg-[#002857] text-white font-semibold rounded-full hover:bg-[#001d40] transition-colors" onClick={() => navigate('/portal/obras')}>
                                Volver a Mis Obras
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    const { metadata = {} } = work;

    const getStatusBadge = () => {
        switch (work.status) {
            case 'APPROVED': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">Aprobado</span>;
            case 'UNDER_REVIEW': return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">En Revisión</span>;
            case 'OBSERVED': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">Observado</span>;
            case 'REJECTED': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">Rechazado</span>;
            default: return <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-bold">Borrador</span>;
        }
    };
    
    const mainImage = work.imageUrls && work.imageUrls.length > 0 ? work.imageUrls[0] : metadata.imageUrl || `https://picsum.photos/seed/${work.id}/800/600`;
    const gallery = work.imageUrls && work.imageUrls.length > 1 ? work.imageUrls.slice(1) : [];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            <SidebarPortal isPublished={profileStatus === 'CONFIRMED'} />
            <div className="flex-1 flex flex-col min-w-0">
                <HeaderPortal />
                
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="animate-fade-in pb-10">
                        {/* HEADER NAV */}
                        <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                            <Link to="/portal/obras" className="text-slate-500 hover:text-blue-600 flex items-center font-medium transition-colors">
                                <ArrowLeft size={18} className="mr-2" />
                                Volver al Catálogo
                            </Link>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium flex items-center hover:bg-slate-50 transition-colors shadow-sm">
                                    <Share2 size={16} className="mr-2" />
                                    Compartir
                                </button>
                                <button className="px-4 py-2 bg-[#002857] rounded-lg text-white font-medium flex items-center hover:bg-[#001d40] transition-colors shadow-sm" onClick={() => navigate(`/portal/registrar-obra/${work.id}`)}>
                                    <Edit2 size={16} className="mr-2" />
                                    Editar Obra
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* LEFT COLUMN: Main Image and Gallery */}
                            <div className="media-column flex flex-col gap-4">
                                <div
                                    className="w-full aspect-[4/3] rounded-2xl bg-slate-200 relative shadow-md overflow-hidden"
                                    style={{ backgroundImage: `url(${mainImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                >
                                    {work.status === 'APPROVED' && (
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center shadow-sm text-sm font-bold text-blue-900 border border-white/40">
                                            Ficha Pública Activa
                                        </div>
                                    )}
                                </div>

                                {gallery.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 md:gap-4 mt-2">
                                        {gallery.slice(0, 3).map((imgUrl: string, index: number) => (
                                            <div
                                                key={index}
                                                className="aspect-square rounded-xl bg-slate-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-transparent hover:border-blue-500"
                                                style={{ backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                            ></div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Information */}
                            <div className="info-column">
                                <div className="rounded-2xl shadow-sm bg-white p-6 sm:p-8 mb-6 border border-slate-200">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                        <div className="flex-1">
                                            <span className="text-slate-500 font-bold text-xs tracking-wider uppercase mb-2 block">
                                                {work.category} {metadata.subcategory ? `> ${metadata.subcategory}` : ''}
                                            </span>
                                            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-950 leading-tight">
                                                {work.title}
                                            </h1>
                                        </div>
                                        <div className="shrink-0">
                                            {getStatusBadge()}
                                        </div>
                                    </div>

                                    {/* Quick Metrics */}
                                    <div className="flex gap-6 pb-6 border-b border-slate-100">
                                        <div className="flex items-center text-slate-500">
                                            <Eye size={18} className="mr-2" />
                                            <span className="font-semibold text-slate-800">0</span>
                                            <span className="ml-1 text-sm">vistas</span>
                                        </div>
                                        <div className="flex items-center text-slate-500">
                                            <Heart size={18} className="mr-2 text-red-500" />
                                            <span className="font-semibold text-slate-800">0</span>
                                            <span className="ml-1 text-sm">me gusta</span>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="mt-8 space-y-8">
                                        <div>
                                            <h4 className="flex items-center font-bold text-slate-800 mb-3 text-lg">
                                                <Menu size={18} className="mr-2 text-blue-600" /> Descripción Técnica y Conceptual
                                            </h4>
                                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                                {work.description || metadata.description || 'Sin descripción provista.'}
                                            </div>
                                        </div>

                                        {(metadata.techniques || metadata.dimensions || metadata.yearStarted || metadata.seriesCount) && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                                {metadata.techniques && (
                                                    <div>
                                                        <h4 className="text-xs uppercase text-slate-500 mb-1 font-bold">Materiales / Técnica</h4>
                                                        <p className="font-medium text-slate-800">
                                                            {metadata.techniques}
                                                        </p>
                                                    </div>
                                                )}
                                                {metadata.dimensions && (
                                                    <div>
                                                        <h4 className="text-xs uppercase text-slate-500 mb-1 font-bold">Dimensiones</h4>
                                                        <p className="font-medium text-slate-800">
                                                            {metadata.dimensions}
                                                        </p>
                                                    </div>
                                                )}
                                                {metadata.yearStarted && (
                                                    <div>
                                                        <h4 className="text-xs uppercase text-slate-500 mb-1 font-bold flex items-center">
                                                            <Calendar size={14} className="mr-1" /> Año de Creación
                                                        </h4>
                                                        <p className="font-medium text-slate-800">
                                                            {metadata.yearStarted}
                                                        </p>
                                                    </div>
                                                )}
                                                {metadata.seriesCount && (
                                                    <div>
                                                        <h4 className="text-xs uppercase text-slate-500 mb-1 font-bold flex items-center">
                                                            <ImageIcon size={14} className="mr-1" /> Tiraje / Ejemplares
                                                        </h4>
                                                        <p className="font-medium text-slate-800">
                                                            {Number(metadata.seriesCount) > 1 ? `Serie Limitada (${metadata.seriesCount} uds)` : 'Pieza Única'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Ubicación y Contácto */}
                                        {(metadata.address || metadata.email || metadata.phone || metadata.website) && (
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-3 text-lg border-b border-slate-100 pb-2">Contacto y Ubicación</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                    {metadata.address && (
                                                        <div>
                                                            <span className="block text-slate-500 font-medium mb-1">Dirección:</span>
                                                            <span className="text-slate-800">{metadata.address}</span>
                                                        </div>
                                                    )}
                                                    {metadata.email && (
                                                        <div>
                                                            <span className="block text-slate-500 font-medium mb-1">Email:</span>
                                                            <a href={`mailto:${metadata.email}`} className="text-blue-600 hover:underline">{metadata.email}</a>
                                                        </div>
                                                    )}
                                                    {metadata.phone && (
                                                        <div>
                                                            <span className="block text-slate-500 font-medium mb-1">Teléfono:</span>
                                                            <span className="text-slate-800">{metadata.phone}</span>
                                                        </div>
                                                    )}
                                                    {metadata.website && (
                                                        <div>
                                                            <span className="block text-slate-500 font-medium mb-1">Sitio Web:</span>
                                                            <a href={metadata.website.startsWith('http') ? metadata.website : `https://${metadata.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{metadata.website}</a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Redes Sociales */}
                                        {metadata.socials && Object.values(metadata.socials).some(val => val) && (
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-3 text-lg border-b border-slate-100 pb-2">Redes Sociales</h4>
                                                <div className="flex flex-wrap gap-4">
                                                    {metadata.socials.instagram && (
                                                        <a href={`https://instagram.com/${metadata.socials.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                            Inst: {metadata.socials.instagram}
                                                        </a>
                                                    )}
                                                    {metadata.socials.facebook && (
                                                        <a href={metadata.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                            Facebook
                                                        </a>
                                                    )}
                                                    {metadata.socials.x && (
                                                        <a href={`https://x.com/${metadata.socials.x.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                            X (Twitter): {metadata.socials.x}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Miembros / Integrantes */}
                                        {metadata.members && metadata.members.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-3 text-lg border-b border-slate-100 pb-2">Integrantes</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {metadata.members.map((member: any, idx: number) => (
                                                        <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                            <span className="block font-bold text-slate-800">{member.name}</span>
                                                            <span className="block text-sm text-slate-500">Rol: {member.role}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Roles / Servicios */}
                                        {(metadata.artisticRoles?.length > 0 || metadata.services?.length > 0) && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                {metadata.artisticRoles?.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">Roles Desempeñados</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {metadata.artisticRoles.map((role: string, idx: number) => (
                                                                <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">{role}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {metadata.services?.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">Servicios Ofrecidos</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {metadata.services.map((service: string, idx: number) => (
                                                                <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-medium border border-emerald-100">{service}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Link de Video */}
                                        {metadata.videoUrl && (
                                             <div>
                                                 <h4 className="font-bold text-slate-800 mb-2 text-lg border-b border-slate-100 pb-2">Video Relacionado</h4>
                                                 <a href={metadata.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm flex items-center">
                                                     <Eye size={16} className="mr-2"/>
                                                     {metadata.videoUrl}
                                                 </a>
                                             </div>
                                        )}
                                        
                                        {/* Metadata Completa (Limpia) */}
                                        {Object.keys(metadata).length > 0 && (
                                            <div className="mt-8 pt-6 border-t border-slate-200">
                                                <details className="group">
                                                    <summary className="flex items-center cursor-pointer font-bold text-slate-800 hover:text-blue-600 transition-colors text-lg mb-2">
                                                        <span className="mr-2">Información Adicional (Metadata Técnica)</span>
                                                        <div className="bg-slate-100 p-1.5 rounded-full group-open:rotate-180 transition-transform">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                                        </div>
                                                    </summary>
                                                    
                                                    <div className="mt-4 bg-slate-50 p-6 rounded-xl flex flex-col gap-4">
                                                        {Object.entries(metadata).map(([key, value], idx) => {
                                                            const translateKey = (k: string) => {
                                                                const dict: Record<string, string> = {
                                                                    members: 'Integrantes', sectors: 'Sectores', socials: 'Redes Sociales',
                                                                    website: 'Sitio Web', category: 'Categoría', coverage: 'Cobertura',
                                                                    services: 'Servicios', videoUrl: 'Enlace del Video', seriesCount: 'Cantidad de Ejemplares',
                                                                    subcategory: 'Subcategoría', yearStarted: 'Año de Creación', locationType: 'Tipo de Ubicación',
                                                                    artisticRoles: 'Roles Artísticos', techniques: 'Técnicas', dimensions: 'Dimensiones',
                                                                    address: 'Dirección', email: 'Correo Electrónico', phone: 'Teléfono', description: 'Descripción',
                                                                    imageUrl: 'URL de Imagen Principal', name: 'Nombre', role: 'Rol', instagram: 'Instagram', facebook: 'Facebook', x: 'X (Twitter)'
                                                                };
                                                                return dict[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                                                            };

                                                            const formatValue = (val: any): string => {
                                                                if (val === null || val === undefined || val === '') return '';
                                                                if (typeof val === 'boolean') return val ? 'Sí' : 'No';
                                                                if (Array.isArray(val)) {
                                                                    const items = val.map(formatValue).filter(Boolean);
                                                                    return items.length > 0 ? items.join(', ') : '';
                                                                }
                                                                if (typeof val === 'object') {
                                                                    const items = Object.entries(val).map(([k, v]) => {
                                                                        const formattedV = formatValue(v);
                                                                        return formattedV ? `${translateKey(k)}: ${formattedV}` : '';
                                                                    }).filter(Boolean);
                                                                    return items.length > 0 ? items.join(' — ') : '';
                                                                }
                                                                return String(val);
                                                            };

                                                            const displayValue = formatValue(value);
                                                            if (!displayValue) return null;
                                                            
                                                            const readableKey = translateKey(key);
                                                            
                                                            return (
                                                                <div key={idx} className="flex flex-col border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                                                                    <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">{readableKey}</span>
                                                                    <span className="text-slate-800 text-sm leading-relaxed">{displayValue}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </details>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* QR Code Section (If Approved) */}
                                {work.status === 'APPROVED' && (
                                    <div className="rounded-2xl shadow-sm bg-blue-50 border border-blue-200 p-6 flex items-start gap-4">
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 shrink-0">
                                            <QrCode size={40} className="text-blue-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-blue-950 mb-1">Código QR y Ficha Pública</h3>
                                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                                Esta obra está certificada. El código QR dirije a la ficha de verificación oficial del Ministerio de Cultura.
                                            </p>
                                            <div className="flex flex-wrap gap-3 items-center">
                                                <span className="bg-white border border-blue-200 text-blue-800 font-mono text-sm px-3 py-1.5 rounded-md font-bold shadow-sm inline-flex items-center">
                                                    Micultura-{work.id.slice(0, 8)}
                                                </span>
                                                <button className="text-sm text-blue-700 font-bold hover:underline">
                                                    Ver portal de galería
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
