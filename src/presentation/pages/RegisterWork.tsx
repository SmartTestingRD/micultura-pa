/* eslint-disable */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, CheckCircle, HelpCircle, FileImage, FileText, ChevronRight, ChevronLeft, Save, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SidebarPortal } from '../components/portal/SidebarPortal';
import { HeaderPortal } from '../components/portal/HeaderPortal';

type Status = 'draft' | 'review' | 'approved' | 'rejected' | 'paused';

export default function RegisterWork() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();

    // TODO: implement with real API getWorks
    // const addWork = (work: any) => console.log('Saving work', work);
    const works: any[] = []; // temporary mock
    const isEditing = !!id;

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saveDraft, setSaveDraft] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showModal, setShowModal] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // DYNAMIC FIELDS
    const [mainType, setMainType] = useState('obra');
    const [subType, setSubType] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        techniques: '',
        dimensions: '',
        year: new Date().getFullYear().toString(),
        seriesCount: '1',
        // Ficha fields
        sectors: [] as string[],
        locationType: 'física' as 'física' | 'virtual',
        address: '',
        phone: '',
        email: '',
        website: '',
        socials: { facebook: '', instagram: '', x: '' },
        videoUrl: '',
        coverage: ''
    });

    const [images, setImages] = useState<string[]>([]);
    const [members, setMembers] = useState<{ name: string, role: string }[]>([]);
    const [artisticRoles, setArtisticRoles] = useState<string[]>([]);
    const [services, setServices] = useState<string[]>([]);

    useEffect(() => {
        if (isEditing && id) {
            const existingWork = works.find(w => w.id.toString() === id);
            if (existingWork) {
                const isFicha = !!existingWork.subcategory;
                setMainType(isFicha ? 'agente' : 'obra'); // simplistic

                setFormData({
                    title: existingWork.title,
                    category: existingWork.category,
                    description: existingWork.description,
                    techniques: '',
                    dimensions: '',
                    year: existingWork.yearStarted || new Date().getFullYear().toString(),
                    seriesCount: existingWork.seriesCount ? existingWork.seriesCount.toString() : '1',
                    sectors: existingWork.sectors || [],
                    locationType: existingWork.locationType || 'física',
                    address: existingWork.address || '',
                    phone: existingWork.phone || '',
                    email: existingWork.email || '',
                    website: existingWork.website || '',
                    socials: (existingWork.socials as { facebook: string; instagram: string; x: string }) || { facebook: '', instagram: '', x: '' },
                    videoUrl: existingWork.videoUrl || '',
                    coverage: existingWork.coverage || ''
                });

                if (existingWork.subcategory) setSubType(existingWork.subcategory);
                if (existingWork.members) setMembers(existingWork.members);
                if (existingWork.artisticRoles) setArtisticRoles(existingWork.artisticRoles);
                if (existingWork.services) setServices(existingWork.services);

                if (existingWork.imageUrl) {
                    setImages([existingWork.imageUrl]);
                } else {
                    setImages([`https://picsum.photos/seed/${existingWork.id}/800/600`]);
                }
            }
        }
    }, [isEditing, id, works]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleMainTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMainType(e.target.value);
        setSubType(''); // reset subType
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newImages = Array.from(e.target.files).map(f => URL.createObjectURL(f));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Ficha dynamic interactions
    const toggleSector = (sector: string) => {
        const current = formData.sectors;
        setFormData({ ...formData, sectors: current.includes(sector) ? current.filter(s => s !== sector) : [...current, sector] });
    };
    const toggleRole = (role: string) => {
        setArtisticRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
    };
    const toggleService = (service: string) => {
        setServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]);
    };
    const addMember = () => setMembers([...members, { name: '', role: '' }]);
    const updateMember = (index: number, field: 'name' | 'role', value: string) => {
        const newArr = [...members];
        newArr[index][field] = value;
        setMembers(newArr);
    };
    const removeMember = (index: number) => setMembers(members.filter((_, i) => i !== index));


    const handleNext = () => {
        const newErrors: Record<string, string> = {};

        if (currentStep === 1) {
            if (!formData.title.trim()) newErrors.title = 'El título / nombre es requerido.';
            if (mainType === 'obra' && !formData.category) newErrors.category = 'Seleccione una categoría.';
            if (mainType !== 'obra' && !subType) newErrors.subType = 'Seleccione una sub-clasificación.';
        } else if (currentStep === 2) {
            if (!formData.description.trim()) newErrors.description = 'La descripción conceptual es requerida.';

            // Ficha conditions
            if (mainType !== 'obra') {
                if (subType === 'Agrupaciones' && members.length === 0) newErrors.members = 'Añada integrantes.';
                if (subType === 'Personas' && artisticRoles.length === 0) newErrors.roles = 'Seleccione roles.';
                if (subType === 'Empresas y emprendimientos' && services.length === 0) newErrors.services = 'Seleccione servicios.';
            }
        } else if (currentStep === 3) {
            if (images.length === 0 && mainType === 'obra') newErrors.images = 'Debe subir al menos una imagen.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setCurrentStep(prev => prev + 1);
    };
    const handlePrev = () => setCurrentStep(prev => prev - 1);

    const getPayload = (status: Status) => {
        return {
            title: formData.title || 'Borrador sin título',
            description: formData.description,
            category: mainType === 'obra' ? formData.category : (mainType === 'agente' ? 'Agentes culturales' : 'Espacios / Eventos'),
            subcategory: mainType !== 'obra' ? subType : undefined,
            seriesCount: mainType === 'obra' && parseInt(formData.seriesCount) > 1 ? parseInt(formData.seriesCount) : undefined,
            status: status,
            imageUrl: images.length > 0 ? images[0] : undefined,
            views: 0,
            likes: 0,
            // Extensions
            sectors: mainType !== 'obra' ? formData.sectors : undefined,
            yearStarted: formData.year,
            locationType: formData.locationType,
            address: formData.address,
            phone: formData.phone,
            email: formData.email,
            website: formData.website,
            socials: formData.socials,
            videoUrl: formData.videoUrl,
            artisticRoles: subType === 'Personas' ? artisticRoles : undefined,
            services: subType === 'Empresas y emprendimientos' ? services : undefined,
            coverage: subType === 'Empresas y emprendimientos' ? formData.coverage : undefined,
            members: subType === 'Agrupaciones' ? members : undefined,
        };
    };

    const handleSaveDraft = async () => {
        setSaveDraft(true);
        setSubmitError('');
        try {
            const response = await fetch('/api/portal/works/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(getPayload('draft'))
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Error al guardar borrador');
            }

            navigate('/obras');
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setSaveDraft(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch('/api/portal/works/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(getPayload('review'))
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Error al enviar a revisión');
            }

            setShowModal(true);
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const [SECTORS, setSectorsList] = useState<{ value: string, name: string }[]>([]);
    const [ROLES, setRolesList] = useState<{ value: string, name: string }[]>([]);
    const [SERVICES, setServicesList] = useState<{ value: string, name: string }[]>([]);
    const [MAIN_TYPES, setMainTypes] = useState<{ value: string, name: string }[]>([]);
    const [SUB_TYPES, setSubTypesList] = useState<{ value: string, name: string }[]>([]);
    const [CATEGORIES, setCategoriesList] = useState<{ value: string, name: string }[]>([]);

    useEffect(() => {
        const fetchCatalogs = async () => {
            try {
                const res = await fetch('/api/portal/catalogs/register-options');
                if (res.ok) {
                    const data = await res.json();
                    if (data.sectors?.length) setSectorsList(data.sectors);
                    if (data.roles?.length) setRolesList(data.roles);
                    if (data.services?.length) setServicesList(data.services);
                    if (data.registerTypes?.length) setMainTypes(data.registerTypes);
                    if (data.subClassifications?.length) setSubTypesList(data.subClassifications);
                    if (data.workCategories?.length) setCategoriesList(data.workCategories);
                }
            } catch (error) {
                console.error("Error cargando catálogos de registro", error);
            }
        };
        fetchCatalogs();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc] flex font-sans">
            <SidebarPortal isPublished={true} />

            <div className="flex-1 flex flex-col min-w-0">
                <HeaderPortal />

                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 dashboard-container">
                    <div className="register-container animate-fade-in w-full max-w-5xl mx-auto">
                        <div className="flex-header mb-6 mt-4">
                            <div>
                                <h1 className="page-title text-[28px] font-extrabold text-[#0f172a] tracking-tight mb-2">
                                    {isEditing ? 'Editar Registro' : 'Registrar Nueva Obra o Ficha'}
                                </h1>
                                <p className="page-subtitle text-[15px] text-[#64748b]">
                                    {isEditing ? 'Actualiza los datos.' : 'Obtén un código QR para tus obras, o crea tu ficha en el Directorio Cultura.'}
                                </p>
                            </div>
                        </div>

                        <div className="stepper mb-8">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className={`step-item ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                                    <div className="step-circle">{currentStep > step ? <CheckCircle size={16} /> : step}</div>
                                    <span className="step-label">
                                        {step === 1 ? 'Info Básica' : step === 2 ? 'Detalles Técnicos' : step === 3 ? 'Fotografías' : 'Revisión'}
                                    </span>
                                    {step < 4 && <div className="step-line"></div>}
                                </div>
                            ))}
                        </div>

                        <div className="form-layout">
                            <div className="details-section card" style={{ gridColumn: '1 / -1' }}>
                                <form id="work-form" onSubmit={(e) => e.preventDefault()}>

                                    {/* PASO 1: Info Básica */}
                                    {currentStep === 1 && (
                                        <div className="wizard-step animate-fade-in">
                                            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <FileText size={20} className="mr-2" style={{ color: '#0f172a' }} />
                                                1. Información Principal
                                            </h3>

                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label className="form-label">Tipo de Registro *</label>
                                                    <select
                                                        className="form-select"
                                                        value={mainType}
                                                        onChange={handleMainTypeChange}
                                                    >
                                                        {MAIN_TYPES.map(type => (
                                                            <option key={type.value} value={type.value}>{type.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {mainType === 'agente' && (
                                                    <div className="form-group">
                                                        <label className="form-label">Sub-clasificación *</label>
                                                        <select
                                                            className={`form-select ${errors.subType ? 'input-error' : ''}`}
                                                            value={subType}
                                                            onChange={(e) => setSubType(e.target.value)}
                                                        >
                                                            <option value="">Seleccione una...</option>
                                                            {SUB_TYPES.map(sub => (
                                                                <option key={sub.value} value={sub.value}>{sub.name}</option>
                                                            ))}
                                                        </select>
                                                        {errors.subType && <span className="error-text mt-1 block">{errors.subType}</span>}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">{mainType === 'obra' ? 'Título de la Obra o Serie' : 'Nombre del Perfil o Entidad'} *</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    className={`form-input form-input-lg ${errors.title ? 'input-error' : ''}`}
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                    placeholder="Ej: Vasija Tradicional con Diseños Naturales"
                                                />
                                                {errors.title && <span className="error-text">{errors.title}</span>}
                                            </div>

                                            <div className="form-grid">
                                                {mainType === 'obra' ? (
                                                    <div className="form-group">
                                                        <label className="form-label">Categoría *</label>
                                                        <select
                                                            name="category"
                                                            className={`form-select ${errors.category ? 'input-error' : ''}`}
                                                            value={formData.category}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Seleccione una...</option>
                                                            {CATEGORIES.map(cat => (
                                                                <option key={cat.value} value={cat.value}>{cat.name}</option>
                                                            ))}
                                                        </select>
                                                        {errors.category && <span className="error-text">{errors.category}</span>}
                                                    </div>
                                                ) : (
                                                    <div className="form-group">
                                                        <label className="form-label">Sector Principal</label>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {SECTORS.map(sector => sector.name).map(s => (
                                                                <button
                                                                    key={s} type="button"
                                                                    onClick={() => toggleSector(s)}
                                                                    className={`tag-btn ${formData.sectors.includes(s) ? 'tag-btn-primary active' : ''}`}
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="form-group">
                                                    <label className="form-label">{mainType === 'obra' ? 'Año de Creación' : 'Año de Inicio'}</label>
                                                    <input
                                                        type="text"
                                                        name="year"
                                                        className="form-input"
                                                        value={formData.year}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 2: Detalles Técnicos */}
                                    {currentStep === 2 && (
                                        <div className="wizard-step animate-fade-in">
                                            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <FileText size={20} className="mr-2" style={{ color: '#0f172a' }} />
                                                2. Profundidad {mainType === 'obra' ? 'Técnica y Conceptual' : 'y Contacto'}
                                            </h3>

                                            <div className="form-group">
                                                <label className="form-label">{mainType === 'obra' ? 'Descripción Técnica / Conceptual' : 'Reseña / Biografía'} *</label>
                                                <textarea
                                                    name="description"
                                                    className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                                                    rows={5}
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    placeholder="Describe el significado, la inspiración y los detalles."
                                                ></textarea>
                                                {errors.description && <span className="error-text">{errors.description}</span>}
                                            </div>

                                            {mainType === 'obra' ? (
                                                <>
                                                    <div className="form-grid">
                                                        <div className="form-group">
                                                            <label className="form-label">Técnicas y Materiales (Opcional)</label>
                                                            <input
                                                                type="text"
                                                                name="techniques"
                                                                className="form-input"
                                                                value={formData.techniques}
                                                                onChange={handleChange}
                                                                placeholder="Ej: Barro moldeado a mano, tintes naturales..."
                                                            />
                                                        </div>

                                                        <div className="form-group">
                                                            <label className="form-label">Dimensiones (Opcional)</label>
                                                            <input
                                                                type="text"
                                                                name="dimensions"
                                                                className="form-input"
                                                                value={formData.dimensions}
                                                                onChange={handleChange}
                                                                placeholder="Ej: 30cm x 40cm x 15cm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="divider"></div>

                                                    <div className="form-group series-group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="form-label mb-0">¿Es un elemento de una serie? (Múltiples unidades iguales)</label>
                                                        </div>
                                                        <p className="text-xs text-muted mb-3">
                                                            Si esta obra tiene múltiples unidades casi idénticas, indica la cantidad. Generaremos sub-códigos para cada una.
                                                        </p>

                                                        <div className="input-with-suffix" style={{ display: 'flex', alignItems: 'center' }}>
                                                            <input
                                                                type="number"
                                                                name="seriesCount"
                                                                className="form-input"
                                                                style={{ maxWidth: '120px' }}
                                                                min="1"
                                                                max="500"
                                                                value={formData.seriesCount}
                                                                onChange={handleChange}
                                                            />
                                                            <span className="ml-3 text-sm text-gray-500 font-semibold">Unidades / Piezas</span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* AGENTE FIELDS */}
                                                    <div className="form-grid">
                                                        <div className="form-group">
                                                            <label className="form-label">Dirección Física (Ciudad / Corregimiento)</label>
                                                            <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="form-label">Teléfono / WhatsApp</label>
                                                            <input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleChange} />
                                                        </div>
                                                    </div>

                                                    {subType === 'Agrupaciones' && (
                                                        <div className="form-group" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                                                            <label className="form-label">Integrantes</label>
                                                            {members.map((m, i) => (
                                                                <div key={i} className="flex gap-2 mb-2 items-center">
                                                                    <input type="text" placeholder="Nombre completo" className="form-input flex-1" value={m.name} onChange={(e) => updateMember(i, 'name', e.target.value)} />
                                                                    <input type="text" placeholder="Rol (Ej: Vocalista)" className="form-input w-1/3" value={m.role} onChange={(e) => updateMember(i, 'role', e.target.value)} />
                                                                    <button type="button" onClick={() => removeMember(i)} className="text-red-500 p-2 hover:bg-red-50 rounded font-bold">X</button>
                                                                </div>
                                                            ))}
                                                            <button type="button" onClick={addMember} className="text-sm text-primary font-bold mt-2">+ Añadir integrante</button>
                                                            {errors.members && <p className="text-red-600 text-xs mt-1">{errors.members}</p>}
                                                        </div>
                                                    )}

                                                    {subType === 'Personas' && (
                                                        <div className="form-group" style={{ padding: '1rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '0.5rem' }}>
                                                            <label className="form-label" style={{ color: '#6b21a8' }}>Tus Roles Artísticos *</label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {ROLES.map(role => role.name).map(r => (
                                                                    <button key={r} type="button" onClick={() => toggleRole(r)} className={`tag-btn ${artisticRoles.includes(r) ? 'tag-btn-purple active' : ''}`}>{r}</button>
                                                                ))}
                                                            </div>
                                                            {errors.roles && <p className="text-red-600 text-xs mt-1">{errors.roles}</p>}
                                                        </div>
                                                    )}

                                                    {subType === 'Empresas y emprendimientos' && (
                                                        <div className="form-group" style={{ padding: '1rem', background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '0.5rem' }}>
                                                            <label className="form-label" style={{ color: '#065f46' }}>Tus Servicios Comerciales *</label>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {SERVICES.map(service => service.name).map(s => (
                                                                    <button key={s} type="button" onClick={() => toggleService(s)} className={`tag-btn ${services.includes(s) ? 'tag-btn-emerald active' : ''}`}>{s}</button>
                                                                ))}
                                                            </div>
                                                            <input type="text" name="coverage" placeholder="Área de cobertura (Ej: Todo Panamá)" className="form-input" value={formData.coverage} onChange={handleChange} />
                                                            {errors.services && <p className="text-red-600 text-xs mt-1">{errors.services}</p>}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* PASO 3: Fotografías y Confirmación */}
                                    {currentStep === 3 && (
                                        <div className="wizard-step animate-fade-in">
                                            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <FileImage size={20} className="mr-2" style={{ color: '#0f172a' }} />
                                                3. Registro Fotográfico
                                            </h3>

                                            <div className="media-section" style={{ maxWidth: '600px' }}>
                                                <p className="text-sm text-muted mb-4">
                                                    Sube fotografías claras. Máx 5 fotos (JPG, PNG). El equipo de revisión usará esto para validar tu pieza o perfil.
                                                </p>

                                                <div className="upload-area mb-4">
                                                    <input
                                                        type="file"
                                                        id="file-upload"
                                                        className="hidden"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                    <label htmlFor="file-upload" className="upload-label">
                                                        <Upload size={32} className="mb-2" style={{ color: 'var(--text-muted)' }} />
                                                        <span className="font-semibold" style={{ color: '#0f172a' }}>Haz clic para subir fotos</span>
                                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>o arrastra y suelta aquí</span>
                                                    </label>
                                                </div>

                                                {images.length > 0 && (
                                                    <div className="image-preview-grid mb-6">
                                                        {images.map((url, i) => (
                                                            <div key={i} className="preview-card">
                                                                <img src={url} alt={`Preview ${i}`} />
                                                                <button
                                                                    type="button"
                                                                    className="remove-img-btn"
                                                                    onClick={() => removeImage(i)}
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {images.length === 0 && (
                                                    <div className="empty-images text-center p-4 border rounded-lg bg-gray-50 border-dashed mb-6">
                                                        <span className="text-sm text-muted">Aún no hay imágenes. Será guardado como borrador si no incluyes foto.</span>
                                                    </div>
                                                )}

                                                <div className="card bg-blue-light border-blue">
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <HelpCircle size={20} className="mr-3" style={{ color: '#0f172a', flexShrink: 0, marginTop: '0.25rem' }} />
                                                        <div>
                                                            <h4 className="font-semibold text-primary mb-1">¿Qué pasa después de enviar?</h4>
                                                            <p className="text-sm text-muted">
                                                                Tu registro pasará a estado <strong>"En Revisión"</strong>. Nuestro equipo evaluará los datos. Si todo está correcto, será <strong>Aprobado</strong> y se generará automáticamente tu Ficha o Código QR público.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 4: Revisión Final */}
                                    {currentStep === 4 && (
                                        <div className="wizard-step animate-fade-in">
                                            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                                                <Eye size={20} className="mr-2" style={{ color: '#0f172a' }} />
                                                4. Revisión Final
                                            </h3>

                                            <div className="review-summary bg-white p-6 rounded-lg border mb-6">
                                                <h4 className="font-semibold text-primary mb-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Información Básica</h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                                    <div>
                                                        <p className="text-xs text-muted mb-1">Título / Nombre</p>
                                                        <p className="font-semibold text-sm">{formData.title}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted mb-1">{mainType === 'obra' ? 'Categoría' : 'Sub-clasificación'}</p>
                                                        <p className="font-semibold text-sm">{mainType === 'obra' ? formData.category : subType}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted mb-1">Año</p>
                                                        <p className="font-semibold text-sm">{formData.year || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <h4 className="font-semibold text-primary mb-4" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Detalles</h4>
                                                <div className="mb-6">
                                                    <p className="text-xs text-muted mb-1">Descripción</p>
                                                    <p className="text-sm">{formData.description}</p>
                                                </div>

                                                <div className="card bg-[#f8fafc] border-[#e2e8f0] border rounded-lg p-4 mt-4">
                                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                        <CheckCircle size={20} className="mr-3" style={{ color: '#0f172a', flexShrink: 0, marginTop: '0.25rem' }} />
                                                        <div>
                                                            <h4 className="font-semibold text-[#0f172a] mb-1">Confirmación de Envío</h4>
                                                            <p className="text-sm text-slate-500">
                                                                Al enviar esta obra declaras que la información anterior es precisa y corresponde a tu autoría.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="divider"></div>

                                    {/* WIZARD NAVIGATION CONTROLS */}
                                    <div className="form-actions mt-10 pt-6 flex justify-between items-center border-t border-slate-100">
                                        <div>
                                            <button
                                                type="button"
                                                className="btn-outline flex items-center px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                                onClick={handleSaveDraft}
                                                disabled={isSubmitting || saveDraft}
                                            >
                                                <Save size={16} className="mr-2" />
                                                {saveDraft ? 'Guardando...' : 'Guardar Borrador'}
                                            </button>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {currentStep > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn-outline flex items-center px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                                    onClick={handlePrev}
                                                >
                                                    <ChevronLeft size={16} className="mr-1" /> Atrás
                                                </button>
                                            )}

                                            {currentStep < 4 ? (
                                                <button
                                                    type="button"
                                                    className="btn-solid flex items-center px-6 py-2.5 rounded-lg bg-[#0f172a] text-white font-medium hover:bg-[#1e293b] transition-colors"
                                                    onClick={handleNext}
                                                >
                                                    Siguiente <ChevronRight size={16} className="ml-1" />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn-solid flex items-center px-6 py-2.5 rounded-lg bg-[#0f172a] text-white font-medium hover:bg-[#1e293b] transition-colors"
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting || saveDraft}
                                                >
                                                    {isSubmitting ? 'Enviando...' : <><CheckCircle size={18} className="mr-2" /> Enviar a Revisión</>}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {submitError && (
                                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm text-center font-medium border border-red-200">
                                            {submitError}
                                        </div>
                                    )}

                                    {errors.images && (
                                        <p className="text-xs text-red-600 text-right mt-2 font-semibold" style={{ color: '#dc2626' }}>
                                            * {errors.images}
                                        </p>
                                    )}
                                    {currentStep === 4 && (
                                        <p className="text-xs text-secondary text-right mt-2 font-semibold">
                                            * Revisa con cuidado antes de someter definitivamente.
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>

                        {showModal && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <div className="success-icon-container">
                                            <CheckCircle size={48} className="text-green-600" style={{ color: '#16a34a' }} />
                                        </div>
                                        <h2 className="modal-title font-bold text-primary">¡Obra Recibida Exitosamente!</h2>
                                    </div>
                                    <p className="modal-description text-muted">
                                        Tu registro ha pasado a estado <strong>En Revisión</strong>. Nuestro equipo evaluará los datos e imágenes proporcionadas para validar su autenticidad.
                                    </p>
                                    <button className="btn-primary modal-action-btn" onClick={() => navigate('/obras')}>Entendido, ir al Tablero</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <style>{`
            /* Layout & Spacing Defaults */
            .form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
                margin-bottom: 1.5rem;
            }
            @media (max-width: 768px) {
                .form-grid {
                    grid-template-columns: 1fr;
                }
            }
            .form-group {
                margin-bottom: 1.5rem;
            }
            .form-grid .form-group {
                margin-bottom: 0px;
            }
            .mb-2 { margin-bottom: 0.5rem; }
            .mb-3 { margin-bottom: 0.75rem; }
            .mb-4 { margin-bottom: 1rem; }
            .mb-6 { margin-bottom: 1.5rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mt-1 { margin-top: 0.25rem; }
            .mt-2 { margin-top: 0.5rem; }
            .mt-4 { margin-top: 1rem; }
            .mt-6 { margin-top: 1.5rem; }
            .gap-2 { gap: 0.5rem; }
            .gap-3 { gap: 0.75rem; }
            .gap-4 { gap: 1rem; }
            
            .divider {
                height: 1px;
                background: var(--border);
                margin: 1.5rem 0;
            }
            
            .mr-1 { margin-right: 0.25rem; }
            .mr-2 { margin-right: 0.5rem; }
            .mr-3 { margin-right: 0.75rem; }
            .mr-4 { margin-right: 1rem; }
            .ml-1 { margin-left: 0.25rem; }
            .ml-2 { margin-left: 0.5rem; }
            .ml-3 { margin-left: 0.75rem; }
            .ml-4 { margin-left: 1rem; }
            
            /* Tag Buttons */
            .tag-btn {
                padding: 0.35rem 0.75rem;
                font-size: 0.85rem;
                border-radius: 9999px;
                border: 1px solid var(--border);
                background: white;
                color: var(--text-muted);
                transition: all 0.2s;
                font-weight: 500;
            }
            .tag-btn:hover {
                border-color: var(--primary);
                color: var(--primary);
            }
            .tag-btn-purple.active {
                background: #9333ea;
                border-color: #9333ea;
                color: white;
            }
            .tag-btn-emerald.active {
                background: #059669;
                border-color: #059669;
                color: white;
            }
            .tag-btn-primary.active {
                background: var(--primary);
                border-color: var(--primary);
                color: white;
            }

            /* Error States */
            .error-text {
                color: #dc2626;
                font-size: 0.75rem;
                margin-top: 0.35rem;
                display: block;
                font-weight: 500;
            }
            .input-error {
                border-color: #f87171 !important;
                box-shadow: 0 0 0 1px #f87171 !important;
            }

            /* Stepper CSS */
            .stepper {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: white;
                padding: 1rem 2rem;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                overflow-x: auto;
            }

            .step-item {
                display: flex;
                align-items: center;
                position: relative;
                color: #64748b;
            }

            .step-item.active {
                color: #0f172a;
                font-weight: 600;
            }

            .step-item.completed {
                color: #0f172a;
            }

            .step-circle {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: white;
                border: 2px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.875rem;
                font-weight: 700;
                margin-right: 0.75rem;
                transition: all 0.2s;
            }

            .step-item.active .step-circle {
                border-color: #0f172a;
                background: white;
                color: #0f172a;
            }

            .step-item.completed .step-circle {
                background: #f8fafc;
                border-color: #e2e8f0;
                color: #64748b;
            }

            .step-label {
                white-space: nowrap;
                font-size: 0.9rem;
            }

            .step-line {
                flex-grow: 1;
                min-width: 30px;
                height: 1px;
                background: #e2e8f0;
                margin: 0 1.5rem;
            }

            .step-item.completed .step-line {
                background: #e2e8f0;
            }
            
            /* Form elements */
            .form-label {
                display: block;
                font-size: 0.85rem;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 0.5rem;
                letter-spacing: 0.01em;
            }
            .form-input, .form-select, .form-textarea {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                font-size: 0.95rem;
                color: #0f172a;
                background-color: white;
                transition: all 0.2s;
                outline: none;
            }
            .form-input:focus, .form-select:focus, .form-textarea:focus {
                border-color: #0f172a;
                box-shadow: 0 0 0 1px #0f172a;
            }
            .card {
                background: white;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                padding: 2rem;
            }
            .section-title {
                font-size: 1.15rem;
                font-weight: 800;
                color: #0f172a;
            }

            /* CSS cleanup */

            /* UPLOAD AREA */
            .upload-area {
                border: 2px dashed #e2e8f0;
                border-radius: 12px;
                background-color: #f8fafc;
                transition: all 0.2s;
            }
            .upload-area:hover {
                border-color: #0f172a;
                background-color: white;
            }
            .upload-label {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2.5rem 1rem;
                cursor: pointer;
                width: 100%;
            }

            /* IMAGE GRID */
            .image-preview-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
                gap: 0.75rem;
            }
            .preview-card {
                position: relative;
                aspect-ratio: 1;
                border-radius: var(--radius);
                overflow: hidden;
                background: var(--border);
            }
            .preview-card img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .remove-img-btn {
                position: absolute;
                top: 4px;
                right: 4px;
                width: 20px;
                height: 20px;
                background: rgba(0,0,0,0.6);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                line-height: 1;
                cursor: pointer;
                border: none;
            }
            .remove-img-btn:hover {
                background: var(--secondary);
            }

            /* MODAL CSS */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(15, 23, 42, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(8px);
                padding: 1rem;
            }
            .modal-content {
                background: #ffffff;
                border-radius: 1rem;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                width: 90%;
                max-width: 480px;
                border: 1px solid rgba(226, 232, 240, 0.8);
                animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                padding: 2.5rem 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            @keyframes modalSlideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .modal-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            .modal-title {
                font-size: 1.5rem;
                letter-spacing: -0.025em;
                margin-top: 1.25rem;
                margin-bottom: 0;
                color: #0f172a;
            }
            .modal-description {
                font-size: 1.05rem;
                line-height: 1.6;
                margin-bottom: 2rem;
            }
            .modal-action-btn {
                width: 100%;
                padding: 0.85rem;
                font-size: 1rem;
                font-weight: 600;
                letter-spacing: 0.3px;
                border-radius: 0.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .success-icon-container {
                width: 96px;
                height: 96px;
                border-radius: 50%;
                background: #dcfce7;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media (max-width: 640px) {
                .step-label { display: none; }
                .step-item.completed {
                color: #0f172a;
            }
            `}
                    </style>
                </main>
            </div>
        </div>
    );
}
