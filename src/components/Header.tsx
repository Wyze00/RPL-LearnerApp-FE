import { useEffect, useState, type PropsWithChildren, type KeyboardEvent } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import type { MeResponse } from "../types/auth.type";
import { userSlice } from "../redux/user.slice";
import { useAppSelector } from "../hooks/useAppSelector";
import { useNavigate } from "react-router";

export default function Header({ children }: PropsWithChildren): React.JSX.Element {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/api/auth/me');

                if (response.ok) {
                    const data = await response.json() as MeResponse;
                    dispatch(userSlice.actions.setState(data));
                }

            } catch (error) {
                console.log(error);
            }
        })()
    }, [dispatch])

    const handleLogout = () => {
        dispatch(userSlice.actions.resetState());
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim() !== "") {
            navigate(`/courses?search=${encodeURIComponent(search.trim())}`);
        }
    }

    return (
        <div className="min-h-screen bg-[#FFFBE9]">
            <header className="flex items-center justify-between px-8 py-4 bg-[#E3CAA5]/30">
                {/* Logo */}
                <div className="font-extrabold text-xl tracking-wider text-[#AD8B73] font-outfit">
                    ELEARNING
                </div>

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
                                Sign Up
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