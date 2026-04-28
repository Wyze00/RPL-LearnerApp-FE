import { useEffect, useState, useCallback } from "react";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorBanner from "../../components/ErrorBanner";

export interface Wallet {
    id: string;
    amount: number;
}

export default function WalletPage(): React.JSX.Element {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [isTopupModalOpen, setIsTopupModalOpen] = useState<boolean>(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);

    const [topupAmount, setTopupAmount] = useState<number>(0);
    const [topupMethod, setTopupMethod] = useState<string>("EWALLET");

    const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
    const [withdrawMethod, setWithdrawMethod] = useState<string>("EWALLET");

    const fetchWallet = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch("/api/admins/wallet", {
                credentials: "include",
            });

            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<Wallet>;
                setWallet({
                    id: data.id,
                    amount: data.amount
                })
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error || "Failed to fetch wallet info");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWallet();
    }, [fetchWallet]);

    const handleTopup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (topupAmount <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await fetch("/api/admins/topup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: topupAmount,
                    paymentMethod: topupMethod,
                }),
            });

            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<Wallet>;
                setWallet(data);
                setIsTopupModalOpen(false);
                setTopupAmount(0);
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error || "Topup failed");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (withdrawAmount <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        if (wallet && withdrawAmount > wallet.amount) {
            setError("Insufficient funds");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await fetch("/api/admins/withdraw", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: withdrawAmount,
                    paymentMethod: withdrawMethod,
                }),
            });

            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<Wallet>;
                setWallet(data);
                setIsWithdrawModalOpen(false);
                setWithdrawAmount(0);
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error || "Withdrawal failed");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loading && !wallet) return <LoadingOverlay />;

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-24 pb-20 px-6 lg:px-12 font-jakarta">
            {error && <ErrorBanner error={error} setError={setError} />}
            
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-5xl font-black font-outfit text-[#1E293B] mb-4">My Wallet</h1>
                    <p className="text-lg text-[#AD8B73] font-medium">Manage your account balance for purchasing courses.</p>
                </div>

                {/* Wallet Balance Card */}
                <div className="bg-gradient-to-br from-[#1E293B] via-[#2e405eff] to-[#1E293B] rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-[#FFFBE9] relative overflow-hidden animate-in fade-in zoom-in-95 duration-700 delay-200">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div>
                            <span className="text-[#CEAB93] text-sm font-bold uppercase tracking-widest block mb-2">Current Balance</span>
                            <span className="text-5xl md:text-6xl font-black font-outfit tracking-tight">
                                {wallet ? formatCurrency(wallet.amount) : "Rp 0"}
                            </span>
                            <span className="block text-[#E3CAA5] text-xs mt-4 font-mono opacity-75">Wallet ID: {wallet?.id || "N/A"}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => setIsTopupModalOpen(true)}
                                className="px-8 py-4 bg-[#AD8B73] text-[#FFFBE9] rounded-2xl font-bold text-lg shadow-lg hover:bg-[#E3CAA5] hover:text-[#1E293B] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                                Top Up
                            </button>
                            <button 
                                onClick={() => setIsWithdrawModalOpen(true)}
                                className="px-8 py-4 bg-[#FFFBE9]/10 border-2 border-[#FFFBE9]/30 text-[#FFFBE9] rounded-2xl font-bold text-lg hover:bg-[#FFFBE9] hover:text-[#1E293B] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
                                </svg>
                                Withdraw
                            </button>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 rounded-full bg-[#E3CAA5]/10 blur-3xl pointer-events-none"></div>
                    <div className="absolute top-[-50px] left-[-50px] w-64 h-64 rounded-full bg-[#AD8B73]/10 blur-3xl pointer-events-none"></div>
                </div>

                {/* Modals */}
                {/* Top Up Modal */}
                {isTopupModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
                        <div className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl border-4 border-[#FFFBE9] max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black font-outfit text-[#1E293B]">Top Up Saldo</h2>
                                <button onClick={() => setIsTopupModalOpen(false)} className="text-[#AD8B73] hover:text-[#1E293B]">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleTopup} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Jumlah Top Up (IDR)</label>
                                    <input 
                                        type="number" required min={10000}
                                        className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none transition-all font-bold text-xl text-[#1E293B]"
                                        value={topupAmount || ''}
                                        onChange={e => setTopupAmount(parseInt(e.target.value))}
                                        placeholder="Min. Rp 10.000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Metode Pembayaran</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['EWALLET', 'CASH', 'CARD'].map(method => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() => setTopupMethod(method)}
                                                className={`py-4 px-2 rounded-xl border-2 font-bold text-center transition-all ${
                                                    topupMethod === method 
                                                        ? 'bg-[#1E293B] border-[#1E293B] text-[#FFFBE9]' 
                                                        : 'bg-white border-[#E3CAA5] text-[#AD8B73] hover:border-[#AD8B73]'
                                                }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-5 bg-[#AD8B73] text-[#FFFBE9] rounded-2xl font-bold text-xl hover:bg-[#1E293B] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#AD8B73]/20"
                                >
                                    Top Up Sekarang
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Withdraw Modal */}
                {isWithdrawModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
                        <div className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl border-4 border-[#FFFBE9] max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black font-outfit text-[#1E293B]">Tarik Saldo</h2>
                                <button onClick={() => setIsWithdrawModalOpen(false)} className="text-[#AD8B73] hover:text-[#1E293B]">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleWithdraw} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Jumlah Penarikan (IDR)</label>
                                    <input 
                                        type="number" required min={10000}
                                        className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none transition-all font-bold text-xl text-[#1E293B]"
                                        value={withdrawAmount || ''}
                                        onChange={e => setWithdrawAmount(parseInt(e.target.value))}
                                        placeholder="Min. Rp 10.000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Metode Penarikan</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['EWALLET', 'CASH', 'CARD'].map(method => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() => setWithdrawMethod(method)}
                                                className={`py-4 px-2 rounded-xl border-2 font-bold text-center transition-all ${
                                                    withdrawMethod === method 
                                                        ? 'bg-[#1E293B] border-[#1E293B] text-[#FFFBE9]' 
                                                        : 'bg-white border-[#E3CAA5] text-[#AD8B73] hover:border-[#AD8B73]'
                                                }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-5 bg-[#1E293B] text-[#FFFBE9] rounded-2xl font-bold text-xl hover:bg-[#AD8B73] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#1E293B]/20"
                                >
                                    Tarik Sekarang
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
