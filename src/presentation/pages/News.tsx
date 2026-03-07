import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { RegistrationModal } from '../components/RegistrationModal';

export default function News() {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    // --- Scroll Animation Logic ---
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

    // --- Category Carousel Logic ---
    const carouselRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrollAmount = 200;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!carouselRef.current) return;
        setIsDown(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDown(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const scrollPrev = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    }, []);

    const scrollNext = useCallback(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        let categoryAutoplayInterval: NodeJS.Timeout;

        const startCategoryAutoplay = () => {
            categoryAutoplayInterval = setInterval(() => {
                if (carouselRef.current) {
                    if (carouselRef.current.scrollLeft + carouselRef.current.clientWidth >= carouselRef.current.scrollWidth - 10) {
                        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    }
                }
            }, 3000);
        };

        const stopCategoryAutoplay = () => {
            clearInterval(categoryAutoplayInterval);
        };

        startCategoryAutoplay();

        const carouselElement = carouselRef.current;
        if (carouselElement) {
            carouselElement.addEventListener('mouseenter', stopCategoryAutoplay);
            carouselElement.addEventListener('mouseleave', startCategoryAutoplay);
            carouselElement.addEventListener('touchstart', stopCategoryAutoplay);
            carouselElement.addEventListener('touchend', startCategoryAutoplay);
        }

        return () => {
            stopCategoryAutoplay();
            if (carouselElement) {
                carouselElement.removeEventListener('mouseenter', stopCategoryAutoplay);
                carouselElement.removeEventListener('mouseleave', startCategoryAutoplay);
                carouselElement.removeEventListener('touchstart', stopCategoryAutoplay);
                carouselElement.removeEventListener('touchend', startCategoryAutoplay);
            }
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
                            <Link className="text-primary font-bold px-3 py-2 text-sm transition-colors border-b-2 border-primary"
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



            <div className="bg-[#0f2854] md:h-80 relative z-20 flex border-b-4 border-[#081838]">

                <div className="absolute inset-0 overflow-hidden isolate">
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay object-cover"
                        style={{ "backgroundImage": "url('https", "backgroundSize": "cover", "backgroundPosition": "center" }}>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f2854] via-[#0f2854]/80 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex items-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full pt-16 pb-12 md:py-0 h-full">

                        <div className="flex-1 self-center md:pb-0 relative z-20 animate-on-scroll">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/20 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-[14px]">campaign</span>
                                Novedades y Noticias
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
                                Noticias Culturales<span className="text-secondary">.</span>
                            </h1>
                            <p className="text-lg text-blue-100 max-w-xl leading-relaxed mb-8">
                                Mantente informado con todas las noticias, artículos, eventos y convocatorias del Ministerio de Cultura de Panamá.
                            </p>


                        </div>


                        <div className="hidden md:block relative w-80 lg:w-[420px] flex-shrink-0 group z-30 transform translate-y-24 lg:translate-y-32">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden relative transition-transform duration-300 border border-slate-100 dark:border-slate-800 cursor-pointer hover:-translate-y-2 magic-card">


                                <div className="absolute top-0 right-4 z-30 drop-shadow-md">
                                    <svg width="36" height="52" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0H40V60L20 48L0 60V0Z" fill="#ab192d" />
                                        <circle cx="20" cy="20" r="12" fill="white" fill-opacity="0.2" />
                                    </svg>
                                </div>


                                <div className="h-64 relative overflow-hidden flex items-start justify-center">
                                    <img src="https://picsum.photos/seed/novedadesdest/1200/800" alt="Featured News Image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                                    <div className="absolute bottom-4 left-4 z-10">
                                        <span className="bg-secondary/90 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-md">Convocatoria Destacada</span>
                                    </div>
                                </div>


                                <div className="p-6">
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        <span>23 Feb 2026</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 leading-tight text-xl group-hover:text-primary transition-colors">
                                        Apertura del Fondo Nacional para el Desarrollo Cultural
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                                        El Ministerio de Cultura anuncia la apertura de postulaciones para el fondo de apoyo a proyectos artísticos y culturales independientes.
                                    </p>

                                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <div className="flex items-center gap-2">
                                            <img src="logo_micultura.png" alt="Autor" className="w-8 h-8 rounded-full bg-slate-100 object-contain p-1 border border-slate-200" />
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">Redacción MiCultura</span>
                                        </div>
                                        <span className="text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform text-sm">Leer más <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 relative z-10 bg-slate-50 dark:bg-background-dark">


                <div className="mb-4 relative z-10 pr-0 md:pr-96 lg:pr-[470px]">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Explora por categorías</h2>


                    <div className="relative group">

                        <button onClick={scrollPrev} id="category-prev"
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 opacity-100 transition-opacity z-20">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>


                        <div id="category-carousel" ref={carouselRef}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            className={`flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth select-none ${isDown ? 'cursor-grabbing' : 'cursor-grab'}`}>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">newspaper</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Noticias</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">event</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Eventos</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">campaign</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Convocatorias</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">mic</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Entrevistas</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">account_balance</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Patrimonio</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-32 sm:w-40 h-28 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary transition-colors">menu_book</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Editoriales</span>
                            </button>
                        </div>


                        <button onClick={scrollNext} id="category-next"
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 opacity-100 transition-opacity z-20">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>


                <div className="mb-8 relative z-10 animate-on-scroll">

                    <div className="border-b border-slate-200 dark:border-slate-800 mb-0 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="flex items-center gap-6 px-4 whitespace-nowrap min-w-max pb-2">
                            <a href="#" className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                Ver todo
                            </a>
                            <a href="#" className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                <span className="material-symbols-outlined text-[18px]">newspaper</span>
                                Noticias
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full">145</span>
                            </a>
                            <a href="#" className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                <span className="material-symbols-outlined text-[18px]">event</span>
                                Eventos
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full">42</span>
                            </a>
                            <a href="#" className="text-secondary font-bold py-2 flex items-center gap-2 border-b-2 border-secondary relative z-10 -mb-[9px]">
                                <span className="material-symbols-outlined text-[18px]">campaign</span>
                                Convocatorias
                                <span className="bg-red-100 text-secondary text-[10px] px-2 py-0.5 rounded-full">12</span>
                            </a>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark border-b border-l border-r border-slate-200 dark:border-slate-800 rounded-b-xl shadow-sm p-3 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 relative w-full flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-slate-400">search</span>
                            <input type="text" className="w-full bg-transparent border-none pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:ring-0 placeholder-slate-400 text-sm" placeholder="Buscar en novedades..." />
                            <span className="text-[11px] text-slate-400 absolute right-4 hidden lg:block">199 artículos en total</span>
                        </div>

                        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">

                            <div className="relative group cursor-pointer">
                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-primary transition-colors">
                                    Categorías <span className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
                                </div>
                            </div>


                            <div className="relative group cursor-pointer">
                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-primary transition-colors">
                                    Fechas <span className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
                                </div>
                            </div>


                            <div className="relative group cursor-pointer">
                                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-primary transition-colors">
                                    Regiones <span className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex justify-between items-center mb-6 animate-on-scroll">
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Mostrando 6 publicaciones de 199</p>
                    <select className="bg-transparent border-none text-slate-600 dark:text-slate-300 font-medium focus:ring-0 cursor-pointer text-sm">
                        <option>Más Recientes</option>
                        <option>Más Populares</option>
                        <option>Próximos Eventos</option>
                    </select>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col animate-on-scroll delay-200">
                        <div className="h-48 relative overflow-hidden">
                            <img src="https://picsum.photos/seed/nov1/800/600" alt="Noticia 1" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-md z-10">Noticia</div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span>20 Feb 2026</span>
                                <span>•</span>
                                <span>3 min lectura</span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                Inauguración de la nueva sala del Museo del Canal
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                                Se abren las puertas de la nueva exhibición permanente dedicada a la vida cotidiana durante la construcción del Canal de Panamá, con más de 200 piezas inéditas.
                            </p>
                            <div className="mt-auto">
                                <span className="text-primary text-sm font-bold flex items-center gap-1">Leer artículo <span className="material-symbols-outlined text-sm">trending_flat</span></span>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col animate-on-scroll delay-300">
                        <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-4">

                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">festival</span>
                            <div className="absolute top-3 left-3 bg-orange-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-md z-10">Evento</div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span>18 Feb 2026</span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                Festival Nacional de la Mejorana en Guararé: Fechas Confirmadas
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                                Se ha publicado el cronograma oficial de actividades para el festival folclórico más importante de la región de Azuero. Conoce a los artistas invitados.
                            </p>
                            <div className="mt-auto">
                                <span className="text-primary text-sm font-bold flex items-center gap-1">Ver detalles <span className="material-symbols-outlined text-sm">trending_flat</span></span>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col animate-on-scroll delay-400">
                        <div className="h-48 relative overflow-hidden">
                            <img src="https://picsum.photos/seed/nov3/800/600" alt="Concurso Literario" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 bg-secondary/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-md z-10">Concurso</div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span>15 Feb 2026</span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                Premios Ricardo Miró 2026: Jurados Internacionales Anunciados
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                                El Ministerio de Cultura revela a los prestigiosos escritores de Iberoamérica que formarán parte del panel de jurados para el certamen literario de este año.
                            </p>
                            <div className="mt-auto">
                                <span className="text-primary text-sm font-bold flex items-center gap-1">Ver artículo <span className="material-symbols-outlined text-sm">trending_flat</span></span>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col animate-on-scroll delay-100">
                        <div className="h-48 relative overflow-hidden">
                            <img src="https://picsum.photos/seed/nov4/800/600" alt="Patrimonio" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-md z-10">Patrimonio</div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span>10 Feb 2026</span>
                                <span>•</span>
                                <span>5 min lectura</span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                Restauración del Fuerte San Lorenzo avanza en un 80%
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                                Un vistazo detallado a las labores arqueológicas y de conservación que se están llevando a cabo en el patrimonio histórico de la humanidad en la costa caribeña.
                            </p>
                            <div className="mt-auto">
                                <span className="text-primary text-sm font-bold flex items-center gap-1">Leer artículo <span className="material-symbols-outlined text-sm">trending_flat</span></span>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col animate-on-scroll delay-200">
                        <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-4">
                            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">palette</span>
                            <div className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-md z-10">Taller</div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span>05 Feb 2026</span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                Talleres de Artesanías de Barro en La Arena de Chitré
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                                Maestros artesanos abrirán sus puertas este fin de semana para dictar talleres gratuitos sobre las técnicas tradicionales de alfarería precolombina.
                            </p>
                            <div className="mt-auto">
                                <span className="text-primary text-sm font-bold flex items-center gap-1">Inscribirse <span className="material-symbols-outlined text-sm">trending_flat</span></span>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 magic-card cursor-pointer group flex flex-col animate-on-scroll delay-300">
                        <div className="h-48 relative overflow-hidden">
                            <img src="https://picsum.photos/seed/nov6/800/600" alt="Entrevista" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-md z-10">Entrevista</div>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span>01 Feb 2026</span>
                                <span>•</span>
                                <span>7 min lectura</span>
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                Diálogo con la artesana destacada del mes: Karina E. González
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                                Conversamos con la talentosa creadora de tembleques sobre la evolución de sus diseños, el rescate de la tradición y los retos de la comercialización artesanal digital.
                            </p>
                            <div className="mt-auto">
                                <span className="text-primary text-sm font-bold flex items-center gap-1">Leer entrevista <span className="material-symbols-outlined text-sm">trending_flat</span></span>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="mt-16 flex justify-center animate-on-scroll">
                    <nav className="flex items-center gap-1 shadow-sm rounded-lg overflow-hidden bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                        <a href="#" className="px-3 py-2 text-slate-300 dark:text-slate-600 cursor-not-allowed flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </a>
                        <a href="#" className="px-4 py-2 text-sm font-medium bg-primary text-white">1</a>
                        <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">2</a>
                        <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hidden sm:block transition-colors">3</a>
                        <span className="px-4 py-2 text-sm text-slate-500">...</span>
                        <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">12</a>
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
