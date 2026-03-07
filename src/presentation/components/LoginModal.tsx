import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
    const navigate = useNavigate();

    const [emailStr, setEmailStr] = useState<string>('');
    const [otpCode, setOtpCode] = useState<string>('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpId, setOtpId] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setEmailStr('');
            setOtpCode('');
            setOtpSent(false);
            setOtpId(null);
            setCountdown(0);
            setErrorMsg(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    // Timer logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (otpSent && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [otpSent, countdown]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleValidateEmail = async () => {
        if (!emailStr || !RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}').test(emailStr)) {
            setErrorMsg("Por favor, introduzca un correo electrónico válido.");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);
        try {
            const response = await fetch('/api/login/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailStr }),
            });

            if (!response.ok) {
                let errorDetails = 'Error al verificar usuario';
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
            setCountdown(300); // 5 minutes
            setErrorMsg(null);
        } catch (error: any) {
            console.error('Error generating login OTP:', error);
            setErrorMsg(error.message || "Error al enviar el código de verificación.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!otpSent || !otpId) {
            setErrorMsg("Primero debes ingresar tu correo y solicitar el código OTP.");
            return;
        }

        if (!otpCode || otpCode.length !== 6) {
            setErrorMsg("El código OTP debe ser de 6 dígitos.");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        try {
            const response = await fetch('/api/login/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    otpId,
                    email: emailStr,
                    otpCode
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

            if (data.token) {
                localStorage.setItem('sicultura_jwt', data.token);
            }

            onClose();
            navigate('/backoffice');

        } catch (error: any) {
            console.error('Error validating login OTP:', error);
            setErrorMsg(error.message || "Error al validar el código OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const isLoginValid = otpSent && emailStr && otpCode.length === 6;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white dark:bg-surface-dark w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors z-10"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="p-8 overflow-y-auto">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <img src="/logo_micultura.png" alt="Sicultura Panamá Logo" className="h-16 w-auto mb-4 drop-shadow-sm" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 text-center">Inicia sesión para acceder a tu perfil y recursos culturales.</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Correo Electrónico *</label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    id="login-email"
                                    value={emailStr}
                                    onChange={(e) => setEmailStr(e.target.value)}
                                    disabled={otpSent || isLoading}
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:opacity-60"
                                    placeholder="tu@correo.com"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleValidateEmail}
                                    disabled={!emailStr || otpSent || isLoading}
                                    className="bg-slate-400 hover:bg-slate-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                                >
                                    {isLoading && !otpSent ? '...' : otpSent ? 'Enviado' : 'Validar'}
                                </button>
                            </div>
                        </div>

                        {otpSent && (
                            <div className="animate-fade-in-up">
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="login-otp" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Código de Seguridad (OTP) *</label>
                                    <span className="text-xs font-bold text-primary">{countdown > 0 ? formatTime(countdown) : 'Expirado'}</span>
                                </div>
                                <input
                                    type="text"
                                    id="login-otp"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    disabled={isLoading || countdown === 0}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary text-center text tracking-[0.5em] font-bold transition-colors disabled:opacity-60"
                                    placeholder="••••••"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-2 text-center">Ingresa el código que hemos enviado a tu correo.</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isLoginValid || isLoading}
                            className="w-full bg-secondary hover:bg-red-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg px-4 py-3 mt-4 transition-colors shadow-lg shadow-secondary/30"
                        >
                            {isLoading && otpSent ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-600 dark:text-slate-400 text-sm">¿No tienes cuenta?
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onSwitchToRegister();
                                }}
                                className="text-primary hover:text-blue-700 font-bold ml-1 transition-colors"
                            >
                                Regístrate
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
