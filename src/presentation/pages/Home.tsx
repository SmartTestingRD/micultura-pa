import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { RegistrationModal } from '../components/RegistrationModal';
import { LoginModal } from '../components/LoginModal';

export default function Home() {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

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
                                onClick={() => setIsLoginOpen(true)}
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

            <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden pb-16 pt-10">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-background-light dark:to-background-dark z-10">
                    </div>
                    <img alt="Cultural dance performance in Panama" className="w-full h-full object-cover object-center"
                        data-alt="Vibrant traditional Panamanian dancers in polleras"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrwWUtTyNGc0IziVTHYYapMmPm8y71ed9ujt-lpWTK3T0vg7Ved80wGkNNXi4G9qKugckP6AbP1ZZoFG9dPNXvI-IiXp8nCfQIww2ud28FfnxR5eSIV0d5ZkyTLKxfq0reXgQce962B8ARamjr7hZ5owTF6-tZDe3ihcLDkFCCWUUeuT9unhx97ZAgeW0cVvBxtQO3yCZ8rBfYmjCllaFvJit8TVBq02as_t3EZX8r_5F85hwyzPpp7XkyjZRC-n-gPbt5ckt2msA" />
                </div>

                <div className="relative z-20 w-full max-w-4xl px-4 text-center mt-12">
                    <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium mb-6 animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Portal Oficial de Recursos Culturales
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-sm leading-tight">
                        Explora la Riqueza <br /> Cultural de Panamá
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                        Descubre manifestaciones artísticas, espacios históricos y eventos culturales en un solo lugar.
                    </p>

                    <div
                        className="w-full max-w-2xl mx-auto bg-white dark:bg-surface-dark p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 transform transition-transform hover:scale-[1.01]">
                        <div
                            className="flex-1 flex items-center px-4 h-12 sm:h-auto border-b sm:border-b-0 border-slate-100 dark:border-slate-700">
                            <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
                            <input id="hero-search-input"
                                className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 text-base"
                                placeholder="¿Qué estás buscando? Ej. Museos, Danza..." type="text" />
                        </div>
                        <div className="h-12 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block my-2"></div>
                        <div className="flex-shrink-0 flex items-center px-2 pb-2 sm:pb-0">
                            <button id="hero-search-btn"
                                className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                                Buscar
                            </button>
                        </div>
                    </div>
                    <div
                        className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-white drop-shadow-md mx-auto w-max px-6 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                        <span className="opacity-90 font-bold">Tendencias:</span>
                        <a className="hover:text-primary transition-colors hover:bg-white/10 px-3 py-1 rounded-full cursor-pointer"
                            href="#">Casco Antiguo</a>
                        <a className="hover:text-primary transition-colors hover:bg-white/10 px-3 py-1 rounded-full cursor-pointer"
                            href="#">Festival de Jazz</a>
                        <a className="hover:text-primary transition-colors hover:bg-white/10 px-3 py-1 rounded-full cursor-pointer"
                            href="#">Museos</a>
                    </div>
                </div>
            </section>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-30 pb-20">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div
                        className="animate-on-scroll bg-white dark:bg-surface-dark rounded-xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors cursor-pointer delay-100">
                        <div
                            className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">theater_comedy</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">2,400+</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Manifestaciones</p>
                    </div>
                    <div
                        className="animate-on-scroll bg-white dark:bg-surface-dark rounded-xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors cursor-pointer delay-200">
                        <div
                            className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">museum</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">180+</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Espacios</p>
                    </div>
                    <div
                        className="animate-on-scroll bg-white dark:bg-surface-dark rounded-xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors cursor-pointer delay-300">
                        <div
                            className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">500+</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Grupos</p>
                    </div>
                    <div
                        className="animate-on-scroll bg-white dark:bg-surface-dark rounded-xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors cursor-pointer delay-400">
                        <div
                            className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">event</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">12/sem</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Eventos</p>
                    </div>
                </div>

                <div className="mb-20">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Categorías Principales
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Navega a través de los pilares de nuestra
                                identidad.</p>
                        </div>
                        <a className="hidden sm:flex items-center text-primary font-semibold hover:text-blue-700 transition-colors"
                            href="#">
                            Ver todo
                            <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                        <a className="animate-on-scroll magic-card group relative overflow-hidden rounded-2xl md:col-span-2 row-span-1 delay-100"
                            href="#">
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity opacity-90 group-hover:opacity-100">
                            </div>
                            <img alt="Traditional Panamanian dance"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                data-alt="Dancers in traditional Pollera dresses performing"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNJCxTiZJLIG3xB_K9vkCGwqfFybLaUCFKQKWFPgmcP77XekUn6QDlP4AFa8MJeMqGfY58q0wjKw5IxDRCqF5t56KfiV1kPhPOXpwtb5If0tT9YT6CDvJVnyi3IgJMLo0CGbckcIQonYjoH617Av2W__gTKWFDKqLWDDWdhrB-LbxWu-6Ih77kMIfaNGIWMDXCaDWGjqeLJbgolV7ZPJo9GC6y8mLXsEp6VBh33u08gHrX93SpHiQQMbtsl2d9qNb9wy3p4VC2-qo" />
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <span className="text-primary-300 text-sm font-bold uppercase tracking-wider mb-2 block">Patrimonio
                                    Inmaterial</span>
                                <h3
                                    className="text-3xl font-bold text-white mb-2 transform transition-transform group-hover:-translate-y-1">
                                    Manifestaciones</h3>
                                <p className="text-slate-300 line-clamp-2 max-w-md">Danzas, músicas, tradiciones orales y
                                    celebraciones que definen nuestra identidad.</p>
                            </div>
                            <div
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <span className="material-symbols-outlined">arrow_outward</span>
                            </div>
                        </a>

                        <a className="animate-on-scroll magic-card group relative overflow-hidden rounded-2xl row-span-1 md:row-span-2 delay-200"
                            href="#">
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 transition-opacity opacity-80 group-hover:opacity-100">
                            </div>
                            <img alt="Historical architecture in Casco Viejo"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                data-alt="Colonial architecture facade in Casco Antiguo"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0p3sFavZlEYkBQ2a3KjfZu4kwdYBlIVZe5yFgKKHDTzaghbZkt5cY2wVd0EY01jCPEt5aTs-vopicVxtF_D9JzAQV4C9pDE9pFL8mXT16-kwq3rhhCcOVHSguf_z7-QyUGCMccyHbf3dmlLvvy-LPkPqlVFG7v0sNuX6N-zjAW1xgyj7Q2sSFopFPXNsbSZ0k0G62h_Ghv1aGtQIBNI00G2hqckg5puy_7bKE8sRvvRZ-O42N3tIE78vwR0h5uvk1FIHe7K7ulFY" />
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <span className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-2 block">Lugares</span>
                                <h3
                                    className="text-3xl font-bold text-white mb-2 transform transition-transform group-hover:-translate-y-1">
                                    Espacios Culturales</h3>
                                <p className="text-slate-300 line-clamp-3">Museos, teatros, bibliotecas y sitios arqueológicos
                                    abiertos al público.</p>
                            </div>
                        </a>

                        <a className="animate-on-scroll magic-card group relative overflow-hidden rounded-2xl delay-300" href="#">
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity opacity-90 group-hover:opacity-100">
                            </div>
                            <img alt="Music festival crowd"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                data-alt="Crowd enjoying a live cultural music event"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxeL55HcePobxvlOuRtO99--wdioiORbw9wKBphVPnHgVCUKAW9yeCWv2Ycid_H62JI6Qtf-Va60lWCZMpgHuwZxcOpmIhYMJOO5Ju2TzpUgDdPSkPzz_hhZavRs718s69cJSX9jlOiviC1nHK4KQSWkj6Fjhr29C7-_m6FouId6vGxXfom-xjv27kqItaP6RLdYge2fAXdgSPRluKeBDtbAKXkEOnlfw0CfykUTYqNWwGnDtci_36c_b9gdPV7BSiAsNs-QVaFDg" />
                            <div className="absolute bottom-0 left-0 p-6 z-20">
                                <h3
                                    className="text-xl font-bold text-white transform transition-transform group-hover:-translate-y-1">
                                    Eventos &amp; Festivales</h3>
                                <p className="text-slate-300 text-sm mt-1">Calendario nacional</p>
                            </div>
                        </a>

                        <a className="animate-on-scroll magic-card group relative overflow-hidden rounded-2xl delay-400" href="#">
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-opacity opacity-90 group-hover:opacity-100">
                            </div>
                            <img alt="Artisans working"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                data-alt="Close up of artisan hands creating crafts"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYvSrI3yQqkEbbFBqPPGGWO5b9vTX5HFo_ptTKEJIGb0h8pfPOz3IHt-zHeXqD7SZLzcKEX9HM4BbRADk9r7ulMV-b1zPWG8J5zoHitVAIZ8ox-Ve4dXUcYPlX4qq86AablCn4x-6NMST1ui5008_twixYGfVmIHMn6ovj0DMnSjPvp7t3_xvz6U5ciQQrhfwHoDGfT1rfXkBZOa_5Ijmg0HV7JDMlZO3ORj4jtK2U4WbqEeSZ1KRMAGI_x6-wRjAmkotUD09U6kg" />
                            <div className="absolute bottom-0 left-0 p-6 z-20">
                                <h3
                                    className="text-xl font-bold text-white transform transition-transform group-hover:-translate-y-1">
                                    Agentes Culturales</h3>
                                <p className="text-slate-300 text-sm mt-1">Artistas y gestores</p>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="mb-20">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Directorio Rápido</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <a className="flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                            href="#">
                            <span
                                className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-3 transition-colors">palette</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary text-sm">Artes
                                Visuales</span>
                        </a>
                        <a className="flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                            href="#">
                            <span
                                className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-3 transition-colors">music_note</span>
                            <span
                                className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary text-sm">Música</span>
                        </a>
                        <a className="flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                            href="#">
                            <span
                                className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-3 transition-colors">menu_book</span>
                            <span
                                className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary text-sm">Literatura</span>
                        </a>
                        <a className="flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                            href="#">
                            <span
                                className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-3 transition-colors">movie</span>
                            <span
                                className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary text-sm">Cine</span>
                        </a>
                        <a className="flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                            href="#">
                            <span
                                className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-3 transition-colors">restaurant</span>
                            <span
                                className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary text-sm">Gastronomía</span>
                        </a>
                        <a className="flex flex-col items-center justify-center p-6 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl hover:border-primary hover:shadow-md transition-all group"
                            href="#">
                            <span
                                className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-3 transition-colors">add</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary text-sm">Ver
                                Más</span>
                        </a>
                    </div>
                </div>


                <div className="mb-20">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Últimas Novedades</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">Mantente al tanto de las noticias y convocatorias
                                culturales.</p>
                        </div>
                        <Link className="hidden sm:flex items-center text-primary font-semibold hover:text-blue-700 transition-colors"
                            to="/novedades">
                            Ver todas las noticias
                            <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        <article
                            className="animate-on-scroll bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col delay-100">
                            <div className="relative h-48 overflow-hidden">
                                <img src="https://picsum.photos/seed/novedades1/800/600" alt="Nueva Biblioteca"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4">
                                    <span
                                        className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Anuncio</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-slate-400 text-sm mb-3 gap-2">
                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                    <time dateTime="2026-02-23">23 Feb 2026</time>
                                </div>
                                <h3
                                    className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                    Apertura de la Nueva Biblioteca Nacional</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-3">El Ministerio de
                                    Cultura se complace en anunciar la inauguración de las nuevas instalaciones centrales,
                                    dotadas con tecnología de punta...</p>
                                <a href="#"
                                    className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors text-sm mt-auto">
                                    Leer publicación
                                    <span
                                        className="material-symbols-outlined ml-1 text-base transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </article>


                        <article
                            className="animate-on-scroll bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col delay-200">
                            <div className="relative h-48 overflow-hidden">
                                <img src="https://picsum.photos/seed/novedades2/800/600" alt="Fondo Cultural"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4">
                                    <span
                                        className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Convocatorias</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-slate-400 text-sm mb-3 gap-2">
                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                    <time dateTime="2026-02-20">20 Feb 2026</time>
                                </div>
                                <h3
                                    className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                    Abren inscripciones para el Fondo de Cine</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-3">Cineastas
                                    panameños podrán aplicar al fondo extraordinario de desarrollo y producción audiovisual para
                                    proyectos locales...</p>
                                <a href="#"
                                    className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors text-sm mt-auto">
                                    Leer publicación
                                    <span
                                        className="material-symbols-outlined ml-1 text-base transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </article>


                        <article
                            className="animate-on-scroll bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col delay-300">
                            <div className="relative h-48 overflow-hidden">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrwWUtTyNGc0IziVTHYYapMmPm8y71ed9ujt-lpWTK3T0vg7Ved80wGkNNXi4G9qKugckP6AbP1ZZoFG9dPNXvI-IiXp8nCfQIww2ud28FfnxR5eSIV0d5ZkyTLKxfq0reXgQce962B8ARamjr7hZ5owTF6-tZDe3ihcLDkFCCWUUeuT9unhx97ZAgeW0cVvBxtQO3yCZ8rBfYmjCllaFvJit8TVBq02as_t3EZX8r_5F85hwyzPpp7XkyjZRC-n-gPbt5ckt2msA"
                                    alt="Festival de Diablicos"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4">
                                    <span
                                        className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Eventos</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center text-slate-400 text-sm mb-3 gap-2">
                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                    <time dateTime="2026-02-18">18 Feb 2026</time>
                                </div>
                                <h3
                                    className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                    Éxito total en el Festival Folklórico 2026</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1 line-clamp-3">Con una
                                    asistencia récord de cientos de personas, las festividades en la Villa de Los Santos
                                    celebraron nuestras tradiciones...</p>
                                <a href="#"
                                    className="inline-flex items-center text-primary font-semibold hover:text-blue-700 transition-colors text-sm mt-auto">
                                    Leer publicación
                                    <span
                                        className="material-symbols-outlined ml-1 text-base transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </a>
                            </div>
                        </article>
                    </div>


                    <Link to="/novedades"
                        className="flex sm:hidden w-full mt-6 justify-center items-center py-3 px-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold shadow-sm hover:shadow-md transition-all active:scale-95">
                        Ver todas las noticias
                    </Link>
                </div>

                <div
                    className="animate-on-scroll bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative h-[500px] flex flex-col md:flex-row">

                    <div className="flex-1 relative order-2 md:order-1 h-64 md:h-auto">
                        <img alt="Map view of Panama" className="w-full h-full object-cover opacity-60 grayscale"
                            data-alt="Dark themed map interface with glowing location pins" data-location="Panama City"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5vcZjkA09mebo8SeMyRTlPKrPpB7Im8Cs-3X5SheQx8N-JdZH5G4jQY2NXAxyMWLZpUAOtAdix98kx5ucybBMKmAGOT63W_yP-aWA6xUN_jSCYfqmBMTmdjllJT06IJo6emt53-cT4V1lIa-TaEKlasUC6IXQB8jrdphXZjfSPGjOpoTlNf0RuEhAkO21WysMn_VrIWKNjWc64oWgcCkTBmuNWUfC3i-vREPumnqaakgWS7_GsbSIP_AMIRMQBf8SFm9YGvKBHts" />

                        <div className="absolute inset-0 p-4 pointer-events-none">

                            <div
                                className="absolute top-1/2 left-1/2 -translate-x-10 -translate-y-10 group cursor-pointer pointer-events-auto">
                                <span className="relative flex h-4 w-4">
                                    <span
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span
                                        className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white"></span>
                                </span>
                                <div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-lg">
                                    Museo del Canal</div>
                            </div>
                            <div className="absolute top-1/3 left-1/3 group cursor-pointer pointer-events-auto">
                                <span className="relative flex h-4 w-4">
                                    <span
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 delay-100"></span>
                                    <span
                                        className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-white"></span>
                                </span>
                                <div
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded shadow-lg">
                                    Teatro Nacional</div>
                            </div>

                            <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-auto">
                                <button
                                    className="bg-surface-dark text-white p-2 rounded-lg hover:bg-slate-700 shadow-lg border border-slate-700">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                </button>
                                <button
                                    className="bg-surface-dark text-white p-2 rounded-lg hover:bg-slate-700 shadow-lg border border-slate-700">
                                    <span className="material-symbols-outlined text-lg">remove</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className="w-full md:w-96 bg-surface-dark p-8 flex flex-col justify-center order-1 md:order-2 border-l border-slate-800">
                        <div className="inline-flex items-center gap-2 text-primary mb-4">
                            <span className="material-symbols-outlined">map</span>
                            <span className="uppercase tracking-widest text-xs font-bold">Geolocalización</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Mapa Cultural Interactivo</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Localiza museos, centros culturales y eventos cerca de ti. Planifica tu ruta cultural por Panamá con
                            nuestra herramienta interactiva.
                        </p>
                        <div className="space-y-4">
                            <div
                                className="flex items-center gap-4 text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <span className="material-symbols-outlined text-primary">near_me</span>
                                <div className="text-sm">
                                    <span className="block font-bold text-white">Cerca de ti</span>
                                    <span>3 eventos encontrados hoy</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="mt-8 bg-primary hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group">
                            Explorar Mapa Completo
                            <span
                                className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </main>

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


            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={() => setIsRegisterOpen(true)}
            />

            <RegistrationModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />



        </React.Fragment>
    );
}
