import { useEffect, useState, type PropsWithChildren, type KeyboardEvent, useRef } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import type { MeResponse } from "../types/auth.type";
import { userSlice } from "../redux/user.slice";
import { useAppSelector } from "../hooks/useAppSelector";
import { useNavigate, useLocation, Link } from "react-router";
import type { ResponseWithData } from "../types/response.type";

export default function Header({ children }: PropsWithChildren): React.JSX.Element {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const showTemporarily = () => {
        setIsVisible(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
            setIsVisible(false);
            timeoutRef.current = null;
        }, 3000);
    };

    useEffect(() => {
        showTemporarily();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [location.pathname]);

    const scrollState = useRef({ lastY: 0, visible: isVisible });
    
    useEffect(() => {
        scrollState.current = { lastY: lastScrollY, visible: isVisible };
    }, [lastScrollY, isVisible]);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            const { lastY, visible: currentlyVisible } = scrollState.current;

            if (currentY > lastY) {
                if (!currentlyVisible) {
                    showTemporarily();
                }
            } 
            
            setLastScrollY(currentY);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (e.clientY <= 76) {
                showTemporarily();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/api/auth/me');

                if (response.ok) {
                    const { data } = await response.json() as ResponseWithData<MeResponse>;
                    dispatch(userSlice.actions.setState(data));
                }

            } catch (error) {
                console.log(error);
            }
        })()
    }, [dispatch])

    const handleLogout = () => {
        dispatch(userSlice.actions.resetState());
        navigate('/login');
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim() !== "") {
            navigate(`/course?search=${encodeURIComponent(search.trim())}`);
        }
    }

    return (
        <div className="min-h-screen bg-[#FFFBE9]">
            {/* Spacer for fixed header to prevent content jumping under it */}
            <div className=" w-full bg-transparent"></div>

            <header 
                className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#FFFBE9]/95 backdrop-blur-md shadow-sm border-b border-[#E3CAA5]/50 transition-transform duration-300 ease-in-out ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                {/* Logo */}
                <Link to="/" className="font-extrabold text-xl tracking-wider text-[#AD8B73] font-outfit">
                    ELEARNING
                </Link>

                {/* Search Box */}
                <div className="flex-1 mx-12 max-w-xl">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-5 py-2 rounded-full border border-[#CEAB93] bg-white focus:outline-none focus:ring-2 focus:ring-[#AD8B73] placeholder-[#CEAB93] text-[#AD8B73] font-jakarta"
                    />
                </div>

                {/* Main Nav and Auth */}
                <div className="flex items-center gap-8">
                    <nav className="flex items-center gap-6 font-medium text-[#AD8B73] font-jakarta">
                        <a href="#" className="hover:text-[#CEAB93] transition-colors">Link 1</a>
                        <a href="#" className="hover:text-[#CEAB93] transition-colors">Link 2</a>
                        <a href="#" className="hover:text-[#CEAB93] transition-colors">Link 3</a>
                        <a href="#" className="hover:text-[#CEAB93] transition-colors">Link 4</a>
                    </nav>

                    <div className="ml-4">
                        {user.username ? (
                            <button 
                                onClick={handleLogout}
                                className="px-6 py-2 border-2 border-[#AD8B73] rounded hover:bg-[#AD8B73] hover:text-[#FFFBE9] transition-colors font-semibold text-[#AD8B73] font-jakarta"
                            >
                                Logout
                            </button>
                        ) : (
                            <a 
                                href="/login"
                                className="inline-block px-6 py-2 border-2 border-[#AD8B73] rounded hover:bg-[#AD8B73] hover:text-[#FFFBE9] transition-colors font-semibold text-[#AD8B73] font-jakarta"
                            >
                                Login
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
}