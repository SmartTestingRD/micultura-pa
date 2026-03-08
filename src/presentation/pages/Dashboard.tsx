import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HeaderPortal } from '../components/portal/HeaderPortal';
import { SidebarPortal } from '../components/portal/SidebarPortal';
import { FileText, Image, CheckCircle, Clock, Eye, Heart, PlusCircle, UserCog, Share2, MessageCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, token } = useAuth();
    const [profileStatus, setProfileStatus] = useState<string | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            if (!token) return;
            try {
                const response = await fetch('/api/portal/profile-status', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileStatus(data.status);
                }
            } catch (error) {
                console.error("Error fetching profile status", error);
            } finally {
                setLoadingStatus(false);
            }
        };

        fetchStatus();
    }, [token]);

    const profile = {
        name: user?.full_name || 'Ciudadano',
        status: profileStatus
    };

    const worksStats = {
        total: 0,
        approved: 0,
        review: 0,
        draft: 0,
        observed: 0,
        totalViews: 1850,
        totalLikes: 420,
        totalComments: 145,
        totalShares: 89
    };

    const recentActivity = [
        {
            id: 1,
            type: 'system',
            title: 'Usuario registrado exitosamente',
            date: 'Hoy',
            icon: UserCog
        },
        {
            id: 2,
            type: 'review',
            title: 'Perfil enviado a revisión por el Funcionario',
            date: 'Hoy',
            icon: Clock
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            <SidebarPortal isPublished={profileStatus === 'CONFIRMED'} />

            <div className="flex-1 flex flex-col min-w-0">
                <HeaderPortal />

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 dashboard-container">
                    <div className="welcome-header">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Bienvenido, {profile.name.split(' ')[0]}</h1>
                            <p className="text-slate-500 mt-1">
                                Resumen de tu actividad en el Portal de Creadores de MiCultura.
                            </p>
                        </div>

                        <div className="profile-status card !border-[#e2e8f0] !shadow-sm">
                            <div className="status-content">
                                <span className="status-label tracking-widest text-[#718096]">ESTADO DE TU PERFIL</span>
                                {loadingStatus ? (
                                    <span className="badge badge-lg text-slate-400 bg-slate-100 flex items-center gap-2 px-4 py-2">
                                        <Clock size={18} className="animate-spin" /> Cargando...
                                    </span>
                                ) : profile.status === 'CONFIRMED' ? (
                                    <span className="badge badge-approved badge-lg flex items-center gap-2 px-4 py-2 bg-[#e6ffed] text-[#22c55e] border border-[#bbf7d0]">
                                        <CheckCircle size={18} /> Confirmado
                                    </span>
                                ) : profile.status === 'REJECTED' ? (
                                    <span className="badge badge-lg flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 border border-red-200">
                                        <AlertCircle size={18} /> Rechazado
                                    </span>
                                ) : profile.status === 'PENDING' ? (
                                    <span className="badge badge-lg flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 border border-yellow-200">
                                        <Clock size={18} /> Pendiente / En Revisión
                                    </span>
                                ) : profile.status === 'PAUSED' ? (
                                    <span className="badge badge-lg flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300">
                                        <AlertCircle size={18} /> En Pausa
                                    </span>
                                ) : (
                                    <span className="badge badge-lg flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200">
                                        <FileText size={18} /> No Registrado
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {profile.status === 'CONFIRMED' ? (
                        <>
                            {/* QUICK ACTIONS - BIG BUTTONS */}
                            <div className="quick-actions-grid mb-10 gap-6">
                                <Link to="/portal" className="action-card bg-[#1a365d] border border-[#1a365d]">
                                    <div className="action-icon-wrapper bg-white/10 border border-white/20">
                                        <PlusCircle size={32} />
                                    </div>
                                    <div className="action-text">
                                        <h3 className="font-bold text-xl mb-1 text-white">Registrar Nueva Obra</h3>
                                        <p className="text-blue-100 text-sm opacity-90">Sube fotos y detalles de tu nueva creación</p>
                                    </div>
                                </Link>

                                <Link to="/portal" className="action-card bg-[#c53030] border border-[#c53030]">
                                    <div className="action-icon-wrapper bg-white/10 border border-white/20">
                                        <UserCog size={32} />
                                    </div>
                                    <div className="action-text">
                                        <h3 className="font-bold text-xl mb-1 text-white">Actualizar Perfil</h3>
                                        <p className="text-red-100 text-sm opacity-90">Gestiona tu información y documentos</p>
                                    </div>
                                </Link>
                            </div>

                            {/* SUMMARY BEFORE METRICS */}
                            <h3 className="section-title">Resumen de Registro</h3>
                            <div className="stats-grid mb-10">
                                <div className="stat-card card">
                                    <div className="stat-icon bg-neutral">
                                        <Image size={24} />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value">{worksStats.total}</span>
                                        <span className="stat-label">Obras Registradas</span>
                                    </div>
                                </div>

                                <div className="stat-card card border-approved">
                                    <div className="stat-icon bg-approved">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value text-approved">{worksStats.approved}</span>
                                        <span className="stat-label">Obras Aprobadas</span>
                                    </div>
                                </div>

                                <div className="stat-card card border-review">
                                    <div className="stat-icon bg-review">
                                        <FileText size={24} />
                                    </div>
                                    <div className="stat-info">
                                        <span className="stat-value text-review">{worksStats.review}</span>
                                        <span className="stat-label">En Revisión</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="section-title">Impacto de tus Obras (Fichas Públicas)</h3>
                            <div className="metrics-grid mb-10">
                                <div className="metric-card card">
                                    <div className="metric-header">
                                        <Eye className="metric-icon blue" size={24} />
                                        <span className="metric-trend positive">+12% este mes</span>
                                    </div>
                                    <div className="metric-body">
                                        <span className="metric-value">{worksStats.totalViews.toLocaleString()}</span>
                                        <span className="metric-label">Visualizaciones</span>
                                    </div>
                                </div>

                                <div className="metric-card card">
                                    <div className="metric-header">
                                        <Heart className="metric-icon red" size={24} />
                                        <span className="metric-trend positive">+5% este mes</span>
                                    </div>
                                    <div className="metric-body">
                                        <span className="metric-value">{worksStats.totalLikes.toLocaleString()}</span>
                                        <span className="metric-label">Me Gusta</span>
                                    </div>
                                </div>

                                <div className="metric-card card">
                                    <div className="metric-header">
                                        <MessageCircle className="metric-icon purple" size={24} />
                                        <span className="metric-trend neutral">0% este mes</span>
                                    </div>
                                    <div className="metric-body">
                                        <span className="metric-value">{worksStats.totalComments.toLocaleString()}</span>
                                        <span className="metric-label">Comentarios en Fichas</span>
                                    </div>
                                </div>

                                <div className="metric-card card">
                                    <div className="metric-header">
                                        <Share2 className="metric-icon green" size={24} />
                                        <span className="metric-trend positive">+22% este mes</span>
                                    </div>
                                    <div className="metric-body">
                                        <span className="metric-value">{worksStats.totalShares.toLocaleString()}</span>
                                        <span className="metric-label">Veces Compartido</span>
                                    </div>
                                </div>
                            </div>

                            <h3 className="section-title">Actividad Reciente</h3>
                            <div className="activity-timeline card mb-10">
                                {recentActivity.map((activity) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={activity.id} className="timeline-item">
                                            <div className={`timeline-icon-wrap bg-${activity.type}`}>
                                                <Icon size={18} className={`text-${activity.type}`} />
                                            </div>
                                            <div className="timeline-content">
                                                <h4 className="timeline-title">{activity.title}</h4>
                                                <span className="timeline-date">{activity.date}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : !loadingStatus ? (
                        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-8 text-center max-w-2xl mx-auto shadow-sm">
                            <AlertCircle className="mx-auto text-slate-300 mb-4" size={56} />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Acceso Restringido</h3>
                            <p className="text-slate-500">
                                Tu perfil debe estar <strong className="text-slate-700">Confirmado</strong> para poder acceder a las funciones del portal, registrar obras o visualizar tus métricas. <br /><br />
                                Si acabas de registrarte o si enviaste una corrección, por favor espera a que un funcionario revise tu información.
                            </p>
                        </div>
                    ) : null}

                    <style>{`
                    .card {
                        background: white;
                        border-radius: 16px;
                        border: 1px solid #e2e8f0;
                        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
                    }
                    
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        border-radius: 9999px;
                        font-weight: 500;
                    }
                    
                    .dashboard-container {
                        animation: fadeIn 0.4s ease-out;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .welcome-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        flex-wrap: wrap;
                        gap: 1.5rem;
                        margin-bottom: 2.5rem;
                    }

                    .profile-status {
                        padding: 1.25rem 1.5rem;
                        min-width: 250px;
                    }

                    .status-content {
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .status-label {
                        font-size: 0.875rem;
                        color: #64748b;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }

                    .badge-lg {
                        padding: 0.5rem 1rem;
                        font-size: 1rem;
                        gap: 0.5rem;
                        width: fit-content;
                    }
                    
                    .badge-approved { background: #dcfce7; color: #166534; }
                    .badge-review { background: #fef3c7; color: #92400e; }

                    .section-title {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: #0f172a;
                        margin-bottom: 1.25rem;
                    }

                    .mb-10 {
                        margin-bottom: 2.5rem;
                    }

                    /* QUICK ACTIONS */
                    .quick-actions-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 1.5rem;
                    }

                    .action-card {
                        display: flex;
                        align-items: center;
                        gap: 1.5rem;
                        padding: 2rem;
                        border-radius: 16px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        color: white;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                        position: relative;
                        overflow: hidden;
                    }

                    .action-card::after {
                        content: '';
                        position: absolute;
                        top: 0; right: 0; bottom: 0; left: 0;
                        background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
                        opacity: 0;
                        transition: opacity 0.3s;
                    }

                    .action-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                    }

                    .action-card:hover::after {
                        opacity: 1;
                    }

                    .primary-action {
                        background: linear-gradient(135deg, #2563eb 0%, #60a5fa 100%);
                    }

                    .secondary-action {
                        background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
                    }

                    .action-icon-wrapper {
                        background: rgba(255, 255, 255, 0.2);
                        padding: 1rem;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        backdrop-filter: blur(4px);
                    }

                    .action-text h3 {
                        font-size: 1.35rem;
                        font-weight: 700;
                        margin-bottom: 0.4rem;
                    }

                    .action-text p {
                        font-size: 0.95rem;
                        opacity: 0.85;
                        line-height: 1.4;
                    }

                    /* STATS GRID */
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                        gap: 1.5rem;
                    }

                    .stat-card {
                        display: flex;
                        align-items: center;
                        gap: 1.25rem;
                        padding: 1.75rem 1.5rem;
                    }

                    .stat-icon {
                        width: 56px;
                        height: 56px;
                        border-radius: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .bg-neutral { background: rgba(100, 116, 139, 0.1); color: #64748b; }
                    .bg-approved { background: #dcfce7; color: #166534; }
                    .bg-review { background: #fef3c7; color: #92400e; }

                    .border-approved { border-bottom: 4px solid #166534; }
                    .border-review { border-bottom: 4px solid #92400e; }

                    .text-approved { color: #166534; }
                    .text-review { color: #92400e; }

                    .stat-info {
                        display: flex;
                        flex-direction: column;
                    }

                    .stat-value {
                        font-size: 2rem;
                        font-weight: 800;
                        line-height: 1.1;
                        margin-bottom: 0.25rem;
                        color: #0f172a;
                    }

                    .stat-label {
                        color: #64748b;
                        font-size: 0.9rem;
                        font-weight: 500;
                    }

                    /* METRICS GRID NEW */
                    .metrics-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 1.25rem;
                    }

                    .metric-card {
                        padding: 1.5rem;
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .metric-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .metric-icon {
                        padding: 0.5rem;
                        border-radius: 8px;
                        width: 38px;
                        height: 38px;
                    }

                    .metric-icon.blue { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
                    .metric-icon.red { background: rgba(225, 29, 72, 0.1); color: #e11d48; }
                    .metric-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
                    .metric-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }

                    .metric-trend {
                        font-size: 0.75rem;
                        font-weight: 600;
                        padding: 0.2rem 0.5rem;
                        border-radius: 4px;
                    }

                    .metric-trend.positive { background: #dcfce7; color: #166534; }
                    .metric-trend.negative { background: #fee2e2; color: #991b1b; }
                    .metric-trend.neutral { background: #f1f5f9; color: #475569; }

                    .metric-body {
                        display: flex;
                        flex-direction: column;
                    }

                    .metric-value {
                        font-size: 1.75rem;
                        font-weight: 800;
                        color: #0f172a;
                    }

                    .metric-label {
                        font-size: 0.85rem;
                        color: #64748b;
                        font-weight: 500;
                    }

                    /* TIMELINE */
                    .activity-timeline {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        padding: 2rem;
                    }

                    .timeline-item {
                        display: flex;
                        gap: 1.25rem;
                        position: relative;
                    }

                    .timeline-item:not(:last-child)::after {
                        content: '';
                        position: absolute;
                        left: 19px;
                        top: 40px;
                        bottom: -1.5rem;
                        width: 2px;
                        background: #e2e8f0;
                    }

                    .timeline-icon-wrap {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        z-index: 1;
                        background: white;
                        box-shadow: 0 0 0 4px white;
                    }

                    .timeline-icon-wrap.bg-approved { background: #dcfce7; }
                    .timeline-icon-wrap.bg-observed { background: #fee2e2; }
                    .timeline-icon-wrap.bg-review { background: #fef3c7; }
                    .timeline-icon-wrap.bg-system { background: rgba(37, 99, 235, 0.1); }

                    .timeline-icon-wrap .text-approved { color: #166534; }
                    .timeline-icon-wrap .text-observed { color: #991b1b; }
                    .timeline-icon-wrap .text-review { color: #92400e; }
                    .timeline-icon-wrap .text-system { color: #2563eb; }

                    .timeline-content {
                        display: flex;
                        flex-direction: column;
                        padding-top: 0.25rem;
                    }

                    .timeline-title {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #0f172a;
                        margin-bottom: 0.25rem;
                    }

                    .timeline-date {
                        font-size: 0.85rem;
                        color: #64748b;
                    }
                `}</style>
                </main>
            </div>
        </div>
    );
}
