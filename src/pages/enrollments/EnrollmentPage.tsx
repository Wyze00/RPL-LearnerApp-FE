import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import type { Enrollment } from "../../types/enrollment.type";
import { getYoutubeThumbnailUrl } from "../../utils/getYoutbeThumbnailUrl";

export default function EnrollmentPage(): React.JSX.Element {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true)
        setError('');

        (async () => {
            try {
                const response = await fetch('/api/enrollments')

                if (response.ok) {
                    const { data } = await response.json() as ResponseWithData<Enrollment[]>
                    setEnrollments(data)
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }
            } catch (error) {
                console.error(error);
                setError('Gagal memuat daftar kursus Anda. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        })();
    }, [])

    // Grouping enrollments
    const categorized = useMemo(() => {
        return {
            ready: enrollments.filter(e => e.progress === 0),
            ongoing: enrollments.filter(e => e.progress > 0 && e.progress < 100),
            completed: enrollments.filter(e => e.progress === 100)
        };
    }, [enrollments]);

    if (loading) return <LoadingOverlay />;

    if (enrollments.length === 0 && !loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-64 h-64 bg-[#FFFBE9] rounded-full flex items-center justify-center mb-8 relative">
                    <svg className="w-32 h-32 text-[#AD8B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#AD8B73] rounded-full flex items-center justify-center text-[#FFFBE9] shadow-lg animate-bounce">
                        <span className="text-2xl font-bold">?</span>
                    </div>
                </div>
                <h1 className="text-4xl font-black font-outfit text-[#1E293B] mb-4">Belum ada kursus?</h1>
                <p className="text-lg font-jakarta text-[#AD8B73] max-w-md mb-10 leading-relaxed">
                    Anda belum terdaftar di kursus apa pun. Ayo temukan kursus yang sesuai dengan minat Anda sekarang!
                </p>
                <Link 
                    to="/course"
                    className="px-10 py-4 bg-[#AD8B73] text-[#FFFBE9] rounded-2xl font-bold text-xl shadow-xl hover:bg-[#1E293B] hover:-translate-y-1 transition-all duration-300"
                >
                    Jelajahi Kursus
                </Link>
            </div>
        );
    }

    const EnrollmentSection = ({ title, items, badgeColor }: { title: string, items: Enrollment[], badgeColor: string }) => (
        items.length > 0 ? (
            <div className="mb-16 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-black font-outfit text-[#1E293B]">{title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor} text-white`}>
                        {items.length}
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((enrollment) => (
                        <Link 
                            key={enrollment.id}
                            to={`/learner/enrollment/${enrollment.id}`}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-[#E3CAA5]/30 flex flex-col"
                        >
                            <div className="aspect-video relative overflow-hidden bg-[#FFFBE9]">
                                <img 
                                    src={getYoutubeThumbnailUrl(enrollment.course.preview_video_link)} 
                                    alt={enrollment.course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full font-bold text-[#AD8B73] shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        Lanjutkan Belajar
                                    </span>
                                </div>
                                {enrollment.progress === 100 && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                                        Completed
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold font-outfit text-[#1E293B] mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-[#AD8B73] transition-colors">
                                    {enrollment.course.title}
                                </h3>
                                
                                <p className="text-xs font-jakarta text-[#CEAB93] font-bold uppercase tracking-widest mb-6">
                                    Instructor ID: {enrollment.course.instructor_id}
                                </p>

                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between text-sm font-bold font-jakarta">
                                        <span className="text-[#8b6b55]">Progress</span>
                                        <span className="text-[#1E293B]">{enrollment.progress}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-[#FFFBE9] rounded-full overflow-hidden border border-[#E3CAA5]/20">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#AD8B73] to-[#CEAB93] transition-all duration-1000 ease-out shadow-inner"
                                            style={{ width: `${enrollment.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        ) : null
    );

    return (
        <div className="min-h-screen bg-[#FFFBE9]/30 pt-12 pb-24 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}

            <div className="max-w-7xl mx-auto">
                <header className="mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-5xl font-black font-outfit text-[#1E293B] mb-4">My Learning</h1>
                    <p className="text-lg font-jakarta text-[#AD8B73] font-medium max-w-2xl">
                        Kelola dan lanjutkan perjalanan belajar Anda di sini. Teruslah berkembang setiap hari!
                    </p>
                </header>

                <EnrollmentSection 
                    title="Sedang Dipelajari" 
                    items={categorized.ongoing} 
                    badgeColor="bg-[#AD8B73]" 
                />

                <EnrollmentSection 
                    title="Baru Terdaftar" 
                    items={categorized.ready} 
                    badgeColor="bg-[#CEAB93]" 
                />

                <EnrollmentSection 
                    title="Telah Selesai" 
                    items={categorized.completed} 
                    badgeColor="bg-[#1E293B]" 
                />
            </div>
        </div>
    );
}