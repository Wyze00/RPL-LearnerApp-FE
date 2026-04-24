import { useEffect, useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import type { CoursePaymentHistory } from "../../types/course.type";
import { type User } from "../../types/auth.type";

export default function AdminPage(): React.JSX.Element {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<User[]>([]);
    const [transactions, setTransactions] = useState<CoursePaymentHistory[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'transactions'>('users');

    useEffect(() => {
        setLoading(true);
        setError('');

        const fetchData = async () => {
            try {
                const [usersRes, transRes] = await Promise.all([
                    fetch('/api/admins/users'),
                    fetch('/api/admins/transactions')
                ]);

                if (usersRes.ok && transRes.ok) {
                    const usersData = await usersRes.json() as ResponseWithData<User[]>;
                    const transData = await transRes.json() as ResponseWithData<CoursePaymentHistory[]>;
                    
                    setUsers(usersData.data);
                    setTransactions(transData.data);
                } else {
                    setError('Gagal memuat data administratif. Pastikan Anda memiliki hak akses.');
                }
            } catch (err) {
                console.error(err);
                setError('Terjadi kesalahan koneksi ke server.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalRevenue = transactions
        .filter(t => t.status === 'SUCCESS' || t.status === 'PENDING') // Asumsi transaksi valid
        .reduce((acc, curr) => acc + curr.amount, 0);

    if (loading) return <LoadingOverlay />;

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-24 pb-20 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-5xl font-black font-outfit text-[#1E293B] mb-4">Admin Console</h1>
                    <p className="text-lg font-jakarta text-[#AD8B73] font-medium max-w-2xl">
                        Pantau ekosistem LearnerApp, kelola pengguna, dan awasi seluruh transaksi finansial secara real-time.
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <div className="bg-white p-8 rounded-[2rem] border border-[#E3CAA5]/30 shadow-sm">
                        <span className="text-[#AD8B73] font-bold text-xs uppercase tracking-widest mb-2 block">Total Pengguna</span>
                        <span className="text-4xl font-black font-outfit text-[#1E293B]">{users.length}</span>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-[#E3CAA5]/30 shadow-sm">
                        <span className="text-[#AD8B73] font-bold text-xs uppercase tracking-widest mb-2 block">Total Transaksi</span>
                        <span className="text-4xl font-black font-outfit text-[#1E293B]">{transactions.length}</span>
                    </div>
                    <div className="bg-[#1E293B] p-8 rounded-[2rem] shadow-xl md:col-span-2">
                        <span className="text-[#CEAB93] font-bold text-xs uppercase tracking-widest mb-2 block">Estimasi Pendapatan Platform</span>
                        <span className="text-4xl font-black font-outfit text-[#FFFBE9]">Rp {totalRevenue.toLocaleString()}</span>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[2.5rem] border border-[#E3CAA5]/30 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-[#FFFBE9] bg-[#FFFBE9]/30 p-2">
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`flex-1 py-4 rounded-2xl font-bold font-jakarta transition-all duration-300 ${
                                activeTab === 'users' 
                                    ? 'bg-[#1E293B] text-[#FFFBE9] shadow-lg' 
                                    : 'text-[#AD8B73] hover:bg-white'
                            }`}
                        >
                            Daftar Pengguna
                        </button>
                        <button 
                            onClick={() => setActiveTab('transactions')}
                            className={`flex-1 py-4 rounded-2xl font-bold font-jakarta transition-all duration-300 ${
                                activeTab === 'transactions' 
                                    ? 'bg-[#1E293B] text-[#FFFBE9] shadow-lg' 
                                    : 'text-[#AD8B73] hover:bg-white'
                            }`}
                        >
                            Log Transaksi
                        </button>
                    </div>

                    {/* Table Area */}
                    <div className="p-4 md:p-8 overflow-x-auto">
                        {activeTab === 'users' ? (
                            <table className="w-full text-left font-jakarta">
                                <thead className="text-[#AD8B73] text-[10px] font-black uppercase tracking-widest border-b border-[#FFFBE9]">
                                    <tr>
                                        <th className="px-6 py-4">Nama & Username</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Bergabung Pada</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#FFFBE9]">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-[#FFFBE9]/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-bold text-[#1E293B] group-hover:text-[#AD8B73] transition-colors">{user.name}</div>
                                                <div className="text-xs text-[#CEAB93]">@{user.username}</div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-[#8b6b55]">{user.email}</td>
                                            <td className="px-6 py-5 text-sm text-[#8b6b55]">
                                                {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">Active</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left font-jakarta">
                                <thead className="text-[#AD8B73] text-[10px] font-black uppercase tracking-widest border-b border-[#FFFBE9]">
                                    <tr>
                                        <th className="px-6 py-4">ID Transaksi</th>
                                        <th className="px-6 py-4">Metode</th>
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4 text-right">Jumlah</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#FFFBE9]">
                                    {transactions.map(item => (
                                        <tr key={item.id} className="hover:bg-[#FFFBE9]/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-mono text-[10px] text-[#CEAB93] truncate max-w-[120px]">{item.id}</div>
                                                <div className="text-xs font-bold text-[#1E293B]">Course ID: {item.course_id.split('-')[0]}...</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-[#E3CAA5]/20 text-[#AD8B73] rounded-lg text-[10px] font-black uppercase">
                                                    {item.payment_method.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-[#8b6b55]">
                                                {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </td>
                                            <td className="px-6 py-5 text-right font-black text-[#1E293B]">
                                                Rp {item.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    item.status === 'SUCCESS' ? 'bg-green-100 text-green-600' : 
                                                    item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        
                        {(activeTab === 'users' ? users : transactions).length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-[#CEAB93] font-jakarta italic">Belum ada data tersedia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
