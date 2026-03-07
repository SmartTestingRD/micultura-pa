import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { RegistrationModal } from '../components/RegistrationModal';

export default function About() {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Ensure the animation only runs once per element
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
            observer.disconnect();
        };
    }, []);

    return (
        <React.Fragment>


            <header
                className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface-light/80 dark:bg-background-dark/80 border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        <Link to="/"
                            className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                            <img src="logo_micultura.png" alt="Sicultura Panamá Logo" className="h-12 w-auto" />
                        </Link>

                        <nav className="hidden md:flex space-x-8">
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                                to="/directorio">Directorio</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                                to="/mapa">Mapa</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                                to="/estadisticas">Estadísticas</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                                to="/novedades">Novedades</Link>
                            <Link className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                                to="/documentos">Documentos</Link>
                        </nav>


                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button id="btn-login"
                                className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-primary text-sm font-medium">Login</button>
                            <button id="btn-register"
                                onClick={() => setIsRegisterOpen(true)}
                                className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary/25">
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </header>



            <div className="bg-[#0f2854] md:h-96 relative z-20 flex border-b-4 border-[#081838]">

                <div className="absolute inset-0 overflow-hidden isolate">
                    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay object-cover"
                        style={{ "backgroundImage": "url('https", "backgroundSize": "cover", "backgroundPosition": "center" }}>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f2854] via-[#0f2854]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f2854] via-transparent to-[#0f2854]/50"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex items-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full pt-20 pb-16 md:py-0 h-full">

                        <div className="flex-1 self-center relative z-20 animate-on-scroll">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/20 backdrop-blur-sm shadow-lg">
                                <span className="material-symbols-outlined text-[14px]">info</span>
                                Conócenos
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                                Sobre Sicultura<span className="text-secondary">.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl leading-relaxed font-medium">
                                El portal web de acceso público que conecta, visibiliza y promueve la riqueza cultural y creativa de Panamá.
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <section className="py-20 bg-white dark:bg-background-dark relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 animate-on-scroll">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                Nuestra Misión y Visión
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                El Sistema de Información Cultural de Panamá (Sicultura) es un proyecto estratégico del <strong>Ministerio de Cultura</strong>. Nuestro objetivo fundamental es favorecer un mejor y más profundo conocimiento de la realidad cultural del país.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                A través de nuestro directorio, mapa interactivo de recursos culturales, y repositorios exhaustivos de estadísticas y documentos, conectamos a los creadores con la ciudadanía, garantizando el acceso a la cultura para todos.
                            </p>
                        </div>
                        <div className="flex-1 relative animate-on-scroll delay-200">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video lg:aspect-square max-h-[500px]">
                                <img src="https://picsum.photos/seed/cultura2/800/800" alt="Cultura de Panamá" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                            </div>

                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-xl -z-10 rotate-12 opacity-50 blur-lg"></div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500 rounded-full -z-10 opacity-30 blur-xl"></div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-20 bg-slate-50 dark:bg-surface-dark border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Nuestros Objetivos Principales</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Trabajamos día a día para fortalecer el ecosistema creativo y cultural mediante la información y la participación.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll group">
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">share</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Recopilar y Difundir</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Organizar y difundir información confiable, oportuna y relevante sobre temas vinculados con la cultura y el ecosistema creativo.</p>
                        </div>

                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll delay-100 group">
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">visibility</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Dar Visibilidad</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Promocionar y dar máxima visibilidad a los recursos culturales disponibles a lo largo de todo el territorio nacional.</p>
                        </div>

                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll delay-200 group">
                            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">diversity_3</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Acceso Ciudadano</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Contribuir a hacer efectivo el derecho inalienable de la ciudadanía a conocer, disfrutar y tener pleno acceso a la cultura.</p>
                        </div>

                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll group">
                            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">account_balance</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Transparencia Institucional</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Favorecer la transparencia, el acceso a la información y la rendición de cuentas sobre el trabajo que lleva a cabo el Ministerio de Cultura.</p>
                        </div>

                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll delay-100 group">
                            <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">query_stats</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Generar Conocimiento</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Producir datos e investigaciones sobre los agentes, fenómenos culturales y el impacto económico de las políticas públicas.</p>
                        </div>

                        <div className="bg-white dark:bg-background-dark p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1 animate-on-scroll delay-200 group">
                            <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">how_to_vote</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Participación Digital</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Habilitar la participación activa de los agentes culturales en estudios, encuestas y consultas públicas a nivel nacional.</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-24 bg-white dark:bg-background-dark overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-on-scroll">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Explora la Plataforma</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">La Estructura de nuestro Portal</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Toda la información cultural está organizada sistemáticamente en 5 módulos interactivos e integrados.</p>
                    </div>


                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 animate-on-scroll">
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined">contact_page</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Directorio y Mapa Cultural</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                                Es el corazón de Sicultura. Actúa como un repositorio y buscador avanzado de fichas informativas sobre todos los recursos culturales de Panamá.
                            </p>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400 mb-8">
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">done</span> Fichas de manifestaciones culturales por región</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">done</span> Programas oficiales y eventos periódicos</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">done</span> Perfiles de espacios y agentes del sector</li>
                                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">done</span> Geolocalización interactiva de recursos en el Mapa</li>
                            </ul>
                            <Link to="/directorio" className="inline-flex items-center gap-2 text-primary font-bold hover:text-blue-800 transition-colors">
                                Explorar Directorio <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 w-full lg:w-auto relative">
                            <div className="bg-slate-100 dark:bg-surface-dark rounded-3xl p-4 lg:p-8 relative z-10">
                                <img src="https://picsum.photos/seed/mod1/600/400" alt="Directorio Cultural interface preview" className="w-full h-auto rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full max-w-sm bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>


                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 animate-on-scroll">
                        <div className="flex-1 w-full lg:w-auto relative">
                            <div className="bg-slate-100 dark:bg-surface-dark rounded-3xl p-4 lg:p-8 relative z-10">
                                <img src="https://picsum.photos/seed/mod2/600/400" alt="Estadisticas interface preview" className="w-full h-auto rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full max-w-sm bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined">query_stats</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Estadísticas y Documentos</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                                Sicultura es la principal fuente de inteligencia cultural del país. El módulo de Estadísticas reúne y organiza datos métricos generados por el Ministerio y otras entidades relevantes.
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed">
                                El repositorio de <strong>Documentos</strong> provee acceso gratuito y directo a publicaciones, investigaciones en profundidad y la normativa vigente que regula la economía creativa.
                            </p>
                            <Link to="/estadisticas" className="inline-flex items-center gap-2 text-primary font-bold hover:text-blue-800 transition-colors">
                                Ver Estadísticas <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                    </div>


                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 animate-on-scroll">
                        <div className="flex-1 order-2 lg:order-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined">campaign</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sección de Novedades</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                                Un canal dinámico que ofrece artículos, notas informativas, entrevistas exclusivas y anuncios sobre los últimos contenidos y recursos agregados a la plataforma así como convocatorias abiertas.
                            </p>
                            <Link to="/novedades" className="inline-flex items-center gap-2 text-primary font-bold hover:text-blue-800 transition-colors">
                                Revisar Novedades <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>
                        <div className="flex-1 order-1 lg:order-2 w-full lg:w-auto relative">
                            <div className="bg-slate-100 dark:bg-surface-dark rounded-3xl p-4 lg:p-8 relative z-10">
                                <img src="https://picsum.photos/seed/mod3/600/400" alt="Novedades interface preview" className="w-full h-auto rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full max-w-sm bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-24 relative overflow-hidden bg-slate-900 text-white">

                <div className="absolute inset-0 z-0">
                    <img src="https://picsum.photos/seed/comunidad/2000/1000" alt="Comunidad Background" className="w-full h-full object-cover mix-blend-overlay opacity-20 filter grayscale" />
                    <div className="absolute inset-0 bg-slate-900/80"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        <div className="animate-on-scroll">
                            <h2 className="text-3xl font-bold mb-6 text-white border-b-2 border-secondary inline-block pb-2">Nuestra Comunidad</h2>
                            <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                Sicultura orienta sus servicios a la ciudadanía en general, pero nuestra activa comunidad usuaria incluye principalmente a:
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <span className="material-symbols-outlined text-secondary block mb-2 text-3xl">groups</span>
                                    <span className="font-bold">Agentes Culturales</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <span className="material-symbols-outlined text-secondary block mb-2 text-3xl">school</span>
                                    <span className="font-bold">Investigadores y Academia</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <span className="material-symbols-outlined text-secondary block mb-2 text-3xl">account_balance</span>
                                    <span className="font-bold">Funcionariado Público</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                    <span className="material-symbols-outlined text-secondary block mb-2 text-3xl">tour</span>
                                    <span className="font-bold">Turismo Cultural y Sector Empresarial</span>
                                </div>
                            </div>
                        </div>


                        <div className="animate-on-scroll delay-200">
                            <h2 className="text-3xl font-bold mb-6 text-white border-b-2 border-primary inline-block pb-2">Breves Antecedentes</h2>
                            <div className="space-y-6 text-slate-300">
                                <div className="relative pl-6 border-l-2 border-primary">
                                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-slate-900"></div>
                                    <h4 className="font-bold text-white text-lg">Mayo 2021</h4>
                                    <p className="text-sm mt-1">El Ministerio de Cultura dio inicio a la creación de Sicultura con financiamiento del BID, a través del contrato de préstamo 4450/OC-PN.</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-primary">
                                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-slate-900"></div>
                                    <h4 className="font-bold text-white text-lg">Desarrollo y Asistencia</h4>
                                    <p className="text-sm mt-1">Asistencia técnica de Fundación Ciudad del Saber para diseño, servicio técnico y capacitación, cumpliendo con la Ley General de Cultura de 2020.</p>
                                </div>
                                <div className="relative pl-6 border-l-2 border-transparent">
                                    <div className="absolute w-3 h-3 bg-secondary rounded-full -left-[7px] top-1.5 ring-4 ring-slate-900"></div>
                                    <h4 className="font-bold text-white text-lg">Nuevas Fases</h4>
                                    <p className="text-sm mt-1">Sicultura proyecta integrar la <strong>Cuenta Satélite de la Cultura</strong> y coordinar estudios en colaboración con la Contraloría (INEC) y centros de investigación privados y formativos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-20 bg-slate-50 dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 text-center relative z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Forma parte de la red cultural</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                        Invitamos a todos los agentes culturales del país a registrarse y crear o compartir sus fichas informativas, espacios y eventos periódicos, construyendo juntos nuestra memoria cultural.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-primary/25 hover:-translate-y-1">
                            Crear mi cuenta
                        </button>
                        <button className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full text-lg font-bold transition-all hover:shadow-md">
                            Consultar el Directorio
                        </button>
                    </div>
                    <p className="mt-8 text-sm text-slate-500">¿Dudas sobre términos? Consulta nuestra <a href="#" className="text-primary hover:underline font-medium">sección de Definiciones</a>.</p>
                </div>
            </section>



            <footer className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800">

                <div className="border-b border-slate-200 dark:border-slate-800">
                    <div
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Suscríbete al boletín informativo
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400">Recibe las últimas noticias, eventos y convocatorias
                                culturales de Panamá directamente en tu correo electrónico.</p>
                        </div>
                        <form
                            className="w-full md:w-auto flex-1 max-w-md flex shadow-sm hover:shadow-md transition-shadow rounded-xl">
                            <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
                            <input type="email" id="newsletter-email" placeholder="Tu correo electrónico"
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-l-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                required />
                            <button type="submit"
                                className="bg-primary hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-r-xl transition-colors">
                                Suscribirse
                            </button>
                        </form>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                        <div className="flex flex-col gap-6">
                            <Link to="/"
                                className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 w-max">
                                <img src="logo_micultura.png" alt="Sicultura Panamá Logo" className="h-12 w-auto" />
                            </Link>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                Sistema de Información Cultural de Panamá. Un proyecto del Ministerio de Cultura para conectar y
                                promover nuestra riqueza cultural.
                            </p>
                            <div className="flex flex-wrap gap-3">

                                <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-pink-600 hover:text-white transition-all group"
                                    href="#" aria-label="Instagram">
                                    <svg className="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M12 2.163c3.204 0 3.584.012 4.85.072 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z">
                                        </path>
                                    </svg>
                                </a>

                                <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all group"
                                    href="#" aria-label="Facebook">
                                    <svg className="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z">
                                        </path>
                                    </svg>
                                </a>

                                <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-700 hover:text-white transition-all group"
                                    href="#" aria-label="LinkedIn">
                                    <svg className="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z">
                                        </path>
                                    </svg>
                                </a>

                                <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-black dark:hover:bg-white dark:hover:text-black hover:text-white transition-all group"
                                    href="#" aria-label="X (Twitter)">
                                    <svg className="w-4 h-4 fill-current transform group-hover:scale-110 transition-transform"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z">
                                        </path>
                                    </svg>
                                </a>

                                <a className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-red-600 hover:text-white transition-all group"
                                    href="#" aria-label="YouTube">
                                    <svg className="w-5 h-5 fill-current transform group-hover:scale-110 transition-transform"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z">
                                        </path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Explora</h3>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link className="hover:text-primary transition-colors" to="/directorio">Manifestaciones
                                    Culturales</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/mapa">Espacios y Museos</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/directorio">Agentes
                                    Culturales</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/novedades">Eventos y
                                    Festivales</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Recursos</h3>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><Link className="hover:text-primary transition-colors" to="/documentos">Documentos y
                                    Leyes</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/novedades">Convocatorias
                                    Abiertas</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/estadisticas">Estadísticas
                                    Culturales</Link></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Mapa del Sitio</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Contacto</h3>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                    <span>P.H. Tula, Edificio Grupo Rey,<br />Vía España con vía Argentina.</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg">call</span>
                                    <span>+507 501-4000</span>
                                </li>
                                <li className="flex items-center gap-3 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                    <a href="mailto:info@sicultura.gob.pa">info@sicultura.gob.pa</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div
                        className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-slate-500 dark:text-slate-500">
                            © 2024 Ministerio de Cultura de Panamá. Todos los derechos reservados.
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-500">
                            <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Privacidad</a>
                            <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Términos</a>
                            <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Accesibilidad</a>
                            <Link className="hover:text-slate-900 dark:hover:text-white transition-colors"
                                to="/sobre">Sobre Sicultura</Link>
                        </div>
                    </div>
                </div>
            </footer>


            <div id="login-modal" className="fixed inset-0 z-[100] hidden items-center justify-center">

                <div id="login-modal-overlay"
                    className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity opacity-0"></div>


                <div id="login-modal-content"
                    className="relative bg-white dark:bg-surface-dark w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden transform scale-95 opacity-0 transition-all duration-300 border border-slate-100 dark:border-slate-800">

                    <button id="login-modal-close"
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="p-8">

                        <div className="flex flex-col items-center justify-center mb-8">
                            <img src="logo_micultura.png" alt="Sicultura Panamá Logo" className="h-16 w-auto mb-4 drop-shadow-sm" />
                            <h2 id="modal-title" className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido</h2>
                            <p id="modal-subtitle" className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">Inicia
                                sesión para acceder a tu perfil y recursos culturales.</p>
                        </div>


                        <form id="login-form" className="space-y-5 transition-all duration-300">
                            <div>
                                <label htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo
                                    Electrónico</label>
                                <input type="email" id="email"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    placeholder="tu@correo.com" />
                            </div>
                            <div id="password-field" className="transition-all duration-300 overflow-hidden">
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password"
                                        className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
                                    <a href="#" id="btn-forgot-password"
                                        className="text-sm text-primary hover:text-blue-700 transition-colors font-medium">¿Olvidaste
                                        tu contraseña?</a>
                                </div>
                                <input type="password" id="password"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    placeholder="••••••••" />
                            </div>

                            <button type="submit" id="btn-submit"
                                className="w-full bg-secondary hover:bg-red-800 text-white font-bold rounded-lg px-4 py-3 mt-4 transition-colors shadow-lg shadow-secondary/30">
                                Iniciar Sesión
                            </button>


                            <div id="back-to-login" className="text-center hidden mt-4">
                                <a href="#"
                                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                                    Volver al inicio de sesión
                                </a>
                            </div>
                        </form>


                        <div id="modal-footer"
                            className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center transition-all duration-300">
                            <p className="text-slate-600 dark:text-slate-400 text-sm">¿No tienes cuenta? <button type="button"
                                id="btn-switch-to-register"
                                className="text-primary hover:text-blue-700 font-bold ml-1 transition-colors">Regístrate</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <RegistrationModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />



        </React.Fragment>
    );
}
