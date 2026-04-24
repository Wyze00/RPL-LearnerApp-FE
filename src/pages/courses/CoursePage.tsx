import { useEffect, useState, useCallback } from "react";
import { type Course } from "../../types/course.type";
import { useSearchParams } from "react-router";
import type { ResponseWithData } from "../../types/response.type";
import ErrorBanner from "../../components/ErrorBanner";
import LoadingOverlay from "../../components/LoadingOverlay";
import CourseCard from "../../components/CourseCard";

const mockCourses: Course[] = [
    {
        id: "1",
        title: "Course 1",
        description: "Description 1",
        instructor_id: "1",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 100000,
    },
    {
        id: "2",
        title: "Course 2",
        description: "Description 2",
        instructor_id: "2",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 200000,
    },
    {
        id: "3",
        title: "Course 3",
        description: "Description 3",
        instructor_id: "3",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 300000,
    },
    {
        id: "4",
        title: "Course 4",
        description: "Description 4",
        instructor_id: "4",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 400000,
    },
    {
        id: "5",
        title: "Course 5",
        description: "Description 5",
        instructor_id: "5",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 500000,
    },
    {
        id: "6",
        title: "Course 6",
        description: "Description 6",
        instructor_id: "6",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 600000,
    },
    {
        id: "7",
        title: "Course 7",
        description: "Description 7",
        instructor_id: "7",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 700000,
    },
    {
        id: "8",
        title: "Course 8",
        description: "Description 8",
        instructor_id: "8",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 800000,
    },
    {
        id: "9",
        title: "Course 9",
        description: "Description 9",
        instructor_id: "9",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 900000,
    },
    {
        id: "10",
        title: "Course 10",
        description: "Description 10",
        instructor_id: "10",
        preview_video_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        price: 1000000,
    },
];

export default function CoursePage(): React.JSX.Element {    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [courses, setCourses] = useState<Course[]>([]);
    
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get params from URL or defaults
    const searchQuery = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const orderBy = searchParams.get("orderBy") || "title:asc";
    
    const take = 10;
    const skip = (page - 1) * take;

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            
            // Build URL with params
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (orderBy) {
                // The API expects orderBy format "field:direction"
                params.append("orderBy", orderBy);
            }
            params.append("skip", skip.toString());
            params.append("take", take.toString());

            const response = await fetch(`/api/courses?${params.toString()}`);
            if (!response.ok) throw new Error("Gagal mengambil data kursus");
            
            const { data } = await response.json() as ResponseWithData<Course[]>;
            setCourses(data);
        } catch (error) {
            console.error(error);
            // setError('Terjadi kesalahan saat memuat kursus. Silakan coba lagi.');
            setCourses(mockCourses);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, orderBy, skip, take]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const newParams = new URLSearchParams(searchParams);
        newParams.set("orderBy", newSort);
        newParams.set("page", "1"); // Reset to first page on sort
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", newPage.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FFFBE9] pt-24 pb-20 px-6 lg:px-12">
            {error && <ErrorBanner error={error} setError={setError} />}
            {loading && <LoadingOverlay />}

            {/* Page Header / Hero */}
            <div className="max-w-7xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black font-outfit text-[#1E293B] mb-4">
                            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : "Explorasi Kursus"}
                        </h1>
                        <p className="text-lg font-jakarta text-[#AD8B73] font-medium">
                            Temukan kelas terbaik yang dirancang oleh pakar industri untuk membantu Anda mencapai potensi maksimal.
                        </p>
                    </div>

                    {/* Sorting Controls */}
                    <div className="flex flex-col gap-2 min-w-[220px]">
                        <label className="text-sm font-bold font-jakarta text-[#1E293B]/60 ml-1 uppercase tracking-wider">Urutkan Berdasarkan</label>
                        <div className="relative group">
                            <select 
                                value={orderBy}
                                onChange={handleSortChange}
                                className="w-full bg-white border-2 border-[#E3CAA5] rounded-2xl px-4 py-3 font-jakarta text-[#1E293B] font-bold focus:outline-none focus:border-[#AD8B73] focus:ring-4 focus:ring-[#AD8B73]/10 appearance-none transition-all cursor-pointer shadow-sm group-hover:shadow-md"
                            >
                                <option value="title:asc">Judul (A - Z)</option>
                                <option value="title:desc">Judul (Z - A)</option>
                                <option value="price:asc">Harga (Termurah)</option>
                                <option value="price:desc">Harga (Termahal)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#AD8B73]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="max-w-7xl mx-auto">
                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : !loading && (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white/50 rounded-3xl border-4 border-dashed border-[#E3CAA5]/30">
                        <div className="w-20 h-20 bg-[#E3CAA5]/20 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-[#AD8B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold font-outfit text-[#1E293B] mb-2">Tidak Ada Kursus Ditemukan</h3>
                        <p className="text-[#AD8B73] font-jakarta max-w-sm">
                            Maaf, kami tidak menemukan kursus yang sesuai dengan kriteria Anda. Coba kata kunci atau filter lain.
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {courses.length > -1 && (
                <div className="max-w-7xl mx-auto mt-20 flex items-center justify-center gap-2 font-jakarta">
                    <button 
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="p-3 rounded-xl border-2 border-[#E3CAA5] text-[#AD8B73] hover:bg-[#AD8B73] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#AD8B73] transition-all bg-white shadow-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {/* Simple page numbers */}
                        {[...Array(page + 2)].map((_, i) => {
                            const p = i + 1;
                            if (p < page - 1 || p > page + 2) return null;
                            if (p < 1) return null;
                            return (
                                <button 
                                    key={p}
                                    onClick={() => handlePageChange(p)}
                                    className={`w-12 h-12 rounded-xl border-2 transition-all font-bold text-lg shadow-sm ${
                                        page === p 
                                            ? "bg-[#1E293B] border-[#1E293B] text-[#FFFBE9]" 
                                            : "bg-white border-[#E3CAA5] text-[#AD8B73] hover:border-[#AD8B73]"
                                    }`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <span className="w-12 h-12 flex items-center justify-center text-[#AD8B73] font-bold">...</span>
                    </div>

                    <button 
                        onClick={() => handlePageChange(page + 1)}
                        disabled={courses.length < take}
                        className="p-3 rounded-xl border-2 border-[#E3CAA5] text-[#AD8B73] hover:bg-[#AD8B73] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#AD8B73] transition-all bg-white shadow-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}