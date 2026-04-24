import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import { type Video } from "../../types/video.type";
import { getYoutubeThumbnailUrl } from "../../utils/getYoutbeThumbnailUrl";
import { getYoutubeEmbedUrl } from "../../utils/getYoutubeEmbedUrl";

// Komponen EditableField untuk konsistensi UI
const EditableField = ({ label, value, field, onChange, editingField, setEditingField, type = "text" }: any) => {
    const isEditing = editingField === field;

    return (
        <div className="group relative py-4 px-6 rounded-2xl hover:bg-white/50 transition-all border-2 border-transparent hover:border-[#E3CAA5]/30">
            <label className="text-xs font-black uppercase tracking-widest text-[#AD8B73] mb-1 block">{label}</label>
            {isEditing ? (
                <div className="space-y-3">
                    <input 
                        autoFocus
                        type={type}
                        className="w-full bg-white border-2 border-[#AD8B73] rounded-xl px-4 py-2 font-jakarta text-[#1E293B] focus:outline-none"
                        value={value}
                        onChange={(e) => onChange(field, type === 'number' ? parseInt(e.target.value) : e.target.value)}
                        onBlur={() => setTimeout(() => setEditingField(null), 200)}
                    />
                </div>
            ) : (
                <div 
                    onClick={() => setEditingField(field)}
                    className="cursor-pointer flex justify-between items-center"
                >
                    <div className={`font-jakarta text-[#1E293B] ${field === 'title' ? 'text-3xl font-black font-outfit' : 'text-lg font-medium'}`}>
                        {value || `Klik untuk isi ${label.toLowerCase()}...`}
                    </div>
                    <svg className="w-5 h-5 text-[#CEAB93] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default function InstructorCourseVideoPage(): React.JSX.Element {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const { courseId, videoId } = useParams();
    
    const [video, setVideo] = useState<Video>({
        id: '',
        title: '',
        link: '',
        duration: 0,
        order: 1
    });

    const [editingField, setEditingField] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const fetchVideoData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/courses/${courseId}/videos/${videoId}`);
            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<Video>;
                setVideo(data);
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error);
            }
        } catch (err) {
            setError('Gagal memuat data video.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [courseId, videoId]);

    const handleFieldChange = (field: string, value: any) => {
        setVideo(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleUpdateVideo = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/courses/${courseId}/videos/${videoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: video.title,
                    link: video.link,
                    order: video.order,
                    duration: video.duration,
                }),
            });

            if (response.ok) {
                setHasChanges(false);
                setEditingField(null);
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error);
            }
        } catch (err) {
            setError('Gagal memperbarui video.');
        } finally {
            setLoading(false);
        }
    }, [courseId, videoId, video]);

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-24 pb-24 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header & Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4">
                        <Link 
                            to={`/instructor/course/${courseId}`} 
                            className="p-3 bg-white rounded-2xl text-[#AD8B73] hover:text-[#1E293B] shadow-sm border border-[#E3CAA5]/30 hover:-translate-x-1 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black font-outfit text-[#1E293B]">Edit Materi Video</h1>
                            <p className="text-[#AD8B73] font-medium font-jakarta text-sm">Sesuaikan konten video dan urutan pembelajaran.</p>
                        </div>
                    </div>

                    {hasChanges && (
                        <button 
                            onClick={handleUpdateVideo}
                            className="flex items-center gap-2 px-8 py-4 bg-[#1E293B] text-[#FFFBE9] rounded-2xl font-bold text-lg shadow-xl hover:bg-[#AD8B73] hover:-translate-y-1 transition-all duration-300 animate-in zoom-in-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            Simpan Perubahan
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Edit Form Area */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                        <div className="bg-white/40 rounded-[2.5rem] p-4 border-2 border-[#E3CAA5]/20">
                            <EditableField 
                                label="Judul Video" 
                                value={video.title} 
                                field="title" 
                                onChange={handleFieldChange}
                                editingField={editingField}
                                setEditingField={setEditingField}
                            />
                            
                            <div className="space-y-4">
                                <EditableField 
                                    label="Link YouTube" 
                                    value={video.link} 
                                    field="link" 
                                    onChange={handleFieldChange}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                />
                                {video.link && (
                                    <div className="px-6 pb-4">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                            <img 
                                                src={getYoutubeThumbnailUrl(video.link)} 
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-[#AD8B73]">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <EditableField 
                                    label="Urutan (Order)" 
                                    value={video.order} 
                                    field="order" 
                                    type="number" 
                                    onChange={handleFieldChange}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                />
                                <EditableField 
                                    label="Durasi (Detik)" 
                                    value={video.duration} 
                                    field="duration" 
                                    type="number" 
                                    onChange={handleFieldChange}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                />
                            </div>
                        </div>

                        <div className="bg-[#1E293B] rounded-3xl p-8 text-[#FFFBE9] shadow-xl">
                            <h3 className="text-xl font-bold font-outfit mb-4">Tips Konten Video:</h3>
                            <ul className="space-y-3 font-jakarta text-[#CEAB93] text-sm list-disc ml-4">
                                <li>Pastikan judul video jelas dan mewakili isi materi.</li>
                                <li>Gunakan durasi yang tidak terlalu panjang (idealnya 5-15 menit) untuk menjaga fokus siswa.</li>
                                <li>Urutan video yang logis sangat membantu alur belajar siswa.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                        <h2 className="text-2xl font-black font-outfit text-[#1E293B]">Pratinjau Video</h2>
                        <div className="bg-black rounded-[2rem] overflow-hidden shadow-2xl relative aspect-video">
                            {video.link ? (
                                <iframe 
                                    className="w-full h-full"
                                    src={getYoutubeEmbedUrl(video.link)}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-[#CEAB93] gap-4">
                                    <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <p className="font-bold">Link video belum tersedia</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-[#E3CAA5]/30">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#FFFBE9] rounded-xl flex items-center justify-center text-[#AD8B73]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1E293B]">Statistik Video</h4>
                                    <p className="text-sm text-[#AD8B73]">Video ini akan muncul sebagai bagian ke-{video.order} dalam kurikulum.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}