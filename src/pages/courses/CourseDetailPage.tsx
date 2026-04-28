import { useCallback, useEffect, useState } from "react";
import type { CourseIncludeVideo } from "../../types/course.type";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import { useParams, Link } from "react-router";
import LoadingOverlay from "../../components/LoadingOverlay";
import ErrorBanner from "../../components/ErrorBanner";
import { getYoutubeEmbedUrl } from "../../utils/getYoutubeEmbedUrl";


export default function CourseDetailPage(): React.JSX.Element {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [course, setCourse] = useState<CourseIncludeVideo>({
        id: '',
        description: '',
        instructor_id: '',
        preview_video_link: '',
        price: 0,
        title: '',
        videos: []
    });
    const { id } = useParams<{ id: string }>();
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
    const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(`/api/courses/${id}`);

                if (response.ok) {
                    const { data } = await response.json() as ResponseWithData<CourseIncludeVideo>;
                    setCourse(data);
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }
            } catch (error) {
                console.error(error);
                setError('Gagal Fetch Course');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleEnroll = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch(`/api/courses/${id}/enroll`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setIsEnrolled(true);
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error);
            }
        } catch (error) {
            console.error(error);
            setError('Failed to enroll in course');
        } finally {
            setLoading(false);
            setIsConfirmationModalOpen(false);
        }
    }, [id]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <LoadingOverlay />;
    if (!course && !loading) return <ErrorBanner error={error || "Course not found"} setError={setError} />;

    const currentCourse = course;
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(currentCourse.price);

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-20 pb-20">
            {error && <ErrorBanner error={error} setError={setError} />}

            {/* Modal Konfirmasi Enrollment */}
            {isConfirmationModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-500 p-4">
                    <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 border-4 border-[#FFFBE9]">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black font-outfit text-[#1E293B] mb-2">Konfirmasi Enrollment</h2>
                            <p className="font-jakarta text-[#AD8B73]">Apakah Anda yakin ingin mendaftar ke kursus ini?</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <button 
                                onClick={() => setIsConfirmationModalOpen(false)}
                                className="py-4 rounded-2xl font-bold font-jakarta text-[#AD8B73] border-2 border-[#AD8B73] hover:bg-[#FFFBE9] transition-all"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => handleEnroll()}
                                disabled={loading}
                                className="py-4 rounded-2xl font-bold font-jakarta bg-[#1E293B] text-[#FFFBE9] hover:bg-[#AD8B73] hover:-translate-y-1 shadow-lg shadow-[#1E293B]/20 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {loading ? 'Memproses...' : 'Ya, Daftar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sukses Enrollment Overlay */}
            {isEnrolled && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#1E293B]/80 backdrop-blur-lg animate-in fade-in duration-500 p-4">
                    <div className="bg-white rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl text-center transform transition-all animate-in zoom-in-95 duration-500 border-8 border-[#FFFBE9]">
                        <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30 animate-bounce">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <h2 className="text-4xl font-black font-outfit text-[#1E293B] mb-4">Enrollment Berhasil!</h2>
                        <p className="font-jakarta text-[#8b6b55] text-lg mb-10 leading-relaxed">
                            Selamat! Anda telah terdaftar di kursus ini. Silakan cek daftar kursus Anda untuk mulai belajar.
                        </p>
                        
                        <Link 
                            to="/learner/enrollment"
                            className="inline-block w-full py-5 bg-[#AD8B73] text-[#FFFBE9] rounded-2xl font-bold text-xl shadow-xl hover:bg-[#1E293B] hover:-translate-y-1 transition-all duration-300"
                        >
                            Lihat Kursus Saya
                        </Link>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="bg-[#1E293B] text-[#FFFBE9] py-16 px-6 lg:px-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 text-[#E3CAA5] font-bold text-sm tracking-widest uppercase animate-in fade-in slide-in-from-left-4 duration-500">
                            {/* <span className="bg-[#E3CAA5]/20 px-2 py-1 rounded">Web Development</span> */}
                            <span>•</span>
                            <span>Updated April 2026</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black font-outfit leading-tight drop-shadow-md animate-in fade-in slide-in-from-left-6 duration-700">
                            {currentCourse.title}
                        </h1>
                        
                        <p className="text-lg md:text-xl font-jakarta text-[#CEAB93] max-w-2xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-900">
                            Kuasai keterampilan tingkat lanjut untuk menjadi ahli dalam industri teknologi modern.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4 text-sm font-jakarta animate-in fade-in duration-1000">
                            <div className="flex items-center gap-2">
                                <span className="text-[#E3CAA5] font-bold underline cursor-pointer">{currentCourse.instructor_id}</span>
                            </div>
                            {/* <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-bold">4.9</span>
                                <span className="text-[#AD8B73]">(2,450 ratings)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">12,345 students</span>
                            </div> */}
                        </div>
                    </div>
                </div>
                
                {/* Decoration background */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#AD8B73]/5 to-transparent pointer-events-none"></div>
            </section>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Description Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E3CAA5]/30">
                        <h2 className="text-3xl font-black font-outfit text-[#1E293B] mb-6">Deskripsi Kursus</h2>
                        <div 
                            className="font-jakarta text-[#8b6b55] leading-relaxed prose prose-[#AD8B73]"
                            dangerouslySetInnerHTML={{ __html: currentCourse.description }}
                        />
                    </div>

                    {/* Curriculum Section */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black font-outfit text-[#1E293B]">Kurikulum Kursus</h2>
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#E3CAA5]/30">
                            {currentCourse.videos?.sort((a, b) => a.order - b.order).map((video, index) => (
                                <div 
                                    key={video.id}
                                    className={`flex items-center justify-between p-5 hover:bg-[#FFFBE9]/50 transition-colors cursor-pointer group ${
                                        index !== currentCourse.videos.length - 1 ? 'border-b border-[#FFFBE9]' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 aspect-video rounded-lg bg-[#E3CAA5]/20 flex items-center justify-center relative overflow-hidden">
                                            <svg className="w-8 h-8 text-[#AD8B73] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold font-jakarta text-[#1E293B] group-hover:text-[#AD8B73] transition-colors line-clamp-1">{video.title}</h4>
                                            <span className="text-xs font-medium text-[#CEAB93]">{formatDuration(video.duration)} min</span>
                                        </div>
                                    </div>
                                    <div className="text-[#CEAB93] opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Sticky Card */}
                <div className="lg:relative">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E3CAA5]/30 transform transition-all hover:shadow-[#AD8B73]/20">
                            {/* Video Preview */}
                            <div className="aspect-video bg-[#000] relative">
                                <iframe 
                                    className="w-full h-full"
                                    src={getYoutubeEmbedUrl(currentCourse.preview_video_link)}
                                    title="Course Preview"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black font-outfit text-[#1E293B]">{formattedPrice}</span>
                                </div>

                                <button 
                                    onClick={() => setIsConfirmationModalOpen(true)}
                                    className="block w-full py-4 bg-[#AD8B73] text-[#FFFBE9] text-center rounded-2xl font-bold text-xl shadow-lg shadow-[#AD8B73]/30 hover:bg-[#1E293B] hover:-translate-y-1 transition-all duration-300"
                                >
                                    Enroll Now
                                </button>

                                <div className="space-y-4 pt-4 text-sm font-medium text-[#1E293B]/70">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#AD8B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>24 jam durasi total video</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#AD8B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
                                        </svg>
                                        <span>Akses selamanya di mobile & web</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-[#AD8B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Sertifikat penyelesaian</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-[#FFFBE9] flex justify-between items-center text-xs font-bold text-[#AD8B73] uppercase tracking-widest">
                                    <button className="hover:text-[#1E293B] transition-colors">Share Course</button>
                                    <button className="hover:text-[#1E293B] transition-colors">Gift This Course</button>
                                </div>
                            </div>
                        </div>

                        {/* Instructor Bonus Info */}
                        <div className="bg-[#E3CAA5]/30 rounded-3xl p-8 border border-[#E3CAA5]/50">
                            <h4 className="font-bold font-outfit text-[#1E293B] mb-2">Punya pertanyaan?</h4>
                            <p className="text-sm font-jakarta text-[#8b6b55]">Dapatkan dukungan langsung dari pengajar expert kami melalui forum diskusi komunitas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}