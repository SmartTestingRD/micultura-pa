import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { RegistrationModal } from '../components/RegistrationModal';

const featuredData = [
    {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
        category: "Agentes Culturales",
        title: "Karina E. González T.",
        desc: '"Me dedico al diseño y confección de tembleques, preservando la tradición folclórica panameña a través del arte."'
    },
    {
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
        category: "Espacios",
        title: "Museo del Istmo",
        desc: '"Un espacio dedicado a la conservación y exposición de nuestras raíces históricas y diversidad biológica."'
    },
    {
        image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=800",
        category: "Manifestaciones",
        title: "Diablicos Sucios",
        desc: '"Danza tradicional que forma parte del Corpus Christi, celebrada con vibrantes colores y música de mejorana."'
    }
];

export default function Directory() {
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    // --- Scroll Animation Logic ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // --- Category Carousel Logic ---
    const categoryCarouselRef = useRef<HTMLDivElement>(null);

    const scrollNext = useCallback(() => {
        if (categoryCarouselRef.current) {
            categoryCarouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }, []);

    const scrollPrev = useCallback(() => {
        if (categoryCarouselRef.current) {
            categoryCarouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }, []);

    // --- Featured Carousel Data State (Mocking Dynamic Updates) ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentFeaturedIndex((prev) => (prev + 1) % featuredData.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handlePrevFeatured = () => {
        setCurrentFeaturedIndex((prev) => (prev - 1 + featuredData.length) % featuredData.length);
    };

    const handleNextFeatured = () => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredData.length);
    };

    const currentFeatured = featuredData[currentFeaturedIndex];
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
                            <Link className="text-primary font-bold px-3 py-2 text-sm transition-colors border-b-2 border-primary"
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


            <div className="bg-[#0f2854] md:h-80 relative z-20 flex border-b-4 border-[#081838]">

                <div className="absolute inset-0 overflow-hidden isolate">
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay object-cover"
                        style={{ "backgroundImage": "url('data", "backgroundSize": "40px 40px" }}>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex items-center">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full pt-16 pb-12 md:py-0 h-full">

                        <div className="flex-1 self-center md:pb-0 relative z-20">
                            <div
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider mb-6 border border-white/20 backdrop-blur-sm">
                                <span className="material-symbols-outlined text-[14px]">map</span>
                                Directorio Nacional
                            </div>
                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
                                Directorio Cultural<span className="text-[#e73b50]">.</span></h1>
                            <p className="text-lg text-blue-100 max-w-xl leading-relaxed">Explora, descubre y conecta con miles de
                                agentes, espacios, agrupaciones y manifestaciones de todo Panamá.</p>
                        </div>


                        <div
                            className="hidden md:block relative w-80 lg:w-[420px] flex-shrink-0 group z-30 transform translate-y-24 lg:translate-y-32">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden relative transition-transform duration-300 border border-slate-100 dark:border-slate-800">


                                <div className="absolute top-0 right-4 z-30 drop-shadow-md">
                                    <svg width="36" height="52" viewBox="0 0 40 60" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0H40V60L20 48L0 60V0Z" fill="#d8b237" />
                                        <circle cx="20" cy="20" r="12" fill="white" fillOpacity="0.2" />
                                        <path
                                            d="M20 12L22.4697 17.0049L28 17.8087L24 21.7107L24.9443 27.2285L20 24.6301L15.0557 27.2285L16 21.7107L12 17.8087L17.5303 17.0049L20 12Z"
                                            fill="white" />
                                    </svg>
                                </div>


                                <div className="h-64 relative overflow-hidden flex items-start justify-center">
                                    <img id="featured-image"
                                        src={currentFeatured.image}
                                        alt="Ficha Destacada"
                                        className="w-full h-full object-cover transition-opacity duration-300" />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent">
                                    </div>

                                    <div className="absolute bottom-4 left-4 z-10">
                                        <span id="featured-category"
                                            className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-white/30">
                                            {currentFeatured.category}
                                        </span>
                                    </div>
                                </div>


                                <div className="p-6">
                                    <h3 id="featured-title"
                                        className="font-bold text-slate-900 dark:text-white mb-2 leading-tight text-xl transition-opacity duration-300">
                                        {currentFeatured.title}
                                    </h3>
                                    <p id="featured-desc"
                                        className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 transition-opacity duration-300">
                                        {currentFeatured.desc}
                                    </p>


                                    <div className="flex items-center justify-between pt-2">
                                        <div id="featured-dots" className="flex gap-1.5 items-center">
                                            {featuredData.map((_, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setCurrentFeaturedIndex(index)}
                                                    className={`rounded-full transition-all cursor-pointer ${index === currentFeaturedIndex
                                                        ? 'w-4 h-2 bg-[#0f2854]'
                                                        : 'w-2 h-2 bg-slate-200 dark:bg-slate-700'
                                                        }`}
                                                ></div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button id="featured-prev" onClick={handlePrevFeatured}
                                                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed">
                                                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                            </button>
                                            <button id="featured-next" onClick={handleNextFeatured}
                                                className="w-8 h-8 rounded-full border border-[#0f2854] text-[#0f2854] hover:bg-[#0f2854] hover:text-white flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 relative z-10">


                <div className="mb-4 relative z-10 pr-0 md:pr-96 lg:pr-[470px]">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Filtra el directorio por sectores
                        culturales</h2>


                    <div className="relative group">

                        <button id="category-prev" onClick={scrollPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 opacity-100 transition-opacity z-20">
                            <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>


                        <div id="category-carousel" ref={categoryCarouselRef}
                            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth select-none cursor-grab active:cursor-grabbing">

                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span
                                    className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#0f2854] transition-colors">palette</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Artes Visuales</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span
                                    className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#0f2854] transition-colors">music_note</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Música</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span
                                    className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#0f2854] transition-colors">menu_book</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Literatura</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span
                                    className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#0f2854] transition-colors">movie</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Cine</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-36 sm:w-44 h-32 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span
                                    className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#0f2854] transition-colors">theater_comedy</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Artes Escénicas</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-32 sm:w-40 h-28 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span
                                    className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#0f2854] transition-colors">museum</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Patrimonio</span>
                            </button>
                            <button
                                className="snap-start flex-shrink-0 w-32 sm:w-40 h-28 bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 group">
                                <span
                                    className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-[#0f2854] transition-colors">handyman</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 text-[13px]">Artesanías</span>
                            </button>
                        </div>


                        <button id="category-next" onClick={scrollNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border border-slate-200 rounded-full shadow-md flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-50 opacity-100 transition-opacity z-20">
                            <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                    </div>
                </div>


                <div className="mb-8">

                    <div
                        className="border-b border-slate-200 dark:border-slate-800 mb-0 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <div className="flex items-center gap-6 px-4 whitespace-nowrap min-w-max pb-2">
                            <a href="#"
                                className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                Ver todo
                            </a>
                            <a href="#"
                                className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                <span className="material-symbols-outlined text-[18px]">engineering</span>
                                Agentes
                                <span
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full">3254</span>
                            </a>
                            <a href="#"
                                className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                <span className="material-symbols-outlined text-[18px]">stadium</span>
                                Espacios
                                <span
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full">134</span>
                            </a>
                            <a href="#"
                                className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                <span className="material-symbols-outlined text-[18px]">event</span>
                                Eventos
                                <span
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full">75</span>
                            </a>
                            <a href="#"
                                className="text-secondary font-bold py-2 flex items-center gap-2 border-b-2 border-secondary relative z-10 -mb-[9px]">
                                <span className="material-symbols-outlined text-[18px]">cloud</span>
                                Manifestaciones
                                <span className="bg-red-100 text-secondary text-[10px] px-2 py-0.5 rounded-full">98</span>
                            </a>
                            <a href="#"
                                className="text-primary font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2 border-b-2 border-transparent">
                                <span className="material-symbols-outlined text-[18px]">military_tech</span>
                                Programas oficiales
                                <span
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full">20</span>
                            </a>
                        </div>
                    </div>


                    <div
                        className="bg-white dark:bg-surface-dark border-b border-l border-r border-slate-200 dark:border-slate-800 rounded-b-xl shadow-sm p-3 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 relative w-full flex items-center">
                            <span className="material-symbols-outlined absolute left-3 text-slate-400">search</span>
                            <input type="text" id="dir-search-input"
                                className="w-full bg-transparent border-none pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:ring-0 placeholder-slate-400 text-sm"
                                placeholder="¿Qué buscas hoy?" />
                            <span className="text-[11px] text-slate-400 absolute right-4 hidden lg:block">98 recursos culturales en
                                13ms</span>
                        </div>

                        <div className="hidden md:flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">

                            <div className="relative group cursor-pointer">
                                <div
                                    className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-primary transition-colors">
                                    Sectores <span
                                        className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
                                </div>
                                <div
                                    className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Artes Visuales</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Música</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Literatura</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Cine</span>
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <div className="relative group cursor-pointer">
                                <div
                                    className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-primary transition-colors">
                                    Territorios <span
                                        className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
                                </div>
                                <div
                                    className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Panamá</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Colón</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Chiriquí</span>
                                        </label>
                                    </div>
                                </div>
                            </div>


                            <div className="relative group cursor-pointer">
                                <div
                                    className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-bold text-sm hover:text-primary transition-colors">
                                    Subcategorías <span
                                        className="material-symbols-outlined text-[18px] transition-transform group-hover:rotate-180">expand_more</span>
                                </div>
                                <div
                                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-dark rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Gestor Cultural</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Artista
                                                Independiente</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Museo Estatal</span>
                                        </label>
                                        <label
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                            <input type="checkbox"
                                                className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Festival Regional</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>


                <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Mostrando 6 de 2,400 resultados</p>
                    <select
                        className="bg-transparent border-none text-slate-600 dark:text-slate-300 font-medium focus:ring-0 cursor-pointer">
                        <option>Más Relevantes</option>
                        <option>Más Recientes</option>
                        <option>A - Z</option>
                    </select>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">


                    <div
                        className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src="https://picsum.photos/seed/dir1/600/400" alt="Imagen de recurso"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div
                                className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
                                Espacio
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3
                                className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                Teatro Nacional de Panamá</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">Uno de los
                                espacios
                                escénicos más importantes e históricos de la ciudad.</p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>Casco Antiguo, Panamá</span>
                            </div>

                            <a href="#"
                                className="mt-auto w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors">Ver
                                Perfil</a>
                        </div>
                    </div>


                    <div
                        className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src="https://picsum.photos/seed/dir2/600/400" alt="Imagen de recurso"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div
                                className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
                                Agente Cultural
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3
                                className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                Orquesta Sinfónica Nacional</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">Institución
                                musical
                                de gran prestigio encargada de difundir la música sinfónica.</p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>Ciudad de Panamá, Panamá</span>
                            </div>

                            <a href="#"
                                className="mt-auto w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors">Ver
                                Perfil</a>
                        </div>
                    </div>


                    <div
                        className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                        <div
                            className="h-48 overflow-hidden relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                            <span
                                className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 transition-transform duration-700 group-hover:scale-110">theater_comedy</span>
                            <div
                                className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
                                Manifestación
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3
                                className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                Danza del Gran Diablo</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">Danza tradicional
                                folclórica que representa la lucha entre el bien y el mal.</p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>La Chorrera, Panamá Oeste</span>
                            </div>

                            <a href="#"
                                className="mt-auto w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors">Ver
                                Perfil</a>
                        </div>
                    </div>


                    <div
                        className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                        <div
                            className="h-48 overflow-hidden relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                            <span
                                className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 transition-transform duration-700 group-hover:scale-110">group</span>
                            <div
                                className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
                                Agrupación
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3
                                className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                Club de Lectura "Las líneas"</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">Grupo
                                independiente
                                enfocado en la promoción de literatura nacional.</p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>David, Chiriquí</span>
                            </div>

                            <a href="#"
                                className="mt-auto w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors">Ver
                                Perfil</a>
                        </div>
                    </div>


                    <div
                        className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src="https://picsum.photos/seed/dir5/600/400" alt="Imagen de recurso"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div
                                className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
                                Espacio
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3
                                className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                Museo del Canal Interoceánico</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">Recinto histórico
                                dedicado a la historia del canal de Panamá.</p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>Casco Antiguo, Panamá</span>
                            </div>

                            <a href="#"
                                className="mt-auto w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors">Ver
                                Perfil</a>
                        </div>
                    </div>


                    <div
                        className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src="https://picsum.photos/seed/dir6/600/400" alt="Imagen de recurso"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div
                                className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-700 dark:text-slate-300">
                                Agente Cultural
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3
                                className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                Rómulo Castro</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-1">Cantautor
                                panameño y
                                exponente importante de la música contemporánea.</p>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                <span>Panamá</span>
                            </div>

                            <a href="#"
                                className="mt-auto w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors">Ver
                                Perfil</a>
                        </div>
                    </div>

                </div>


                <div className="mt-12 flex justify-center items-center gap-2">
                    <button
                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors disabled:opacity-50"
                        disabled>
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                        className="w-10 h-10 rounded-lg bg-primary text-white font-bold flex items-center justify-center shadow-md">1</button>
                    <button
                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">2</button>
                    <button
                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">3</button>
                    <span className="text-slate-500 mx-2">...</span>
                    <button
                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">12</button>
                    <button
                        className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
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
