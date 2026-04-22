import { useRef } from "react";
import { Link } from "react-router";
import homepage1 from "../assets/homepage1.png";
import homepage2 from "../assets/homepage2.png";
import homepage3 from "../assets/homepage3.png";
import homepage4 from "../assets/homepage4.png";

export default function HomePage(): React.JSX.Element {
    const section2Ref = useRef<HTMLDivElement>(null);

    const scrollToNext = () => {
        section2Ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="h-[calc(100vh-76px)] overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-[#FFFBE9]">
            {/* Screen 1 */}
            <section className="relative h-full w-full snap-start flex items-center justify-center min-h-[calc(100vh-76px)]">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${homepage1})` }}
                >
                    <div className="absolute inset-0 bg-[#AD8B73]/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                
                <div className="relative z-10 text-center flex flex-col items-center gap-8 px-4 md:px-20">
                    <div className="flex flex-col gap-4 max-w-4xl">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#FFFBE9] drop-shadow-2xl font-outfit">
                            Selamat Datang
                        </h1>
                        <p className="text-[#E3CAA5] text-lg md:text-2xl lg:text-3xl font-medium drop-shadow-md font-jakarta">
                            Temukan cara baru belajar yang asyik, interaktif, dan mudah dipahami sesuai gaya belajarmu.
                        </p>
                    </div>
                    <button 
                        onClick={scrollToNext}
                        className="px-10 py-4 bg-[#E3CAA5] text-[#AD8B73] rounded-full font-extrabold text-xl shadow-[0_0_20px_rgba(227,202,165,0.4)] hover:bg-[#FFFBE9] hover:scale-105 transition-all duration-300 mt-4"
                    >
                        Explore More
                    </button>
                </div>
            </section>

            {/* Screen 2 */}
            <section ref={section2Ref} className="relative h-full w-full snap-start flex flex-col md:flex-row min-h-[calc(100vh-76px)]">
                {/* Left Section */}
                <div className="w-full md:w-1/2 h-[50%] md:h-full bg-[#AD8B73] flex items-end p-10 md:p-20">
                    <div className="flex flex-col gap-4 text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FFFBE9] drop-shadow-xl font-outfit">
                            Aplikasi belajar terbaik
                        </h1>
                        <p className="text-[#E3CAA5] text-base md:text-lg lg:text-xl leading-relaxed font-jakarta">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                    </div>
                </div>
                
                {/* Right Section */}
                <div 
                    className="w-full md:w-1/2 h-[50%] md:h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${homepage2})` }}
                >
                </div>
            </section>

            {/* Screen 3 */}
            <section className="relative h-full w-full snap-start flex flex-col md:flex-row min-h-[calc(100vh-76px)]">
                {/* Left Section (Image) */}
                <div 
                    className="w-full md:w-1/2 h-[50%] md:h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${homepage3})` }}
                >
                </div>

                {/* Right Section (Text) */}
                <div className="w-full md:w-1/2 h-[50%] md:h-full bg-[#CEAB93] flex items-end justify-end p-10 md:p-20">
                    <div className="flex flex-col gap-4 text-right">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#FFFBE9] drop-shadow-xl font-outfit">
                            Aplikasi yang mudah digunakan
                        </h1>
                        <p className="text-[#FFFBE9] text-base md:text-lg lg:text-xl leading-relaxed font-jakarta">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id.
                        </p>
                    </div>
                </div>
            </section>

            {/* Screen 4 */}
            <section className="relative h-full w-full snap-start flex items-center justify-center min-h-[calc(100vh-76px)]">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${homepage4})` }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 text-center flex flex-col items-center gap-10">
                    <h1 className="text-6xl md:text-8xl font-black text-[#FFFBE9] drop-shadow-2xl tracking-wide font-outfit">
                        Get started
                    </h1>
                    <Link 
                        to="/login"
                        className="px-12 py-5 bg-[#AD8B73] text-[#FFFBE9] border border-[#CEAB93] rounded-full font-bold text-2xl shadow-xl hover:bg-[#CEAB93] hover:text-white hover:-translate-y-2 transition-all duration-300"
                    >
                        Log In to Start
                    </Link>
                </div>
            </section>
        </div>
    );
}