import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Search, Filter, Eye, Heart, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarPortal } from '../components/portal/SidebarPortal';
import { HeaderPortal } from '../components/portal/HeaderPortal';

type StatusType = 'IN_CREATION' | 'UNDER_REVIEW' | 'OBSERVED' | 'APPROVED' | 'REJECTED' | 'PAUSED' | 'all';

export default function WorksList() {
    const { token, user } = useAuth();
    const [profileStatus, setProfileStatus] = useState<string | null>(null);

    const [works, setWorks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusType>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchProfileAndWorks = useCallback(async () => {
        if (!token || !user) return;
        try {
            const responseStatus = await fetch('/api/portal/profile-status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (responseStatus.ok) {
                const data = await responseStatus.json();
                setProfileStatus(data.status);
            }

            const responseWorks = await fetch('/api/portal/works/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (responseWorks.ok) {
                const worksData = await responseWorks.json();
                setWorks(worksData);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setIsLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchProfileAndWorks();
    }, [fetchProfileAndWorks]);

    const filteredWorks = works.filter(work => {
        const matchesSearch = work.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            work.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || work.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED': return <span className="badge badge-approved text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Aprobado</span>;
            case 'UNDER_REVIEW': return <span className="badge badge-review text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">En Revisión</span>;
            case 'OBSERVED': return <span className="badge badge-observed text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">Observado</span>;
            case 'REJECTED': return <span className="badge badge-observed text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">Rechazado</span>;
            default: return <span className="badge badge-draft text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">Borrador</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            <SidebarPortal isPublished={profileStatus === 'CONFIRMED'} />

            <div className="flex-1 flex flex-col min-w-0">
                <HeaderPortal />

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="works-container animate-fade-in">
                        <div className="flex-header mb-6 flex justify-between items-start flex-wrap gap-4">
                            <div>
                                <h1 className="page-title text-3xl font-bold text-slate-900">Mis Obras y Piezas</h1>
                                <p className="page-subtitle text-slate-500 mt-1">Gestiona tu catálogo, envía a revisión y consulta el estado.</p>
                            </div>
                            <div>
                                <Link to="/portal/registrar-obra" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#002857] rounded-full font-semibold text-white hover:bg-[#001d40] transition-colors shadow-sm">
                                    <PlusCircle size={20} className="mr-2" />
                                    Registrar Nueva Obra
                                </Link>
                            </div>
                        </div>

                        {/* OBRAS TOP */}
                        {works.length > 0 && (
                            <div className="mb-6">
                                <h2 className="top-section-title mb-6 flex items-center text-xl font-bold text-blue-900">
                                    <Heart size={20} className="text-red-500 mr-2" />
                                    Tops / Más Populares
                                </h2>
                                <div className="tops-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[...works].slice(0, 4).map((work, idx) => (
                                        <Link to={`/portal/obras/${work.id}`} key={`top-${work.id}`} className="top-card block bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden p-4 flex items-center">
                                            <div className="top-badge absolute top-0 right-0 bg-red-500 text-white w-8 h-8 flex items-center justify-center font-bold text-sm rounded-bl-lg">#{idx + 1}</div>
                                            <div
                                                className="top-image w-16 h-16 rounded-lg bg-slate-200 flex-shrink-0 mr-4"
                                                style={{ backgroundImage: `url(${work.image_urls?.[0] || `https://picsum.photos/seed/${work.id}/400/300`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                            ></div>
                                            <div className="top-info overflow-hidden">
                                                <h4 title={work.title} className="font-bold text-sm text-slate-800 truncate mb-1">{work.title}</h4>
                                                <p className="top-category text-xs text-slate-500 mb-2">{work.category}</p>
                                                <div className="top-metrics flex gap-3 text-xs text-slate-500 font-semibold">
                                                    <span className="top-metric flex items-center"><Eye size={12} className="mr-1" /> 0</span>
                                                    <span className="top-metric text-red-500 flex items-center"><Heart size={12} className="mr-1" /> 0</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CATÁLOGO COMPLETO */}
                        <h2 className="top-section-title mt-8 mb-4 text-xl font-bold text-blue-900">Catálogo Completo</h2>

                        <div className="filters-bar card mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
                            <div className="search-box relative flex-1 min-w-[250px]">
                                <Search size={18} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título o categoría..."
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="filter-controls flex items-center gap-6">
                                <div className="filter-group flex items-center">
                                    <Filter size={18} className="text-slate-400 mr-2" />
                                    <select
                                        className="py-2 pl-3 pr-8 border border-transparent bg-transparent font-medium text-slate-700 focus:ring-0 focus:outline-none cursor-pointer"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as StatusType)}
                                    >
                                        <option value="all">Todos los estados</option>
                                        <option value="APPROVED">Aprobados</option>
                                        <option value="UNDER_REVIEW">En Revisión</option>
                                        <option value="OBSERVED">Con Observaciones</option>
                                        <option value="IN_CREATION">Borradores</option>
                                    </select>
                                </div>

                                <div className="view-toggles flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        className={`p-2 rounded-md text-slate-500 transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List size={20} />
                                    </button>
                                    <button
                                        className={`p-2 rounded-md text-slate-500 transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <LayoutGrid size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="py-20 text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <span className="text-slate-500">Cargando obras...</span>
                            </div>
                        ) : filteredWorks.length === 0 ? (
                            <div className="empty-state card bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                    <Search size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">No se encontraron obras</h3>
                                <p className="text-slate-500 mb-6 max-w-md">Intenta con otros filtros de búsqueda o registra una nueva obra.</p>
                                <button
                                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={`works-${viewMode} ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}`}>
                                    {filteredWorks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(work => (
                                        <div key={work.id} className={`work-card bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                                            <Link to={`/portal/obras/${work.id}`} className={viewMode === 'list' ? 'w-48 shrink-0' : 'block'}>
                                                <div
                                                    className={`work-image-placeholder relative bg-slate-100 flex items-center justify-center group ${viewMode === 'list' ? 'h-full border-r border-slate-200' : 'h-48 border-b border-slate-200'}`}
                                                    style={{ backgroundImage: `url(${work.image_urls?.[0] || `https://picsum.photos/seed/${work.id}/400/300`})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                                >
                                                    <div className="qr-overlay absolute inset-0 bg-[#002857]/80 text-white flex items-center justify-center font-semibold opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-pointer">
                                                        Ver Detalles
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="work-content p-5 flex flex-col flex-1">
                                                <div className="work-header flex justify-between items-start mb-2">
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{work.category}</div>
                                                    <button className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-md transition-colors"><MoreVertical size={16} /></button>
                                                </div>

                                                <h3 className={`font-bold text-blue-900 leading-tight ${viewMode === 'list' ? 'text-xl mb-2' : 'text-lg mb-3'}`}>{work.title}</h3>

                                                <div className={`work-status-row flex items-center ${viewMode === 'list' ? 'mb-0' : 'mb-4'}`}>
                                                    {getStatusBadge(work.status)}
                                                </div>

                                                {viewMode === 'grid' && <div className="divider-sm h-px bg-slate-200 my-4 mt-auto"></div>}

                                                <div className="work-footer flex justify-between items-center mt-auto pt-4">
                                                    <div className="work-metrics flex gap-4">
                                                        <div className="metric flex items-center gap-1.5 text-sm font-medium text-slate-600" title="Visualizaciones">
                                                            <Eye size={14} className="text-slate-400" />
                                                            <span>0</span>
                                                        </div>
                                                        <div className="metric flex items-center gap-1.5 text-sm font-medium text-slate-600" title="Me Gusta">
                                                            <Heart size={14} className="text-slate-400" />
                                                            <span>0</span>
                                                        </div>
                                                    </div>

                                                    <Link to={`/portal/obras/${work.id}`} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200 transition-colors">Ver Detalle</Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* PAGINATION */}
                                {filteredWorks.length > itemsPerPage && (
                                    <div className="pagination-bar bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <p className="text-sm text-slate-500 m-0">
                                            Mostrando <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, filteredWorks.length)}</span> de <span className="font-bold text-slate-800">{filteredWorks.length}</span> obras
                                        </p>
                                        <div className="pagination-controls flex items-center gap-2">
                                            <button
                                                className="px-3 py-1.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(p => p - 1)}
                                            >
                                                Anterior
                                            </button>
                                            <div className="px-3 flex items-center">
                                                <span className="font-bold text-blue-600">{currentPage}</span>
                                                <span className="text-slate-400 mx-2">/</span>
                                                <span className="text-slate-500">{Math.ceil(filteredWorks.length / itemsPerPage)}</span>
                                            </div>
                                            <button
                                                className="px-3 py-1.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                disabled={currentPage === Math.ceil(filteredWorks.length / itemsPerPage)}
                                                onClick={() => setCurrentPage(p => p + 1)}
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
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
