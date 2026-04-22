import { useCallback, useState } from "react";
import { type ForgotPasswordRequest, type RegisterRequest } from "../../types/auth.type";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorBanner from "../../components/ErrorBanner";
import type { ResponseWithError } from "../../types/response.type";
import { Link } from "react-router";

export default function ForgotPasswordPage(): React.JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [forgotPasswordRequest, setForgotPasswordRequest] = useState<ForgotPasswordRequest>({
        email: '',
    });

    const handleForgotPassword = useCallback((request: ForgotPasswordRequest) => {
        setIsLoading(true);
        setError("");

        (async () => {
            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                })

                if (response.ok) {
                    setIsSuccess(true);
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }

            } catch (error) {
                console.error(error);
                setError('Terjadi kesalahan. Silahkan coba lagi nanti.')
            } finally {
                setIsLoading(false);
            }
        })()
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForgotPasswordRequest(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleForgotPassword(forgotPasswordRequest);
    };


    return (
        <div className="flex w-full min-h-[100vh] bg-gradient-to-br from-[#FFFBE9] via-[#E3CAA5] to-[#CEAB93] items-center justify-between md:p-12 p-8">

            {isSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-xl p-12 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 text-center border-4 border-[#FFFBE9]">
                        <div className="w-24 h-24 bg-[#AD8B73] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#AD8B73]/30 animate-bounce">
                            <svg className="w-12 h-12 text-[#FFFBE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        
                        <h2 className="text-4xl font-black font-outfit text-[#1E293B] mb-4">
                            Email Terkirim!
                        </h2>
                        
                        <p className="font-jakarta text-[#AD8B73] text-lg mb-10 leading-relaxed">
                            Kami telah mengirimkan instruksi pengaturan ulang password ke email kamu. Silakan periksa kotak masuk (atau folder spam).
                        </p>
                        
                        <Link 
                            to="/login"
                            className="inline-block w-full py-4 bg-[#1E293B] text-[#FFFBE9] rounded-2xl font-bold text-xl shadow-xl hover:bg-[#AD8B73] hover:-translate-y-1 transition-all duration-300"
                        >
                            Kembali ke Login
                        </Link>
                    </div>
                </div>
            )}

            {/* Left Section - Form Container */}
            <div className="hidden md:flex flex-col w-[45%] h-[70vh] min-h-[450px] bg-white rounded-xl shadow-[0_20px_50px_rgba(45,106,79,0.15)] border border-[#FFFBE9] ml-6 p-10 lg:p-14 justify-center animate-slide-left">
                
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-extrabold font-outfit text-[#1E293B] mb-3">
                        Forgot Password?
                    </h2>
                    <p className="font-jakarta text-[#AD8B73] font-medium text-lg">
                        Jangan khawatir! Masukkan email kamu dan kami akan mengirimkan link untuk mengatur ulang password.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-6 font-jakarta">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#1E293B] font-bold text-xs ml-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            value={forgotPasswordRequest.email}
                            onChange={handleChange}
                            placeholder="Masukkan email terdaftar kamu"
                            required
                            className="w-full px-5 py-4 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full py-4 bg-[#1E293B] text-[#FFFBE9] rounded-xl font-bold text-xl shadow-lg shadow-[#1E293B]/30 hover:bg-[#AD8B73] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                    
                    <div className="text-center mt-6 text-[#1E293B] text-sm font-medium">
                        Ingat password kamu? <Link to="/login" className="font-bold text-[#AD8B73] underline hover:text-[#1E293B] transition-colors">Login di sini</Link>
                    </div>
                </form>
            </div>

            {/* Right Section - Text & Header */}
            <div className="flex-1 px-4 md:px-12 flex flex-col justify-center animate-slide-right text-right">
                <h1 className="text-5xl md:text-7xl font-black font-outfit text-[#1E293B] mb-6 drop-shadow-sm leading-tight">
                    Recover Your <br/> Account
                </h1>
                <p className="text-lg md:text-2xl font-jakarta text-[#1E293B]/80 leading-relaxed max-w-2xl font-medium ml-auto">
                    Tetap terhubung dengan ribuan materi belajar. Jangan biarkan lupa password menghentikan langkahmu untuk berkembang!
                </p>
            </div>

            {/* Mobile Form View */}
            <div className="md:hidden w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col focus:outline-none mt-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold font-outfit text-[#1E293B] mb-2">Reset Password</h2>
                    <p className="font-jakarta text-[#AD8B73]">Enter email to receive reset link</p>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-6 font-jakarta">
                    <input 
                        type="email" name="email" value={forgotPasswordRequest.email} onChange={handleChange} placeholder="Email Address" required
                        className="w-full px-4 py-4 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <button type="submit" className="w-full py-4 bg-[#1E293B] text-[#FFFBE9] rounded-lg font-bold text-lg hover:bg-[#AD8B73]">
                        Send Reset Link
                    </button>
                    <div className="text-center mt-4 text-sm font-medium">
                        Ingat password? <Link to="/login" className="font-bold text-[#AD8B73]">Login</Link>
                    </div>
                </form>
            </div>

            {isLoading && <LoadingOverlay />}
            {error && <ErrorBanner error={error} setError={setError} />}
        </div>
    );
}