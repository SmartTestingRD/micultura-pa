import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { RegistrationModal } from '../components/RegistrationModal';

export default function Statistics() {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
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
                            <Link className="text-primary font-bold px-3 py-2 text-sm transition-colors border-b-2 border-primary"
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



            <div className="bg-primary pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative z-20 overflow-hidden">

                <div className="absolute inset-0 z-0">
                    <img className="w-full h-full object-cover object-center opacity-20 mix-blend-overlay" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Cultural Data Analytics Background" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md">
                        Explora el ecosistema cultural y creativo de Panamá, <span className="text-blue-300">en cifras.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium drop-shadow-sm">
                        Consulta los reportes estadísticos más recientes sobre producción editorial, servicios bibliotecarios, consumo cultural y mucho más.
                    </p>


                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
                        <div className="relative w-full sm:w-2/3 shadow-lg">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input type="text" placeholder="Buscar reportes estadísticos..." className="w-full bg-white border-0 rounded-xl pl-12 pr-4 py-4 text-base text-slate-900 focus:ring-4 focus:ring-blue-300 focus:border-transparent transition-all" />
                        </div>

                        <div className="relative w-full sm:w-1/3 shadow-lg">
                            <select className="w-full bg-white border-0 rounded-xl pl-5 pr-12 py-4 text-base text-slate-700 focus:ring-4 focus:ring-blue-300 appearance-none cursor-pointer font-medium">
                                <option value="">Todas las categorías</option>
                                <option value="editorial">Producción Editorial</option>
                                <option value="bibliotecas">Bibliotecas</option>
                                <option value="museos">Museos y Patrimonio</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>


            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 bg-slate-50 dark:bg-background-dark">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">


                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                            Producción editorial en Panamá con ISBN
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs text-slate-500 font-medium">Actualizado: Enero 2026</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Ministerio de Cultura
                            </span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                            Consultas - Biblioteca Ernesto J. Castillero
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs text-slate-500 font-medium">Actualizado: Diciembre 2025</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Ministerio de Cultura
                            </span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                            Frecuencia de Asistencia a Museos
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs text-slate-500 font-medium">Actualizado: Noviembre 2025</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Estudio Nacional
                            </span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                            Crecimiento de Empleos en el Sector Cultural
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs text-slate-500 font-medium">Actualizado: Octubre 2025</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Economía Naranja
                            </span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                            Registro Nacional de Artesanos Activos
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs text-slate-500 font-medium">Actualizado: Enero 2026</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Ministerio de Cultura
                            </span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                            Inversión Privada en Festivales y Eventos
                        </h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs text-slate-500 font-medium">Actualizado: Diciembre 2025</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                Economía Naranja
                            </span>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_forward</span>
                        </div>
                    </div>

                </div>


                <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-1 shadow-sm rounded-lg overflow-hidden bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                        <a href="#" className="px-3 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </a>
                        <a href="#" className="px-4 py-2 text-sm font-medium bg-primary text-white">1</a>
                        <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">2</a>
                        <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hidden sm:block transition-colors">3</a>
                        <span className="px-4 py-2 text-sm text-slate-500">...</span>
                        <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">8</a>
                        <a href="#" className="px-3 py-2 text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </a>
                    </nav>
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
