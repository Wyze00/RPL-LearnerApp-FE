import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import type { CourseIncludeVideo } from "../../types/course.type";
import type { ResponseWithData, ResponseWithError } from "../../types/response.type";
import { type Video } from "../../types/video.type";
import { getYoutubeThumbnailUrl } from "../../utils/getYoutbeThumbnailUrl";

// Pindahkan EditableField ke luar untuk mencegah re-mount (dan hilangnya fokus) pada setiap render
const EditableField = ({ label, value, field, onChange, editingField, setEditingField, type = "text", isTextArea = false }: any) => {
    const isEditing = editingField === field;

    return (
        <div className="group relative py-4 px-6 rounded-2xl hover:bg-white/50 transition-all border-2 border-transparent hover:border-[#E3CAA5]/30">
            <label className="text-xs font-black uppercase tracking-widest text-[#AD8B73] mb-1 block">{label}</label>
            {isEditing ? (
                <div className="space-y-3">
                    {isTextArea ? (
                        <textarea 
                            autoFocus
                            className="w-full bg-white border-2 border-[#AD8B73] rounded-xl p-4 font-jakarta text-[#1E293B] focus:outline-none"
                            value={value}
                            rows={5}
                            onChange={(e) => onChange(field, e.target.value)}
                            onBlur={() => setTimeout(() => setEditingField(null), 200)} // Delay sedikit agar tidak langsung menutup saat klik tombol lain
                        />
                    ) : (
                        <input 
                            autoFocus
                            type={type}
                            className="w-full bg-white border-2 border-[#AD8B73] rounded-xl px-4 py-2 font-jakarta text-[#1E293B] focus:outline-none"
                            value={value}
                            onChange={(e) => onChange(field, type === 'number' ? parseInt(e.target.value) : e.target.value)}
                            onBlur={() => setTimeout(() => setEditingField(null), 200)}
                        />
                    )}
                </div>
            ) : (
                <div 
                    onClick={() => setEditingField(field)}
                    className="cursor-pointer flex justify-between items-center"
                >
                    <div className={`font-jakarta text-[#1E293B] ${field === 'title' ? 'text-3xl font-black font-outfit' : 'text-lg font-medium'}`}>
                        {field === 'price' ? `Rp ${value.toLocaleString()}` : value || `Klik untuk isi ${label.toLowerCase()}...`}
                    </div>
                    <svg className="w-5 h-5 text-[#CEAB93] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </div>
            )}
        </div>
    );
};

export default function InstructorCoursePage(): React.JSX.Element {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const { courseId } = useParams();
    
    const [course, setCourse] = useState<CourseIncludeVideo>({
        id: '',
        title: '',
        description: '',
        instructor_id: '',
        preview_video_link: '',
        price: 0,
        videos: [],
    });

    const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
    const [newVideo, setNewVideo] = useState<Partial<Video>>({
        title: '',
        link: '',
        order: 1,
        duration: 0
    });

    const [editingField, setEditingField] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const fetchCourseData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/courses/${courseId}`);
            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<CourseIncludeVideo>;
                setCourse(data);
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error);
            }
        } catch (err) {
            setError('Gagal memuat data kursus.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const handleFieldChange = (field: string, value: any) => {
        setCourse(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleUpdateCourse = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: course.title,
                    description: course.description,
                    preview_video_link: course.preview_video_link,
                    price: course.price,
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
            setError('Gagal memperbarui kursus.');
        } finally {
            setLoading(false);
        }
    }, [courseId, course]);

    const handleAddVideo = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/courses/${courseId}/videos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVideo),
            });

            if (response.ok) {
                const { data } = await response.json() as ResponseWithData<Video>;
                setCourse(prev => ({ ...prev, videos: [...prev.videos, data].sort((a, b) => a.order - b.order) }));
                setIsAddVideoModalOpen(false);
                setNewVideo({ title: '', link: '', order: course.videos.length + 1, duration: 0 });
            } else {
                const { error } = await response.json() as ResponseWithError;
                setError(error);
            }
        } catch (err) {
            setError('Gagal menambahkan video.');
        } finally {
            setLoading(false);
        }
    }, [courseId, newVideo, course.videos.length]);

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-24 pb-24 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/instructor" 
                            className="p-3 bg-white rounded-2xl text-[#AD8B73] hover:text-[#1E293B] shadow-sm border border-[#E3CAA5]/30 hover:-translate-x-1 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black font-outfit text-[#1E293B]">Kelola Kursus</h1>
                            <p className="text-[#AD8B73] font-medium font-jakarta text-sm">Klik pada teks untuk mengedit, lalu tekan Update untuk simpan.</p>
                        </div>
                    </div>

                    {hasChanges && (
                        <button 
                            onClick={handleUpdateCourse}
                            className="flex items-center gap-2 px-8 py-4 bg-[#1E293B] text-[#FFFBE9] rounded-2xl font-bold text-lg shadow-xl hover:bg-[#AD8B73] hover:-translate-y-1 transition-all duration-300 animate-in zoom-in-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            Update Informasi Kursus
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                        <div className="bg-white/40 rounded-[2.5rem] p-4 border-2 border-[#E3CAA5]/20">
                            <EditableField 
                                label="Judul Kursus" 
                                value={course.title} 
                                field="title" 
                                onChange={handleFieldChange} 
                                editingField={editingField}
                                setEditingField={setEditingField}
                            />
                            <EditableField 
                                label="Deskripsi Lengkap" 
                                value={course.description} 
                                field="description" 
                                isTextArea={true} 
                                onChange={handleFieldChange}
                                editingField={editingField}
                                setEditingField={setEditingField}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <EditableField 
                                        label="Preview Video URL" 
                                        value={course.preview_video_link} 
                                        field="preview_video_link" 
                                        onChange={handleFieldChange}
                                        editingField={editingField}
                                        setEditingField={setEditingField}
                                    />
                                    {course.preview_video_link && (
                                        <div className="px-6 pb-4 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-lg shadow-[#AD8B73]/20">
                                                <img 
                                                    src={getYoutubeThumbnailUrl(course.preview_video_link)} 
                                                    alt="Thumbnail Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    onLoad={(e) => (e.currentTarget.style.display = 'block')}
                                                />
                                                <div className="absolute inset-0 bg-[#1E293B]/20 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-[#AD8B73] shadow-inner">
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-bold text-[#CEAB93] mt-2 uppercase tracking-widest text-center">Live Thumbnail Preview</p>
                                        </div>
                                    )}
                                </div>
                                <EditableField 
                                    label="Harga Kursus (IDR)" 
                                    value={course.price} 
                                    field="price" 
                                    type="number" 
                                    onChange={handleFieldChange}
                                    editingField={editingField}
                                    setEditingField={setEditingField}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black font-outfit text-[#1E293B]">Kurikulum</h2>
                            <button 
                                onClick={() => setIsAddVideoModalOpen(true)}
                                className="p-3 bg-[#AD8B73] text-white rounded-xl shadow-lg hover:bg-[#1E293B] hover:-translate-y-1 transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {course.videos.map((v) => (
                                <Link 
                                    key={v.id}
                                    to={`/instructor/course/${courseId}/video/${v.id}`}
                                    className="group flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-transparent hover:border-[#AD8B73] shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#FFFBE9]">
                                        <img src={getYoutubeThumbnailUrl(v.link)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold font-jakarta text-[#1E293B] truncate group-hover:text-[#AD8B73] transition-colors">{v.title}</h4>
                                        <p className="text-xs font-bold text-[#CEAB93] mt-1">Video {v.order} • {Math.floor(v.duration/60)}:{(v.duration%60).toString().padStart(2, '0')} min</p>
                                    </div>
                                    <svg className="w-5 h-5 text-[#E3CAA5] group-hover:text-[#AD8B73] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Video Modal */}
            {isAddVideoModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1E293B]/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl border-4 border-[#FFFBE9]">
                        <h2 className="text-3xl font-black font-outfit text-[#1E293B] mb-8">Tambah Video Baru</h2>
                        <form onSubmit={handleAddVideo} className="space-y-6 font-jakarta">
                            <div className="space-y-2">
                                <label className="font-bold text-[#AD8B73]">Judul Video</label>
                                <input 
                                    type="text" required
                                    className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none"
                                    value={newVideo.title}
                                    onChange={e => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="font-bold text-[#AD8B73]">Link YouTube</label>
                                <input 
                                    type="url" required
                                    className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none"
                                    value={newVideo.link}
                                    onChange={e => setNewVideo(prev => ({ ...prev, link: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Urutan</label>
                                    <input 
                                        type="number" required
                                        className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none"
                                        value={newVideo.order}
                                        onChange={e => setNewVideo(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-bold text-[#AD8B73]">Durasi (Detik)</label>
                                    <input 
                                        type="number" required
                                        className="w-full px-6 py-4 bg-[#FFFBE9] rounded-2xl border-2 border-transparent focus:border-[#AD8B73] focus:outline-none"
                                        value={newVideo.duration}
                                        onChange={e => setNewVideo(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 py-4 bg-[#1E293B] text-white rounded-2xl font-bold hover:bg-[#AD8B73] transition-all shadow-lg">Tambah Video</button>
                                <button type="button" onClick={() => setIsAddVideoModalOpen(false)} className="px-8 py-4 bg-[#FFFBE9] text-[#AD8B73] rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}