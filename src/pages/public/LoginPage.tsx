import { useCallback, useState } from "react";
import { type LoginRequest } from "../../types/auth.type";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorBanner from "../../components/ErrorBanner";
import type { User } from "../../types/user.type";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { userSlice } from "../../redux/user.slice";
import { Link } from "react-router";

export default function LoginPage(): React.JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const dispatch = useAppDispatch();

    const [loginRequest, setLoginRequest] = useState<LoginRequest>({
        username: "",
        password: ""
    });

    const handleLogin = useCallback((request: LoginRequest) => {
        setIsLoading(true);
        setError("");

        (async () => {
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                })

                if (response.ok) {
                    const { data } = await response.json() as ResponseWithData<User>;
                    dispatch(userSlice.actions.setState(data));
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }


            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })()
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginRequest(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(loginRequest);
    };

    return (
        <div className="flex w-full min-h-[100vh] bg-gradient-to-br from-[#FFFBE9] via-[#E3CAA5] to-[#CEAB93] items-center justify-between md:p-12 p-8">
            
            {/* Left Section - Text & Header */}
            <div className="flex-1 px-4 md:px-12 flex flex-col justify-center animate-slide-left">
                <h1 className="text-5xl md:text-7xl font-black font-outfit text-[#1E293B] mb-6 drop-shadow-sm leading-tight">
                    Level Up Your <br/> Skills Today
                </h1>
                <p className="text-lg md:text-2xl font-jakarta text-[#1E293B]/80 leading-relaxed max-w-2xl font-medium">
                    Akses ribuan kelas video berkualitas tinggi yang diajarkan oleh para profesional. Mulai perjalanan belajarmu sekarang dan raih karir impianmu!
                </p>
            </div>

            {/* Right Section - Form Container */}
            <div className="hidden md:flex flex-col w-[45%] h-[85vh] min-h-[500px] bg-white rounded-xl shadow-[0_20px_50px_rgba(45,106,79,0.15)] border border-[#FFFBE9] mr-6 p-10 lg:p-14 justify-center animate-slide-right">
                
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-extrabold font-outfit text-[#1E293B] mb-3">
                        Welcome Back!
                    </h2>
                    <p className="font-jakarta text-[#AD8B73] font-medium text-lg">
                        Silakan login untuk melanjutkan belajarmu.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-6 font-jakarta">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#1E293B] font-bold text-sm ml-1">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            value={loginRequest.username}
                            onChange={handleChange}
                            placeholder="Masukkan username kamu"
                            required
                            className="w-full px-5 py-4 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[#1E293B] font-bold text-sm ml-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={loginRequest.password}
                            onChange={handleChange}
                            placeholder="Masukkan password kamu"
                            required
                            className="w-full px-5 py-4 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full py-4 bg-[#1E293B] text-[#FFFBE9] rounded-xl font-bold text-xl shadow-lg shadow-[#1E293B]/30 hover:bg-[#2e405eff] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>
                    
                    <div className="text-center mt-4 text-[#1E293B] text-sm font-medium">
                        Belum punya akun? <Link to="/register" className="font-bold text-[#AD8B73] underline hover:text-[#1E293B] transition-colors">Daftar sekarang</Link>
                    </div>

                    <div className="text-center mt-4 text-[#1E293B] text-sm font-medium">
                        Lupa password? <Link to="/forgot-password" className="font-bold text-[#AD8B73] underline hover:text-[#1E293B] transition-colors">Reset password</Link>
                    </div>
                </form>
            </div>

            {/* Mobile Form View */}
            <div className="md:hidden w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col focus:outline-none mt-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold font-outfit text-[#1E293B] mb-2">Welcome!</h2>
                    <p className="font-jakarta text-[#AD8B73]">Log in to continue</p>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-jakarta">
                    <input 
                        type="text" name="username" value={loginRequest.username} onChange={handleChange} placeholder="Username" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <input 
                        type="password" name="password" value={loginRequest.password} onChange={handleChange} placeholder="Password" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <button type="submit" className="w-full py-3 bg-[#1E293B] text-[#FFFBE9] rounded-lg font-bold text-lg hover:bg-[#1B4332]">
                        Log In
                    </button>
                </form>
            </div>

            {isLoading && <LoadingOverlay />}
            {error && <ErrorBanner error={error} setError={setError} />}
        </div>
    );
}