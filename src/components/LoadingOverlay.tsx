export default function LoadingOverlay(): React.JSX.Element {
    return (
        <div className="fixed inset-0 z-[100] bg-[#FFFBE9]/80 backdrop-blur-sm flex flex-col items-center justify-center font-outfit gap-6 transition-all duration-300">
            <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-[#E3CAA5] border-t-[#AD8B73] rounded-full animate-spin shadow-lg"></div>
                <div className="absolute w-8 h-8 bg-[#CEAB93] rounded-full animate-pulse shadow-inner"></div>
            </div>
            <div className="text-[#AD8B73] font-bold text-xl tracking-widest animate-pulse">
                LOADING...
            </div>
        </div>
    );
}