import { Link } from "react-router";

export default function NotFoundPage(): React.JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#FFFBE9] text-[#AD8B73] px-6 text-center">
            {/* The 404 Header */}
            <div className="relative">
                <h1 className="text-9xl font-extrabold tracking-widest text-[#E3CAA5] drop-shadow-md font-outfit">
                    404
                </h1>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#CEAB93] text-[#FFFBE9] px-4 py-1 text-sm rounded-md shadow-sm font-semibold tracking-wider -rotate-12">
                    Course Not Found
                </div>
            </div>

            {/* Description */}
            <h2 className="mt-8 text-3xl font-bold font-outfit">
                Oops! Looks like you're lost.
            </h2>
            
            <p className="mt-4 max-w-md text-lg text-[#AD8B73]/80 font-jakarta">
                The class or page you're looking for doesn't exist anymore or might have been moved. Let's get you back to learning.
            </p>

            {/* CTA Button */}
            <Link 
                to="/"
                className="mt-10 px-8 py-3 bg-[#AD8B73] text-[#FFFBE9] hover:text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-[#CEAB93] hover:-translate-y-1 transition-all duration-300"
            >
                Back to Home
            </Link>
        </div>
    );
}