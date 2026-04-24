import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import type { CourseIncludeCount, CoursePaymentHistory } from "../../types/course.type";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorBanner from "../../components/ErrorBanner";
import { getYoutubeThumbnailUrl } from "../../utils/getYoutbeThumbnailUrl";

export default function InstructorPage(): React.JSX.Element {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [courses, setCourses] = useState<CourseIncludeCount[]>([]);
    const [history, setHistory] = useState<CoursePaymentHistory[]>([]);
    
    // States for creation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        preview_video_link: '',
        price: 0
    });

    // States for stats filtering
    const now = new Date();
    const [filter, setFilter] = useState({
        year: now.getFullYear(),
        month: now.getMonth() + 1
    });

    const fetchCourses = async () => {
        try {
            const response = await fetch(`/api/instructors/courses`);
            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<CourseIncludeCount[]>;
                setCourses(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await fetch(`/api/instructors/stats?year=${filter.year}&month=${filter.month}`);
            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<CoursePaymentHistory[]>;
                setHistory(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchCourses(), fetchHistory()]).finally(() => setLoading(false));
    }, [filter]);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/instructors/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourse)
            });

            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<CourseIncludeCount>;
                setCourses(prev => [data, ...prev]);
                setIsModalOpen(false);
                setNewCourse({ title: '', description: '', preview_video_link: '', price: 0 });
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error);
            }
        } catch (err) {
            setError('Gagal membuat kursus baru.');
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = history.reduce((acc, curr) => acc + curr.amount, 0);
    const totalStudents = courses.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-24 pb-20 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className="text-5xl font-black font-outfit text-[#1E293B] mb-4">Instructor Dashboard</h1>
                        <p className="text-lg font-jakarta text-[#AD8B73] font-medium">Kelola kursus Anda dan pantau pertumbuhan pendapatan Anda.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-[#AD8B73] text-[#FFFBE9] rounded-2xl font-bold text-lg shadow-xl hover:bg-[#1E293B] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                        Buat Kursus Baru
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <div className="bg-white p-8 rounded-[2rem] border border-[#E3CAA5]/30 shadow-sm flex flex-col justify-center">
                        <span className="text-[#AD8B73] font-bold text-sm uppercase tracking-widest mb-2">Total Kursus</span>
                        <span className="text-5xl font-black font-outfit text-[#1E293B]">{courses.length}</span>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-[#E3CAA5]/30 shadow-sm flex flex-col justify-center">
                        <span className="text-[#AD8B73] font-bold text-sm uppercase tracking-widest mb-2">Total Siswa</span>
                        <span className="text-5xl font-black font-outfit text-[#1E293B]">{totalStudents}</span>
                    </div>
                    <div className="bg-[#1E293B] p-8 rounded-[2rem] shadow-xl flex flex-col justify-center">
                        <span className="text-[#CEAB93] font-bold text-sm uppercase tracking-widest mb-2">Pendapatan Bulan Ini</span>
                        <span className="text-4xl font-black font-outfit text-[#FFFBE9]">Rp {totalEarnings.toLocaleString()}</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Courses List */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                        <h2 className="text-3xl font-black font-outfit text-[#1E293B]">Kursus Saya</h2>
                        <div className="space-y-4">
                            {courses.map(course => (
                                <Link 
                                    key={course.id}
                                    to={`/instructor/course/${course.id}`}
                                    className="group flex items-center gap-6 p-4 bg-white rounded-3xl border border-[#E3CAA5]/30 hover:border-[#AD8B73] hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                        <img 
                                            src={getYoutubeThumbnailUrl(course.preview_video_link)} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                            alt={course.title} 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold font-outfit text-[#1E293B] group-hover:text-[#AD8B73] transition-colors">{course.title}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-sm font-bold text-[#AD8B73]">{course.count} Siswa</span>
                                            <span className="text-[#E3CAA5]">|</span>
                                            <span className="text-sm font-bold text-[#1E293B]">Rp {course.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="pr-4">
                                        <svg className="w-6 h-6 text-[#E3CAA5] group-hover:text-[#AD8B73] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-400">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black font-outfit text-[#1E293B]">Riwayat Penjualan</h2>
                            <div className="flex gap-2">
                                <select 
                                    className="bg-white border border-[#E3CAA5] rounded-xl px-3 py-2 font-bold font-jakarta text-[#1E293B]"
                                    value={filter.month}
                                    onChange={(e) => setFilter(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                                    ))}
                                </select>
                                <select 
                                    className="bg-white border border-[#E3CAA5] rounded-xl px-3 py-2 font-bold font-jakarta text-[#1E293B]"
                                    value={filter.year}
                                    onChange={(e) => setFilter(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                >
                                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-[#E3CAA5]/30 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left font-jakarta">
                                    <thead className="bg-[#FFFBE9] border-b border-[#E3CAA5]/30">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-[#AD8B73] uppercase text-xs tracking-widest">Tanggal</th>
                                            <th className="px-6 py-4 font-bold text-[#AD8B73] uppercase text-xs tracking-widest">Metode</th>
                                            <th className="px-6 py-4 font-bold text-[#AD8B73] uppercase text-xs tracking-widest text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#FFFBE9]">
                                        {history.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-[#CEAB93] font-medium">Belum ada transaksi di periode ini.</td>
                                            </tr>
                                        ) : (
                                            history.map(item => (
                                                <tr key={item.id} className="hover:bg-[#FFFBE9]/50 transition-colors">
                                                    <td className="px-6 py-4 text-[#1E293B] font-bold">{new Date(item.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-[#E3CAA5]/20 text-[#AD8B73] rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                            {item.payment_method.replace('_', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-[#1E293B] font-black">Rp {item.amount.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl border-4 border-[#FFFBE9] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black font-outfit text-[#1E293B]">Buat Kursus Baru</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#AD8B73] hover:text-[#1E293B]">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateCourse} className="space-y-6 font-jakarta">
                            <div className="space-y-2">
                                <label className="font-bold text-[#AD8B73]">Judul Kursus</label>
                                <input 
                                    type="text" required
                                    className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none transition-all"
                                    value={newCourse.title}
                                    onChange={e => setNewCourse(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Contoh: Belajar React Modern 2024"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-[#AD8B73]">Deskripsi</label>
                                <textarea 
                                    required rows={4}
                                    className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none transition-all"
                                    value={newCourse.description}
                                    onChange={e => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Jelaskan apa yang akan dipelajari..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Preview Video URL (YouTube)</label>
                                    <input 
                                        type="url" required
                                        className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none transition-all"
                                        value={newCourse.preview_video_link}
                                        onChange={e => setNewCourse(prev => ({ ...prev, preview_video_link: e.target.value }))}
                                        placeholder="https://youtu.be/..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Harga (IDR)</label>
                                    <input 
                                        type="number" required
                                        className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none transition-all"
                                        value={newCourse.price}
                                        onChange={e => setNewCourse(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-5 bg-[#1E293B] text-[#FFFBE9] rounded-2xl font-bold text-xl hover:bg-[#AD8B73] hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#1E293B]/20"
                            >
                                Buat Kursus Sekarang
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}