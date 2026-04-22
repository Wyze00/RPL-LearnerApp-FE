import { useCallback, useState } from "react";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorBanner from "../../components/ErrorBanner";
import type { ResponseWithError } from "../../types/response.type";
import { Link, useSearchParams } from "react-router";

export default function ForgotPasswordVerifyPage(): React.JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [verifyRequest, setVerifyRequest] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleVerify = useCallback((password: string) => {
        setIsLoading(true);
        setError("");

        (async () => {
            try {
                const response = await fetch('/api/auth/forgot-password/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                        password: password
                    }),
                })

                if (response.ok) {
                    setIsVerified(true);
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }

            } catch (error) {
                console.error(error);
                setError('Gagal memperbarui password. Tautan mungkin sudah kedaluwarsa.');
            } finally {
                setIsLoading(false);
            }
        })()
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerifyRequest(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (verifyRequest.password !== verifyRequest.confirmPassword) {
            setError("Konfirmasi password tidak cocok!");
            return;
        }
        handleVerify(verifyRequest.password);
    };

    return (
        <div className="flex w-full min-h-[100vh] bg-gradient-to-br from-[#FFFBE9] via-[#E3CAA5] to-[#CEAB93] items-center justify-between md:p-12 p-8">
            
            {isVerified && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white rounded-xl p-12 max-w-md w-full mx-4 shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 text-center border-4 border-[#FFFBE9]">
                        <div className="w-24 h-24 bg-[#2D6A4F] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#2D6A4F]/30 animate-bounce">
                            <svg className="w-12 h-12 text-[#FFFBE9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        
                        <h2 className="text-4xl font-black font-outfit text-[#1E293B] mb-4">
                            Password Diperbarui!
                        </h2>
                        
                        <p className="font-jakarta text-[#AD8B73] text-lg mb-10 leading-relaxed">
                            Password kamu telah berhasil diubah. Sekarang kamu bisa masuk kembali ke akun kamu menggunakan password baru.
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

            {/* Left Section - Text & Header */}
            <div className="flex-1 px-4 md:px-12 flex flex-col justify-center animate-slide-left">
                <h1 className="text-5xl md:text-7xl font-black font-outfit text-[#1E293B] mb-6 drop-shadow-sm leading-tight">
                    Secure Your <br/> Account
                </h1>
                <p className="text-lg md:text-2xl font-jakarta text-[#1E293B]/80 leading-relaxed max-w-2xl font-medium">
                    Langkah terakhir! Masukkan password baru yang kuat agar kamu bisa kembali belajar tanpa hambatan.
                </p>
            </div>

            {/* Right Section - Form Container */}
            <div className="hidden md:flex flex-col w-[45%] h-[80vh] min-h-[500px] bg-white rounded-xl shadow-[0_20px_50px_rgba(45,106,79,0.15)] border border-[#FFFBE9] mr-6 p-10 lg:p-14 justify-center animate-slide-right">
                
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-extrabold font-outfit text-[#1E293B] mb-3">
                        Set New Password
                    </h2>
                    <p className="font-jakarta text-[#AD8B73] font-medium text-lg">
                        Silakan masukkan password baru kamu di bawah ini.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-6 font-jakarta">
                    <div className="flex flex-col gap-2">
                        <label className="text-[#1E293B] font-bold text-sm ml-1">New Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={verifyRequest.password}
                            onChange={handleChange}
                            placeholder="Maksimal 100 karakter"
                            required
                            className="w-full px-5 py-4 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[#1E293B] font-bold text-sm ml-1">Confirm New Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={verifyRequest.confirmPassword}
                            onChange={handleChange}
                            placeholder="Ulangi password baru kamu"
                            required
                            className="w-full px-5 py-4 rounded-xl border-2 border-[#E3CAA5] bg-[#FFFBE9]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1E293B]/20 focus:border-[#1E293B] text-[#1E293B] placeholder-[#CEAB93] font-medium transition-all"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full py-4 bg-[#1E293B] text-[#FFFBE9] rounded-xl font-bold text-xl shadow-lg shadow-[#1E293B]/30 hover:bg-[#2D6A4F] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {isLoading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>

            {/* Mobile Form View */}
            <div className="md:hidden w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col focus:outline-none mt-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-extrabold font-outfit text-[#1E293B] mb-2">New Password</h2>
                    <p className="font-jakarta text-[#AD8B73]">Secure your account</p>
                </div>
                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-jakarta">
                    <input 
                        type="password" name="password" value={verifyRequest.password} onChange={handleChange} placeholder="New Password" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <input 
                        type="password" name="confirmPassword" value={verifyRequest.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required
                        className="w-full px-4 py-3 rounded-lg border-2 border-[#E3CAA5] focus:outline-none focus:border-[#1E293B] text-[#1E293B]"
                    />
                    <button type="submit" className="w-full py-3 bg-[#1E293B] text-[#FFFBE9] rounded-lg font-bold text-lg hover:bg-[#1B4332]">
                        Reset Password
                    </button>
                </form>
            </div>

            {isLoading && <LoadingOverlay />}
            {error && <ErrorBanner error={error} setError={setError} />}
        </div>
    );
}