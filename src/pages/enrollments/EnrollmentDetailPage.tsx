import { useEffect, useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useParams, Link } from "react-router";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import type { EnrollmentWithVideo } from "../../types/enrollment.type";

export default function EnrollmentDetailPage(): React.JSX.Element {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const { enrollmentId } = useParams();
    const [enrollment, setEnrollment] = useState<EnrollmentWithVideo | null>(null);

    useEffect(() => {
        setLoading(true);
        setError('');

        (async () => {
            try {
                const response = await fetch(`/api/enrollments/${enrollmentId}`);

                if (response.ok) {
                    const { data } = await response.json() as ResponseWithData<EnrollmentWithVideo>;
                    setEnrollment(data);
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }
            } catch (error) {
                console.log(error);
                setError('Gagal memuat detail pembelajaran. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        })()
    }, [enrollmentId]);

    if (loading) return <LoadingOverlay />;
    if (!enrollment) return <ErrorBanner error={error || "Data tidak ditemukan"} setError={setError} />;

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-20 pb-24 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}

            <div className="max-w-7xl mx-auto">
                {/* Header & Progress */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E3CAA5]/30 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <Link 
                                to="/learner/enrollment" 
                                className="inline-flex items-center gap-2 text-[#AD8B73] font-bold text-sm hover:text-[#1E293B] transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                                Kembali ke My Learning
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-black font-outfit text-[#1E293B] leading-tight">
                                {enrollment.course.title}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-[#AD8B73]/10 text-[#AD8B73] rounded-full text-xs font-bold font-jakarta uppercase tracking-wider">
                                    Instructor ID: {enrollment.course.instructor_id}
                                </span>
                            </div>
                        </div>

                        <div className="min-w-[280px] space-y-4">
                            <div className="flex items-center justify-between font-bold font-jakarta">
                                <span className="text-[#8b6b55]">Keseluruhan Progress</span>
                                <span className="text-2xl text-[#1E293B]">{enrollment.progress}%</span>
                            </div>
                            <div className="h-4 w-full bg-[#FFFBE9] rounded-full overflow-hidden border border-[#E3CAA5]/20 shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#AD8B73] to-[#CEAB93] transition-all duration-1000 ease-out"
                                    style={{ width: `${enrollment.progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs font-jakarta text-[#CEAB93] text-right font-medium italic">
                                Selesaikan semua video untuk mendapatkan sertifikat!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Description Area */}
                    <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#E3CAA5]/30">
                            <h2 className="text-2xl font-black font-outfit text-[#1E293B] mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-[#AD8B73] rounded-full"></span>
                                Tentang Kursus Ini
                            </h2>
                            <div 
                                className="font-jakarta text-[#8b6b55] leading-relaxed prose prose-[#AD8B73] max-w-none"
                                dangerouslySetInnerHTML={{ __html: enrollment.course.description }}
                            />
                        </div>
                        
                        <div className="bg-[#1E293B] rounded-3xl p-8 md:p-10 text-[#FFFBE9] shadow-xl">
                            <h3 className="text-xl font-bold font-outfit mb-4">Tips Belajar:</h3>
                            <ul className="space-y-3 font-jakarta text-[#CEAB93] text-sm list-disc ml-4">
                                <li>Tonton video secara berurutan untuk pemahaman maksimal.</li>
                                <li>Jangan lupa untuk mempraktikkan langsung apa yang Anda pelajari.</li>
                                <li>Gunakan fitur diskusi jika Anda menemui kendala.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Video Curriculum */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                        <h2 className="text-2xl font-black font-outfit text-[#1E293B] flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-[#AD8B73] rounded-full"></span>
                            Kurikulum Belajar
                        </h2>
                        <div className="space-y-4">
                            {enrollment.enrollmentVideos.map((video) => {
                                const isCompleted = video.isCompleted || false;
                                return (
                                    <Link 
                                        key={video.id}
                                        to={`/learner/enrollment/${enrollment.id}/video/${video.id}`}
                                        className={`group flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                                            isCompleted 
                                                ? 'bg-[#FFFBE9]/30 border-green-200 hover:border-green-400' 
                                                : 'bg-white border-[#E3CAA5]/30 hover:border-[#AD8B73] hover:shadow-lg'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                            isCompleted ? 'bg-green-100 text-green-600' : 'bg-[#FFFBE9] text-[#AD8B73] group-hover:bg-[#AD8B73] group-hover:text-white'
                                        }`}>
                                            {isCompleted ? (
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <h4 className={`font-bold font-jakarta leading-snug line-clamp-2 transition-colors ${
                                                isCompleted ? 'text-green-800' : 'text-[#1E293B] group-hover:text-[#AD8B73]'
                                            }`}>
                                                {video.video.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-[#CEAB93]">
                                                    Order: {video.video.order}
                                                </span>
                                                <span className="text-[10px] text-[#CEAB93]">•</span>
                                                <span className="text-[10px] font-bold text-[#CEAB93]">
                                                    {Math.floor(video.video.duration / 60)}:{(video.video.duration % 60).toString().padStart(2, '0')} min
                                                </span>
                                            </div>
                                        </div>

                                        {!isCompleted && (
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[#AD8B73]">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}