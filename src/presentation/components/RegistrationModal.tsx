import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { setSession } = useAuth();

    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const [emailStr, setEmailStr] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [acceptData, setAcceptData] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    // New Profile Fields
    const [profileType, setProfileType] = useState('CITIZEN'); // CITIZEN, CULTURAL_AGENT, SPACE
    const [profileName, setProfileName] = useState('');

    // Legacy Metadata Fields
    const [agentSubcategory, setAgentSubcategory] = useState('');
    const [agentStartYear, setAgentStartYear] = useState('');
    const [agentStudiesLevel, setAgentStudiesLevel] = useState('');
    const [agentInstagram, setAgentInstagram] = useState('');
    const [agentFacebook, setAgentFacebook] = useState('');

    const [spaceCapacity, setSpaceCapacity] = useState('');
    const [spaceManagementType, setSpaceManagementType] = useState('');
    const [spaceAccessType, setSpaceAccessType] = useState('');
    const [spacePaymentScheme, setSpacePaymentScheme] = useState('');
    const [spaceHistoricalHeritage, setSpaceHistoricalHeritage] = useState(false);

    const [otpId, setOtpId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const isAgentValid = profileType === 'CULTURAL_AGENT' ? Boolean(agentSubcategory && agentStartYear && agentStudiesLevel) : true;
    const isSpaceValid = profileType === 'SPACE' ? Boolean(spaceCapacity && spaceManagementType && spaceAccessType && spacePaymentScheme) : true;

    const [currentStep, setCurrentStep] = useState(1);

    const isStep1Valid = Boolean(fullName.trim()) && acceptData && acceptTerms && acceptPrivacy && (profileType === 'CITIZEN' || (Boolean(profileName.trim()) && isAgentValid && isSpaceValid));
    const isEmailValid = Boolean(emailStr) && RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}').test(emailStr);
    const isStep2Valid = otpSent && otpCode.length === 6;

    // Dynamic Catalogs State
    const [catalogs, setCatalogs] = useState<Record<string, { value: string, label: string }[]>>({});

    useEffect(() => {
        if (isOpen && Object.keys(catalogs).length === 0) {
            fetch('/api/catalogs')
                .then(res => res.json())
                .then(data => setCatalogs(data))
                .catch(err => console.error("Error fetching catalogs", err));
        }
    }, [isOpen]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpSent && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            // Optional: Handle countdown reaching zero (e.g., allow resend)
        }
        return () => clearInterval(timer);
    }, [otpSent, countdown]);

    const handleValidateEmail = async () => {
        if (!emailStr || !RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}').test(emailStr)) {
            setErrorMsg("Por favor, introduzca un correo electrónico válido.");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);
        try {
            const response = await fetch('/api/otp/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailStr }),
            });

            if (!response.ok) {
                let errorDetails = 'Failed to send OTP';
                try {
                    const data = await response.json();
                    errorDetails = data.error || errorDetails;
                } catch (e) {
                    errorDetails = `Server error: ${response.statusText}`;
                }
                throw new Error(errorDetails);
            }

            const data = await response.json();
            setOtpId(data.otpId);
            setOtpSent(true);
            setCountdown(300); // Reset timer to 5 minutes
        } catch (error: any) {
            console.error('Error validation email:', error);
            setErrorMsg(error.message || "Error al enviar el código de verificación.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!isStep1Valid || !isStep2Valid) {
            setErrorMsg("Por favor, completa todos los campos requeridos correctamente.");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        try {
            const response = await fetch('/api/otp/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    otpId,
                    email: emailStr,
                    otpCode,
                    full_name: fullName,
                    phone_number: phoneNumber,
                    authorizes_data_treatment: acceptData,
                    accepts_terms_conditions: acceptTerms,
                    accepts_privacy_policy: acceptPrivacy,
                    profile_type: profileType,
                    profile_name: profileName,
                    profile_metadata: profileType === 'CULTURAL_AGENT'
                        ? {
                            sic_subcategory: agentSubcategory,
                            sic_activities_start_year: agentStartYear,
                            sic_studies_level: agentStudiesLevel,
                            sic_contact_instagram: agentInstagram,
                            sic_contact_facebook: agentFacebook
                        }
                        : profileType === 'SPACE'
                            ? {
                                sic_capacity: spaceCapacity,
                                sic_spaces_management_type: spaceManagementType,
                                sic_access_type: spaceAccessType,
                                sic_payment_scheme: spacePaymentScheme,
                                sic_historical_heritage_property: spaceHistoricalHeritage
                            }
                            : {}
                }),
            });

            if (!response.ok) {
                let errorDetails = 'Código OTP inválido o expirado.';
                try {
                    const data = await response.json();
                    errorDetails = data.error || errorDetails;
                } catch (e) {
                    errorDetails = `Server error: ${response.statusText}`;
                }
                throw new Error(errorDetails);
            }

            const data = await response.json();

            // OTP Validated! 
            if (data.token && data.user) {
                setSession(data.token, data.user);
            } else if (data.token) {
                setSession(data.token, { role: 'citizen' } as any);
            }

            alert("¡Registro exitoso! Tu cuenta ha sido creada y validada correctamente.");
            onClose();
            navigate('/portal');

        } catch (error: any) {
            console.error('Error validating OTP:', error);
            setErrorMsg(error.message || "Error al validar el código OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white dark:bg-surface-dark w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] transition-all duration-300 border border-slate-100 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="p-8">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <img src="/logo_micultura.png" alt="Sicultura Panamá Logo" className="h-14 w-auto mb-4 drop-shadow-sm" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Crea tu Cuenta</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">
                            Únete a Sicultura y conecta con los recursos de Panamá.
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div className="overflow-hidden relative w-full pb-2">
                        <div
                            className="flex transition-transform duration-500 ease-in-out w-[200%]"
                            style={{ transform: `translateX(-${(currentStep - 1) * 50}%)` }}
                        >
                            {/* ---- SLIDE 1: Información Personal y Perfil ---- */}
                            <div className="w-1/2 flex-shrink-0 px-2 flex flex-col space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre completo *</label>
                                        <input type="text" id="reg-name" name="full_name" required
                                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                            placeholder="Tu nombre completo" />
                                    </div>
                                    <div>
                                        <label htmlFor="reg-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teléfono (Opcional)</label>
                                        <input type="tel" id="reg-phone" name="phone_number"
                                            value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                            placeholder="+507 0000-0000" />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label htmlFor="reg-profile" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        ¿Deseas crear un perfil cultural de inmediato?
                                    </label>
                                    <select
                                        id="reg-profile"
                                        value={profileType}
                                        onChange={(e) => setProfileType(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    >
                                        <option value="CITIZEN">No por ahora (Solo cuenta ciudadana)</option>
                                        <option value="CULTURAL_AGENT">Sí, como Agente Cultural (Artista, Gestor)</option>
                                        <option value="SPACE">Sí, como Espacio Cultural (Museo, Teatro, Academia)</option>
                                    </select>
                                </div>

                                {profileType !== 'CITIZEN' && (
                                    <div className="animate-fade-in-up space-y-4">
                                        <div>
                                            <label htmlFor="reg-profile-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                Nombre {profileType === 'SPACE' ? 'del Espacio o Museo' : 'Artístico o de la Agrupación'} *
                                            </label>
                                            <input type="text" id="reg-profile-name" required={profileType !== 'CITIZEN'}
                                                value={profileName} onChange={(e) => setProfileName(e.target.value)}
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                                placeholder="P. Ej. Teatro Nacional" />
                                        </div>

                                        {profileType === 'CULTURAL_AGENT' && (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcategoría *</label>
                                                        <input type="text" required value={agentSubcategory} onChange={(e) => setAgentSubcategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5" placeholder="Ej. Pintor, Músico" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Año de Inicio *</label>
                                                        <input type="number" required value={agentStartYear} onChange={(e) => setAgentStartYear(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5" placeholder="Ej. 2015" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nivel de Estudios *</label>
                                                    <select required value={agentStudiesLevel} onChange={(e) => setAgentStudiesLevel(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5">
                                                        <option value="">Seleccione...</option>
                                                        {catalogs['STUDIES_LEVEL']?.map(item => (
                                                            <option key={item.value} value={item.value}>{item.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Instagram (@)</label>
                                                        <input type="text" value={agentInstagram} onChange={(e) => setAgentInstagram(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5" placeholder="@usuario" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Facebook</label>
                                                        <input type="text" value={agentFacebook} onChange={(e) => setAgentFacebook(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5" placeholder="/pagina" />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {profileType === 'SPACE' && (
                                            <>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacidad (Aforo) *</label>
                                                        <input type="number" required value={spaceCapacity} onChange={(e) => setSpaceCapacity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5" placeholder="Ej. 100" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Gestión *</label>
                                                        <select required value={spaceManagementType} onChange={(e) => setSpaceManagementType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5">
                                                            <option value="">Seleccione...</option>
                                                            {catalogs['SPACE_MANAGEMENT_TYPE']?.map(item => (
                                                                <option key={item.value} value={item.value}>{item.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Acceso *</label>
                                                        <select required value={spaceAccessType} onChange={(e) => setSpaceAccessType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5">
                                                            <option value="">Seleccione...</option>
                                                            {catalogs['SPACE_ACCESS_TYPE']?.map(item => (
                                                                <option key={item.value} value={item.value}>{item.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Esquema de Pago *</label>
                                                        <select required value={spacePaymentScheme} onChange={(e) => setSpacePaymentScheme(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5">
                                                            <option value="">Seleccione...</option>
                                                            {catalogs['SPACE_PAYMENT_SCHEME']?.map(item => (
                                                                <option key={item.value} value={item.value}>{item.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <label className="flex items-center gap-2 mt-2">
                                                    <input type="checkbox" checked={spaceHistoricalHeritage} onChange={(e) => setSpaceHistoricalHeritage(e.target.checked)} className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Es Patrimonio Histórico</span>
                                                </label>
                                            </>
                                        )}

                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                Al completar este registro, tu perfil ingresará al sistema en estado de <b>revisión (oculto)</b> hasta ser aprobado por el Ministerio.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label htmlFor="reg-auth-data" className="flex items-start gap-3 cursor-pointer group">
                                        <div className="flex items-center h-5">
                                            <input type="checkbox" id="reg-auth-data" name="authorizes_data_treatment" required
                                                checked={acceptData} onChange={(e) => setAcceptData(e.target.checked)}
                                                className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-primary transition-colors cursor-pointer" />
                                        </div>
                                        <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                            Autorizo al Ministerio a que recolecte, almacene y trate mis datos personales.
                                        </span>
                                    </label>

                                    <label htmlFor="reg-accept-terms" className="flex items-start gap-3 cursor-pointer group">
                                        <div className="flex items-center h-5">
                                            <input type="checkbox" id="reg-accept-terms" name="accepts_terms_conditions" required
                                                checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                                                className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-primary transition-colors cursor-pointer" />
                                        </div>
                                        <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                            Confirmo que he leído y acepto los Términos y Condiciones.
                                        </span>
                                    </label>

                                    <label htmlFor="reg-accept-privacy" className="flex items-start gap-3 cursor-pointer group">
                                        <div className="flex items-center h-5">
                                            <input type="checkbox" id="reg-accept-privacy" name="accepts_privacy_policy" required
                                                checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                                className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-primary transition-colors cursor-pointer" />
                                        </div>
                                        <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                            Confirmo que he leído y acepto la Política de Privacidad.
                                        </span>
                                    </label>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    disabled={!isStep1Valid}
                                    className="w-full bg-primary hover:bg-blue-600 disabled:bg-slate-400 text-white font-bold rounded-lg px-4 py-3 mt-6 transition-colors shadow-lg shadow-primary/30"
                                >
                                    Siguiente
                                </button>
                            </div>

                            {/* ---- SLIDE 2: Validación y Envío ---- */}
                            <div className="w-1/2 flex-shrink-0 px-2 flex flex-col">
                                <form className="space-y-4 flex flex-col h-full" onSubmit={handleRegistrationSubmit}>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Validación de Identidad</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                            Para asegurar que eres el dueño de esta cuenta, por favor valídala con tu correo electrónico.
                                        </p>
                                        <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo electrónico *</label>
                                        <div className="flex gap-2">
                                            <input type="email" id="reg-email" name="email" required
                                                value={emailStr}
                                                onChange={(e) => setEmailStr(e.target.value)}
                                                disabled={otpSent}
                                                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-60 transition-colors"
                                                placeholder="tu@correo.com" />
                                            <button
                                                type="button"
                                                onClick={handleValidateEmail}
                                                disabled={isLoading || (otpSent && countdown > 0) || !isEmailValid}
                                                className="bg-primary hover:bg-blue-600 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                                            >
                                                {isLoading ? '...' : (otpSent ? 'Enviado' : 'Validar')}
                                            </button>
                                        </div>
                                    </div>

                                    {otpSent && (
                                        <div className="grid grid-cols-1 gap-4 mt-4 animate-fade-in-up">
                                            <div>
                                                <label htmlFor="reg-otp" className="flex justify-between items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                                    <span>Código de Seguridad (OTP) *</span>
                                                    <span className={`font-bold font-mono ${countdown > 60 ? 'text-primary' : 'text-secondary'}`}>
                                                        {formatTime(countdown)}
                                                    </span>
                                                </label>
                                                <input type="text" id="reg-otp" name="otp_code" required maxLength={6}
                                                    value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-center tracking-widest font-bold text-lg"
                                                    placeholder="000000" />
                                                <p className="text-xs text-slate-500 mt-1">Ingresa el código que hemos enviado a tu correo.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-grow"></div>

                                    <div className="mt-8 pt-4 flex gap-3 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            className="w-1/3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg px-3 py-3 transition-colors text-sm"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !isStep2Valid}
                                            className="w-2/3 bg-secondary hover:bg-red-800 disabled:bg-slate-400 text-white font-bold rounded-lg px-4 py-3 transition-colors shadow-lg shadow-secondary/30 text-sm"
                                        >
                                            {isLoading ? 'Registrando...' : 'Registrar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            ¿Ya tienes cuenta?
                            <button type="button" className="text-primary hover:text-blue-700 font-bold ml-1 transition-colors">
                                Inicia sesión
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
