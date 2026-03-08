import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthResponse } from '../../domain/auth';

interface AuthContextType {
    user: AuthResponse['user'] | null;
    token: string | null;
    adminLogin: (credentials: unknown) => Promise<void>;
    setSession: (token: string, user: AuthResponse['user']) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthResponse['user'] | null>(() => {
        const savedUser = localStorage.getItem('sicultura_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('sicultura_jwt');
    });

    useEffect(() => {
        // Sync state if it changed from elsewhere (though initial state is synchronous now)
        const savedToken = localStorage.getItem('sicultura_jwt');
        const savedUser = localStorage.getItem('sicultura_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const adminLogin = async (credentials: unknown) => {
        try {
            const response = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) throw new Error('Login failed');

            const data: AuthResponse = await response.json();
            setSession(data.token, data.user);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const setSession = (newToken: string, newUser: AuthResponse['user']) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('sicultura_jwt', newToken);
        localStorage.setItem('sicultura_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('sicultura_jwt');
        localStorage.removeItem('sicultura_user');
    };

    const isAdmin = user && user.role !== 'citizen' ? true : false;

    return (
        <AuthContext.Provider value={{ user, token, adminLogin, setSession, logout, isAuthenticated: !!token, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
