import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import type { EnrollmentVideo } from "../../types/enrollment.type";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import { getYoutubeEmbedUrl } from "../../utils/getYoutubeEmbedUrl";

export default function EnrollmentVideoPage(): React.JSX.Element {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const { enrollmentId, videoId } = useParams();
    const navigate = useNavigate();
    const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean>(false);
    
    const [enrollmentVideo, setEnrollmentVideo] = useState<EnrollmentVideo>({
        enroll_id: '',
        id: '',
        isCompleted: false,
        video: {
            duration: 0,
            id: '',
            link: '',
            order: 0,
            title: ''
        },
        video_id: ''
    })

    useEffect(() => {
        setLoading(true);
        setError('');

        (async () => {
            try {
                const response = await fetch(`/api/enrollments/${enrollmentId}/videos/${videoId}`);

                if (response.ok) {
                    const { data } = await response.json() as ResponseWithData<EnrollmentVideo>;
                    setEnrollmentVideo(data);
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }
            } catch (error) {
                console.log(error);
                setError('Gagal memuat data video. Silakan coba lagi.');                
            } finally {
                setLoading(false);
            }
        })()
    }, [enrollmentId, videoId]);

    const handleDone = useCallback(() => {
        setLoading(true);
        setError('');

        (async () => {
            try {
                const response = await fetch(`/api/enrollments/${enrollmentId}/videos/${videoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        isCompleted: true,
                    })
                });

                if (response.ok) {
                    setIsUpdateSuccess(true);
                    setEnrollmentVideo(prev => ({ ...prev, isCompleted: true }));
                } else {
                    const { error } = await response.json() as ResponseWithError;
                    setError(error);
                }
            } catch (error) {
                console.log(error);
                setError('Terjadi kesalahan saat memperbarui progres.');                
            } finally {
                setLoading(false);
            }
        })()
    }, [enrollmentId, videoId]);

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-24 pb-20 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            {/* Popup Sukses Update */}
            {isUpdateSuccess && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#1E293B]/80 backdrop-blur-lg animate-in fade-in duration-500 p-4">
                    <div className="bg-white rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl text-center transform transition-all animate-in zoom-in-95 duration-500 border-8 border-[#FFFBE9]">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30 animate-bounce">
                            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black font-outfit text-[#1E293B] mb-4">Progres Disimpan!</h2>
                        <p className="font-jakarta text-[#8b6b55] text-lg mb-10 leading-relaxed">
                            Video ini telah ditandai sebagai selesai. Teruskan semangat belajar Anda!
                        </p>
                        <button 
                            onClick={() => navigate(`/learner/enrollment/${enrollmentId}`)}
                            className="inline-block w-full py-4 bg-[#AD8B73] text-[#FFFBE9] rounded-2xl font-bold text-xl shadow-xl hover:bg-[#1E293B] hover:-translate-y-1 transition-all duration-300"
                        >
                            Kembali ke Daftar Video
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto space-y-10">
                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                        <Link 
                            to={`/learner/enrollment/${enrollmentId}`}
                            className="inline-flex items-center gap-2 text-[#AD8B73] font-bold text-sm hover:text-[#1E293B] transition-colors group"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                            Kembali ke Detail Kursus
                        </Link>
                        <h1 className="text-3xl md:text-5xl font-black font-outfit text-[#1E293B] leading-tight">
                            {enrollmentVideo.video.title}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-[#1E293B] text-[#FFFBE9] rounded-lg text-xs font-bold font-jakarta uppercase tracking-wider">
                                Video {enrollmentVideo.video.order}
                            </span>
                            <span className="text-[#CEAB93] font-bold text-sm">
                                {Math.floor(enrollmentVideo.video.duration / 60)}:{(enrollmentVideo.video.duration % 60).toString().padStart(2, '0')} min
                            </span>
                        </div>
                    </div>

                    {!enrollmentVideo.isCompleted && (
                        <button 
                            onClick={handleDone}
                            className="flex items-center gap-3 px-8 py-4 bg-[#AD8B73] text-[#FFFBE9] rounded-2xl font-bold text-lg shadow-xl shadow-[#AD8B73]/20 hover:bg-[#1E293B] hover:-translate-y-1 transition-all duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            Tandai Selesai
                        </button>
                    )}

                    {enrollmentVideo.isCompleted && (
                        <div className="flex items-center gap-3 px-8 py-4 bg-green-500/10 text-green-600 rounded-2xl font-bold text-lg border-2 border-green-500/20">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                            Selesai Ditonton
                        </div>
                    )}
                </div>

                {/* Video Player Area */}
                <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl shadow-[#AD8B73]/10 relative aspect-video animate-in zoom-in-95 duration-700">
                    <iframe 
                        className="w-full h-full"
                        src={getYoutubeEmbedUrl(enrollmentVideo.video.link)}
                        title={enrollmentVideo.video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Additional Info Box */}
                <div className="bg-white rounded-3xl p-8 border border-[#E3CAA5]/30 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h3 className="text-xl font-bold font-outfit text-[#1E293B] mb-4">Catatan Pembelajaran</h3>
                    <p className="font-jakarta text-[#8b6b55] leading-relaxed">
                        Pastikan Anda memahami materi pada video ini sebelum melanjutkan ke video berikutnya. 
                        Tandai video sebagai selesai untuk memperbarui progres kursus Anda dan mendekatkan Anda pada perolehan sertifikat!
                    </p>
                </div>
            </div>
        </div>
    );
}