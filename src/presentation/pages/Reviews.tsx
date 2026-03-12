import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle, Clock, ChevronRight, Search, Filter, Edit3, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HeaderPortal } from '../components/portal/HeaderPortal';
import { SidebarPortal } from '../components/portal/SidebarPortal';

export default function Reviews() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [works, setWorks] = useState<any[]>([]); // Obras reales de DB
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'all' | 'OBSERVED' | 'UNDER_REVIEW' | 'IN_CREATION'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  useEffect(() => {
    const fetchProfileAndWorks = async () => {
        if (!token || !user) return;
        try {
            // Check Profile status for layout consistency
            const responseStatus = await fetch('/api/portal/profile-status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (responseStatus.ok) {
                const data = await responseStatus.json();
                setProfileStatus(data.status);
            }

            // Simulamos obtener la lista de obras del usuario (hasta tener un endpoint list real)
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
    };
    fetchProfileAndWorks();
  }, [token, user]);

  // Ya no filtramos previamente por estado, queremos disponer de todas
  const uniqueCategories = ['Todas', ...Array.from(new Set(works.map(w => w.category)))];

  const filteredWorks = works.filter(w => {
    // Si activeTab es all, las muestra todas sin excepción. Si no, filtra por el estado exacto (OBSERVED, UNDER_REVIEW)
    const matchesTab = activeTab === 'all' ? true : w.status === activeTab;
    const matchesSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' ? true : w.category === categoryFilter;

    return matchesTab && matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <SidebarPortal isPublished={profileStatus === 'CONFIRMED'} />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderPortal />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="reviews-container animate-fade-in">
            <div className="flex-header mb-8">
              <div>
                <h1 className="page-title text-3xl font-bold text-slate-900">En Revisión / Observaciones</h1>
                <p className="page-subtitle text-slate-500 mt-1">Revisa el estado de la verificación de tus obras y responde a las observaciones del equipo de Cultura.</p>
              </div>
            </div>

            <div className="summary-cards mb-8">
              <div className="card summary-card border-l-review border-l-4">
                <div className="summary-icon bg-review">
                  <Clock size={24} className="text-review" />
                </div>
                <div className="summary-info">
                  <span className="summary-value">{works.filter(w => w.status === 'UNDER_REVIEW').length}</span>
                  <span className="summary-label">En Revisión Actual</span>
                </div>
              </div>

              <div className="card summary-card border-l-observed border-l-4">
                <div className="summary-icon bg-observed">
                  <AlertCircle size={24} className="text-observed" />
                </div>
                <div className="summary-info">
                  <span className="summary-value">{works.filter(w => w.status === 'OBSERVED').length}</span>
                  <span className="summary-label">Requieren Atención</span>
                </div>
              </div>
            </div>

            <div className="card list-section bg-white rounded-2xl shadow-sm border border-slate-200">
              <div className="tabs-header border-b border-slate-200 flex px-4">
                <button
                  className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  Todos los Trámites
                </button>
                <button
                  className={`tab-btn ${activeTab === 'OBSERVED' ? 'active' : ''}`}
                  onClick={() => setActiveTab('OBSERVED')}
                >
                  Requieren Atención
                  {works.filter(w => w.status === 'OBSERVED').length > 0 && (
                    <span className="tab-badge">{works.filter(w => w.status === 'OBSERVED').length}</span>
                  )}
                </button>
                <button
                  className={`tab-btn ${activeTab === 'UNDER_REVIEW' ? 'active' : ''}`}
                  onClick={() => setActiveTab('UNDER_REVIEW')}
                >
                  En Revisión (Vigentes)
                </button>
                <button
                  className={`tab-btn ${activeTab === 'IN_CREATION' ? 'active' : ''}`}
                  onClick={() => setActiveTab('IN_CREATION')}
                >
                  Borrador / En Creación
                </button>
              </div>

              <div className="filter-bar border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50">
                <div className="search-box relative flex-1 max-w-sm w-full">
                  <Search size={18} className="search-icon absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por Título..."
                    className="filter-input w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-actions flex items-center gap-2 w-full sm:w-auto">
                  <Filter size={18} className="text-slate-400" />
                  <select
                    className="filter-select py-2 pl-3 pr-8 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-auto"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="list-body">
                {isLoading ? (
                    <div className="py-20 text-center">
                        <Clock className="animate-spin mx-auto text-slate-400 mb-4" size={32} />
                        <span className="text-slate-500">Cargando trámites...</span>
                    </div>
                ) : filteredWorks.length === 0 ? (
                  <div className="empty-state text-center py-16">
                    <MessageSquare size={48} className="text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No tienes trámites pendientes</h3>
                    <p className="text-slate-500 max-w-md mx-auto">No hay obras en proceso de revisión ni con observaciones en este momento.</p>
                  </div>
                ) : (
                  <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="operative-table w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trámite / Objeto</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha Ingreso</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Etapa Actual</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Área Responsable</th>
                          <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {filteredWorks.map((work) => (
                          <tr key={work.id} className={`hover:bg-slate-50 transition-colors ${work.status === 'OBSERVED' ? 'bg-red-50/30' : ''}`}>
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900">{work.title}</span>
                                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">{work.category}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm text-slate-600">{work.date}</span>
                            </td>
                            <td className="py-4 px-6">
                              {work.status === 'OBSERVED' && (
                                <div className="status-badge error inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle size={14} className="mr-1.5" />
                                  Requiere Subsanación
                                </div>
                              )}
                              {work.status === 'UNDER_REVIEW' && (
                                <div className="status-badge warning inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  <Clock size={14} className="mr-1.5" />
                                  En Evaluación Técnica
                                </div>
                              )}
                              {work.status === 'IN_CREATION' && (
                                <div className="status-badge draft inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  <Edit3 size={14} className="mr-1.5" />
                                  Borrador / En Creación
                                </div>
                              )}
                              {(work.status === 'APPROVED' || work.status === 'PUBLISHED') && (
                                <div className="status-badge success inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle size={14} className="mr-1.5" />
                                  Aprobado / Vigente
                                </div>
                              )}
                              {work.status === 'REJECTED' && (
                                <div className="status-badge error inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <XCircle size={14} className="mr-1.5" />
                                  Rechazado
                                </div>
                              )}
                              {(!['OBSERVED', 'UNDER_REVIEW', 'IN_CREATION', 'APPROVED', 'PUBLISHED', 'REJECTED'].includes(work.status)) && (
                                <div className="status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  {work.status}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 text-sm text-slate-600">
                              {work.status === 'OBSERVED' 
                                ? 'Usuario (Ciudadano)' 
                                : (work.responsible_area || 'Por Asignar')
                              }
                            </td>
                            <td className="py-4 px-6 text-center">
                              {work.status === 'IN_CREATION' ? (
                                <button
                                  className="mx-auto w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Continuar Registro"
                                  onClick={() => navigate(`/portal/registrar-obra/${work.id}`)}
                                >
                                  <ChevronRight size={16} />
                                </button>
                              ) : work.status === 'OBSERVED' ? (
                                <button
                                  className="mx-auto bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm font-medium transition-colors"
                                  onClick={() => navigate(`/portal/obras/${work.id}`)}
                                >
                                  Subsanar
                                </button>
                              ) : work.status === 'UNDER_REVIEW' ? (
                                <button
                                  className="mx-auto w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 bg-slate-50 cursor-not-allowed"
                                  title="En Evaluación"
                                  disabled
                                >
                                  <ChevronRight size={16} />
                                </button>
                              ) : (
                                <button
                                  className="mx-auto w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors"
                                  title="Ver Detalles"
                                  onClick={() => navigate(`/portal/obras/${work.id}`)}
                                >
                                  <ChevronRight size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <style>{`
              .animate-fade-in { animation: fadeIn 0.4s ease-out; }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }

              /* Summary Cards */
              .summary-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
              }

              .summary-card {
                background: white;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 1.25rem;
                padding: 1.5rem;
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
              }

              .border-l-review { border-left-color: #d97706; }
              .border-l-observed { border-left-color: #e11d48; }

              .summary-icon {
                width: 54px;
                height: 54px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .bg-review { background-color: #fef3c7; }
              .text-review { color: #d97706; }
              
              .bg-observed { background-color: #ffe4e6; }
              .text-observed { color: #e11d48; }

              .summary-info {
                display: flex;
                flex-direction: column;
              }

              .summary-value {
                font-size: 2rem;
                font-weight: 800;
                line-height: 1.1;
                color: #0f172a;
              }

              .summary-label {
                font-size: 0.9rem;
                margin-top: 0.25rem;
                font-weight: 500;
                color: #64748b;
              }

              /* Tabs */
              .tab-btn {
                padding: 1rem 1.5rem;
                font-weight: 500;
                color: #64748b;
                border-bottom: 2px solid transparent;
                position: relative;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: color 0.2s, border-color 0.2s;
              }

              .tab-btn:hover {
                color: #2563eb;
              }

              .tab-btn.active {
                color: #2563eb;
                border-bottom-color: #2563eb;
                font-weight: 600;
              }

              .tab-badge {
                background: #e11d48;
                color: white;
                font-size: 0.7rem;
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: 700;
              }
            `}</style>
          </div>
        </main>
      </div>
    </div>
  );
}
