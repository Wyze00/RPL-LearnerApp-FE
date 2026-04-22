import { useCallback, useState } from "react";
import { type RegisterRequest } from "../../types/auth.type";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorBanner from "../../components/ErrorBanner";
import type { ResponseWithError } from "../../types/response.type";
import { Link } from "react-router";

export default function RegisterPage(): React.JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isSuccessRegister, setIsSuccessRegister] = useState<boolean>(false);

    const [registerRequest, setRegisterRequest] = useState<RegisterRequest>({
        username: "",
        password: "",
        email: '',
        name: '',
    });

    const handleRegister = useCallback((request: RegisterRequest) => {
        setIsLoading(true);
        setError("");

        (async () => {
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                })

                if (response.ok) {
                    setIsSuccessRegister(true);
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }

            } catch (error) {
                console.error(error);
                setError('Terjadi kesalahan saat registrasi. Silahkan coba lagi.')
            } finally {
                setIsLoading(false);
            }
        })()
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterRequest(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleRegister(registerRequest);
    };


    return (
        <div className="flex w-full min-h-[100vh] bg-gradient-to-br from-[#FFFBE9] via-[#E3CAA5] to-[#CEAB93] items-center justify-between md:p-12 p-8">

            {isSuccessRegister && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-xl p-12 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 text-center border-4 border-[#FFFBE9]">
                        <div className="w-24 h-24 bg-[#2D6A4F] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#2D6A4F]/30 animate-bounce">
                            <svg className="w-12 h-12 text-[#FFFBE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        
                        <h2 className="text-4xl font-black font-outfit text-[#1E293B] mb-4">
                            Registrasi Berhasil!
                        </h2>
                        
                        <p className="font-jakarta text-[#AD8B73] text-lg mb-10 leading-relaxed">
                            Akun kamu telah berhasil dibuat. Silakan login untuk mulai menjelajahi ribuan materi belajar.
                        </p>
                        
                        <Link 
                            to="/login"
                            className="inline-block w-full py-4 bg-[#1E293B] text-[#FFFBE9] rounded-2xl font-bold text-xl shadow-xl hover:bg-[#2D6A4F] hover:-translate-y-1 transition-all duration-300"
                        >
                            Ke Halaman Login
                        </Link>
                    </div>
                </div>
            )}

            {/* Left Section - Form Container */}
            <div className="hidden md:flex flex-col w-[45%] h-[90vh] min-h-[600px] bg-white rounded-xl shadow-[0_20px_50px_rgba(45,106,79,0.15)] border border-[#FFFBE9] ml-6 p-10 lg:p-14 justify-center animate-slide-left">
                
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-extrabold font-outfit text-[#1E293B] mb-3">
                        Join Us Today!
                    </h2>
                    <p className="font-jakarta text-[#AD8B73] font-medium text-lg">
                        Daftar untuk memulai perjalanan belajarmu.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-jakarta">
                    <div className="flex flex-col gap-1">
                        <label className="text-[#1E293B] font-bold text-xs ml-1">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={registerRequest.name}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap kamu"
                            required
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#1E293B] font-bold text-xs ml-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={registerRequest.email}
                            onChange={handleChange}
                            placeholder="Masukkan email kamu"
                            required
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#1E293B] font-bold text-xs ml-1">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            value={registerRequest.username}
                            onChange={handleChange}
                            placeholder="Pilih username unik"
                            required
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-[#1E293B] font-bold text-xs ml-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={registerRequest.password}
                            onChange={handleChange}
                            placeholder="Buat password yang kuat"
                            required
                            className="w-full px-5 py-3 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full py-4 bg-[#1E293B] text-[#FFFBE9] rounded-xl font-bold text-xl shadow-lg shadow-[#1E293B]/30 hover:bg-[#2e405eff] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isLoading ? "Creating Account..." : "Register"}
                    </button>
                    
                    <div className="text-center mt-2 text-[#1E293B] text-sm font-medium">
                        Sudah punya akun? <Link to="/login" className="font-bold text-[#AD8B73] underline hover:text-[#1E293B] transition-colors">Login di sini</Link>
                    </div>
                </form>
            </div>

            {/* Right Section - Text & Header */}
            <div className="flex-1 px-4 md:px-12 flex flex-col justify-center animate-slide-right text-right">
                <h1 className="text-5xl md:text-7xl font-black font-outfit text-[#1E293B] mb-6 drop-shadow-sm leading-tight">
                    Start Your <br/> Learning Journey
                </h1>
                <p className="text-lg md:text-2xl font-jakarta text-[#1E293B]/80 leading-relaxed max-w-2xl font-medium ml-auto">
                    Bergabunglah dengan jutaan pelajar lainnya. Akses materi terbaik dan kembangkan potensimu ke tingkat yang lebih tinggi!
                </p>
            </div>

            {/* Mobile Form View */}
            <div className="md:hidden w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col focus:outline-none mt-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold font-outfit text-[#1E293B] mb-2">Create Account</h2>
                    <p className="font-jakarta text-[#AD8B73]">Join us to start learning</p>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-jakarta">
                    <input 
                        type="text" name="name" value={registerRequest.name} onChange={handleChange} placeholder="Full Name" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <input 
                        type="email" name="email" value={registerRequest.email} onChange={handleChange} placeholder="Email" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <input 
                        type="text" name="username" value={registerRequest.username} onChange={handleChange} placeholder="Username" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <input 
                        type="password" name="password" value={registerRequest.password} onChange={handleChange} placeholder="Password" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <button type="submit" className="w-full py-3 bg-[#1E293B] text-[#FFFBE9] rounded-lg font-bold text-lg hover:bg-[#1B4332]">
                        Register
                    </button>
                    <div className="text-center mt-2 text-sm">
                        Sudah punya akun? <Link to="/login" className="font-bold text-[#AD8B73]">Login</Link>
                    </div>
                </form>
            </div>

            {isLoading && <LoadingOverlay />}
            {error && <ErrorBanner error={error} setError={setError} />}
        </div>
    );
}