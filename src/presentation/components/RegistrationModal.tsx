import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const [emailStr, setEmailStr] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [acceptData, setAcceptData] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    const [otpId, setOtpId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const isFormValid = otpSent && Boolean(fullName.trim()) && otpCode.length === 6 && acceptData && acceptTerms && acceptPrivacy;

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

    const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isFormValid) {
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
                    accepts_privacy_policy: acceptPrivacy
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
            if (data.token) {
                localStorage.setItem('sicultura_jwt', data.token);
            }

            alert("¡Registro exitoso! Tu cuenta ha sido creada y validada correctamente. Ya puedes iniciar sesión en el sistema.");
            onClose();
            navigate('/backoffice');

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

                    <form className="space-y-4" onSubmit={handleRegistrationSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre completo *</label>
                                <input type="text" id="reg-name" name="full_name" required
                                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                                    disabled={otpSent}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-60"
                                    placeholder="Tu nombre completo" />
                            </div>
                            <div>
                                <label htmlFor="reg-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teléfono (Opcional)</label>
                                <input type="tel" id="reg-phone" name="phone_number"
                                    value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                                    disabled={otpSent}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-60"
                                    placeholder="+507 0000-0000" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo electrónico *</label>
                                <div className="flex gap-2">
                                    <input type="email" id="reg-email" name="email" required
                                        value={emailStr}
                                        onChange={(e) => setEmailStr(e.target.value)}
                                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                                        title="Por favor ingrese un correo válido (ejemplo: usuario@dominio.com)"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                        placeholder="tu@correo.com" />
                                    <button
                                        type="button"
                                        onClick={handleValidateEmail}
                                        disabled={isLoading || (otpSent && countdown > 0)}
                                        className="bg-primary hover:bg-blue-600 disabled:bg-slate-400 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
                                    >
                                        {isLoading ? 'Enviando...' : 'Validar'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* OTP Field replacing Passwords */}
                        {otpSent && (
                            <div className="grid grid-cols-1 gap-4">
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
                                    <p className="text-xs text-slate-500 mt-1">Ingresa el código que hemos enviado a tu correo/teléfono.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 mt-6 pt-2">
                            <label htmlFor="reg-auth-data" className="flex items-start gap-3 cursor-pointer group">
                                <div className="flex items-center h-5">
                                    <input type="checkbox" id="reg-auth-data" name="authorizes_data_treatment" required
                                        checked={acceptData} onChange={(e) => setAcceptData(e.target.checked)}
                                        className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 transition-colors cursor-pointer" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    Autorizo al Ministerio de Cultura de Panamá a que recolecte, almacene y trate mis datos personales, como responsable del Sistema de Información Cultural (Sicultura).
                                </span>
                            </label>

                            <label htmlFor="reg-accept-terms" className="flex items-start gap-3 cursor-pointer group">
                                <div className="flex items-center h-5">
                                    <input type="checkbox" id="reg-accept-terms" name="accepts_terms_conditions" required
                                        checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                                        className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 transition-colors cursor-pointer" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    Confirmo que he leído en plenitud y acepto los Términos y Condiciones para el registro de fichas en el Directorio de Sicultura.
                                </span>
                            </label>

                            <label htmlFor="reg-accept-privacy" className="flex items-start gap-3 cursor-pointer group">
                                <div className="flex items-center h-5">
                                    <input type="checkbox" id="reg-accept-privacy" name="accepts_privacy_policy" required
                                        checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                        className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 transition-colors cursor-pointer" />
                                </div>
                                <span className="text-xs text-slate-600 dark:text-slate-400 leading-tight group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                                    Confirmo que he leído y acepto la Política de Protección de Datos Personales de Sicultura.
                                </span>
                            </label>
                        </div>

                        <button type="submit" disabled={isLoading || !isFormValid}
                            className="w-full bg-secondary hover:bg-red-800 disabled:bg-slate-400 text-white font-bold rounded-lg px-4 py-3 mt-6 transition-colors shadow-lg shadow-secondary/30">
                            {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                        </button>
                    </form>

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
