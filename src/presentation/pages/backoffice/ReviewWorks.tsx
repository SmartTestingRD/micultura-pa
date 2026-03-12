import React, { useState, useEffect } from 'react';
import { SidebarBackoffice } from '../../components/backoffice/SidebarBackoffice';
import { HeaderBackoffice } from '../../components/backoffice/HeaderBackoffice';
import { CheckCircle, AlertTriangle, Search, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ReviewWorkModal } from '../../components/backoffice/ReviewWorkModal';

interface Work {
  id: string;
  entity_type: string;
  title: string;
  status: string;
  citizen_name: string;
  citizen_email: string;
  created_at: string;
  metadata: any;
  description?: string;
  image_urls?: string[];
}

export const ReviewWorks: React.FC = () => {
  const { token } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/backoffice/works/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las obras');
      }

      const data = await response.json();
      setWorks(data.works || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);



  const filteredWorks = works.filter(w => 
    w.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.citizen_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50">
      <SidebarBackoffice />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBackoffice />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Evaluación de Obras</h1>
                <p className="text-slate-500 mt-1">Revisa y observa las solicitudes de trámites enviadas por los ciudadanos.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar obra o ciudadano..."
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg w-full md:w-80 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Obra</th>
                      <th className="px-6 py-4 font-medium">Categoría</th>
                      <th className="px-6 py-4 font-medium">Ciudadano</th>
                      <th className="px-6 py-4 font-medium">Fecha Emisión</th>
                      <th className="px-6 py-4 font-medium text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          Cargando solicitudes...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-red-500">
                          <AlertTriangle className="mx-auto mb-2" size={24} />
                          {error}
                        </td>
                      </tr>
                    ) : filteredWorks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-slate-400" />
                          </div>
                          <p className="font-medium text-slate-700">No hay obras pendientes de revisión</p>
                          <p className="text-sm mt-1">Todas las solicitudes han sido gestionadas.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredWorks.map((work) => (
                        <tr key={work.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900 border-l-4 border-l-transparent hover:border-l-blue-500">
                            {work.title}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              {work.entity_type === 'obra' ? (work.metadata?.category || 'Obra') : 'Entidad'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{work.citizen_name}</div>
                            <div className="text-xs text-slate-500">{work.citizen_email}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {new Date(work.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedWork(work)}
                                className="px-4 py-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 font-semibold border-transparent rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                              >
                                <Eye size={16} />
                                Evaluar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Comprehensive Modal details */}
      <ReviewWorkModal 
         isOpen={!!selectedWork} 
         onClose={() => setSelectedWork(null)} 
         work={selectedWork} 
         onReviewed={fetchWorks} 
      />

    </div>
  );
};
