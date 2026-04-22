export interface MeResponse {
    username: string;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}