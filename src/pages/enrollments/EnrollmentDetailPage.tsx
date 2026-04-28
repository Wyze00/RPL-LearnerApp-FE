import { useEffect, useState } from "react";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useParams, Link } from "react-router";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import type { EnrollmentWithVideo } from "../../types/enrollment.type";
import { useAppSelector } from "../../hooks/useAppSelector";

export default function EnrollmentDetailPage(): React.JSX.Element {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const { enrollmentId } = useParams();
    const [enrollment, setEnrollment] = useState<EnrollmentWithVideo | null>(null);
    const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user);

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
                            {enrollment.progress >= 100 ? (
                                <button 
                                    onClick={() => setShowCertificateModal(true)}
                                    className="w-full py-3 bg-gradient-to-r from-[#AD8B73] to-[#CEAB93] hover:from-[#8b6b55] hover:to-[#AD8B73] text-[#FFFBE9] font-bold rounded-2xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 font-jakarta text-sm mt-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Cetak Sertifikat
                                </button>
                            ) : (
                                <p className="text-xs font-jakarta text-[#CEAB93] text-right font-medium italic">
                                    Selesaikan semua video untuk mendapatkan sertifikat!
                                </p>
                            )}
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
                {/* Certificate Modal */}
                {showCertificateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/80 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="absolute inset-0" onClick={() => setShowCertificateModal(false)}></div>
                        
                        <style dangerouslySetInnerHTML={{ __html: `
                            @media print {
                                body * {
                                    visibility: hidden !important;
                                }
                                #certificate-print, #certificate-print * {
                                    visibility: visible !important;
                                }
                                #certificate-print {
                                    position: fixed !important;
                                    left: 50% !important;
                                    top: 50% !important;
                                    transform: translate(-50%, -50%) scale(0.9) !important;
                                    width: 100vw !important;
                                    max-width: 100vw !important;
                                    height: auto !important;
                                    border: none !important;
                                    background-color: white !important;
                                    box-shadow: none !important;
                                    padding: 20px !important;
                                    margin: 0 !important;
                                }
                                .print-hide {
                                    display: none !important;
                                }
                            }
                        ` }} />

                        <div id="certificate-print" className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 md:p-12 border-4 border-[#E3CAA5] animate-in zoom-in-95 duration-300 print:border-0">
                            {/* Close Button */}
                            <button 
                                onClick={() => setShowCertificateModal(false)}
                                className="absolute top-4 right-4 text-[#AD8B73] hover:text-[#1E293B] transition-colors print-hide"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Certificate Design */}
                            <div className="border-8 border-double border-[#AD8B73] p-6 md:p-10 relative bg-[#FFFBE9]/50 rounded-xl flex flex-col items-center justify-center text-center min-h-[450px] md:min-h-[550px]">
                                {/* Background decorative elements */}
                                <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-[#AD8B73]"></div>
                                <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-[#AD8B73]"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-[#AD8B73]"></div>
                                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-[#AD8B73]"></div>

                                <span className="text-[#AD8B73] font-outfit tracking-widest font-black text-base mb-4 uppercase">E-LEARNING PLATFORM</span>
                                
                                <h2 className="text-4xl md:text-6xl font-extrabold font-outfit text-[#1E293B] mb-2 tracking-wide">CERTIFICATE</h2>
                                <p className="text-[#AD8B73] font-outfit tracking-[0.2em] text-xs md:text-sm uppercase mb-8 md:mb-12 font-bold">OF COMPLETION</p>

                                <p className="font-jakarta text-[#8b6b55] italic text-sm mb-3">Dengan ini menyatakan bahwa</p>
                                
                                <h3 className="text-3xl md:text-5xl font-black font-jakarta text-[#1E293B] mb-3 border-b-2 border-[#E3CAA5] pb-2 px-8 min-w-[250px] tracking-wide">
                                    {user?.username || 'Learner'}
                                </h3>

                                <p className="font-jakarta text-[#8b6b55] italic text-sm mb-6">telah berhasil menyelesaikan kelas online</p>

                                <h4 className="text-2xl md:text-3xl font-extrabold font-outfit text-[#AD8B73] max-w-2xl mb-10 md:mb-16 leading-tight">
                                    {enrollment.course.title}
                                </h4>

                                <div className="flex flex-row justify-between items-end w-full px-8 md:px-16 mt-auto pt-6">
                                    <div className="text-center">
                                        <div className="border-b border-[#AD8B73] w-32 md:w-40 mb-2"></div>
                                        <p className="text-[10px] md:text-xs font-bold text-[#8b6b55] font-jakarta">Instructor ID: {enrollment.course.instructor_id}</p>
                                    </div>

                                    {/* Seal */}
                                    <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-[#AD8B73] to-[#CEAB93] rounded-full flex items-center justify-center shadow-lg border-4 border-white relative flex-shrink-0">
                                        <div className="absolute inset-1 border border-white/50 rounded-full"></div>
                                        <svg className="w-10 h-10 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>

                                    <div className="text-center">
                                        <div className="border-b border-[#AD8B73] w-32 md:w-40 mb-2"></div>
                                        <p className="text-[10px] md:text-xs font-bold text-[#8b6b55] font-jakarta">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Print Button */}
                            <div className="flex justify-center gap-4 mt-6 print-hide">
                                <button 
                                    onClick={() => window.print()}
                                    className="px-6 py-3 bg-[#1E293B] hover:bg-[#0F172A] text-[#FFFBE9] font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-jakarta"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2z" />
                                    </svg>
                                    Cetak / Unduh Sertifikat
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}