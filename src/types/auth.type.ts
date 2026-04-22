export interface MeResponse {
    username: string;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    name: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordVerifyRequest {
    token: string;
    password: string;
}