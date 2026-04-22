import { useEffect } from "react";

interface ErrorBannerProps {
    error: string,
    setError: React.Dispatch<React.SetStateAction<string>>
}

export default function ErrorBanner({ error, setError }: ErrorBannerProps): React.JSX.Element {

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="fixed top-20 right-4 md:right-8 z-[100] bg-[#FFFBE9] text-[#AD8B73] border-l-4 border-red-500 px-6 py-4 rounded-lg shadow-xl shadow-[#AD8B73]/20 flex items-center gap-4 animate-fade-in font-jakarta min-w-[300px]">
            <div className="bg-red-100 text-red-500 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <div className="flex-1 flex flex-col">
                <span className="text-sm font-bold text-red-500 font-outfit tracking-wide">ERROR</span>
                <span className="text-base font-semibold">{error}</span>
            </div>
            <button 
                onClick={() => setError('')} 
                className="hover:bg-[#E3CAA5]/30 p-1.5 rounded-md transition-colors text-[#CEAB93] hover:text-[#AD8B73]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}