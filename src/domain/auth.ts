export interface AuthTokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        full_name?: string;
        role: string;
    };
}
