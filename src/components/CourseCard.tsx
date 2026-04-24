import { Link } from "react-router";
import { type Course } from "../types/course.type";
import { getYoutubeThumbnailUrl } from "../utils/getYoutbeThumbnailUrl";

interface CourseCardProps {
    course: Course;
}

export default function CourseCard({ course }: CourseCardProps): React.JSX.Element {
    // Format price to IDR or generic currency
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(course.price);

    return (
        <Link 
            to={`/course/${course.id}`}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#E3CAA5]/30 hover:-translate-y-2"
        >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
                <img 
                    src={getYoutubeThumbnailUrl(course.preview_video_link)} // Placeholder
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white text-sm font-bold font-jakarta">Lihat Detail →</span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#AD8B73] shadow-sm">
                    Best Seller
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold font-outfit text-[#1E293B] mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-[#AD8B73] transition-colors">
                    {course.title}
                </h3>
                
                <p className="text-sm font-jakarta text-[#8b6b55] mb-4 line-clamp-2 flex-1">
                    {course.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#FFFBE9]">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#CEAB93] font-jakarta">Price</span>
                        <span className="text-lg font-black font-jakarta text-[#1E293B]">{formattedPrice}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#FFFBE9] border border-[#E3CAA5]/30 flex items-center justify-center text-[#AD8B73] group-hover:bg-[#AD8B73] group-hover:text-white transition-colors duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
