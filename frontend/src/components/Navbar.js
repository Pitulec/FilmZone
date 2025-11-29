"use client";
import React, { useState, useEffect } from "react";
import { Search, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; 

const decodeJwtPayload = (token) => {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        
        const padding = '='.repeat((4 - base64.length % 4) % 4);
        const decoded = atob(base64 + padding);
        
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Failed to decode JWT payload:", e);
        return null;
    }
};


export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null); 
    const router = useRouter();

    const checkAuthStatus = () => {
        const token = localStorage.getItem("token");
        const loggedIn = !!token;
        setIsLoggedIn(loggedIn);

        if (token) {
            const payload = decodeJwtPayload(token);
            if (payload && payload.sub) {
                setUsername(payload.sub);
            } else {
                setUsername(null);
            }
        } else {
            setUsername(null);
        }
    };

    useEffect(() => {
        checkAuthStatus();

        const handleStorageChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        window.addEventListener('authChange', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUsername(null);
        router.push("/auth/signin"); 
    };

    const ProfileLink = (
        <li className="group relative">
            {/* Zmiana: usunięto tag <a> i zastąpiono go div'em, aby usunąć profil użytkownika jako odnośnik */}
            <div className="flex items-center gap-2 hover:text-[#DD4242] transition-all cursor-default">
                <User className="w-5" />
                {username}
            </div>
            
            <button 
                onClick={handleLogout} 
                className="absolute top-full mt-2 right-0 bg-[#DD4242] text-white text-sm font-medium py-1 px-3 rounded-lg shadow-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100 whitespace-nowrap z-10 cursor-pointer"
                title="Logout"
            >
                <LogOut className="w-4 inline mr-1"/> Logout
            </button>
        </li>
    );

    const SignInLink = (
        <li>
            <a href="/auth/signin" className="flex items-center gap-2 hover:text-[#DD4242] transition-all">
                <User className="w-5" />
                Sign In
            </a>
        </li>
    );


    return (
        <div className="flex justify-center">
            <nav className="z-50 fixed flex items-center justify-between outline outline-[#8D99AE] rounded-full px-7 py-2 top-5 bg-[#2B2D42] text-white gap-6 sm:min-w-xl shadow-lg">
                <a href="/" className="text-2xl font-bold">
                    <span>Film</span>
                    <span className="text-[#DD4242]">Zone</span>
                </a>

                <ul className="flex items-center gap-6 font-medium">
                    <li>
                        <a href="/auth/search" className="flex items-center gap-2 hover:text-[#DD4242] transition-all">
                            <Search className="w-5" />
                            Search
                        </a>
                    </li>
                    {isLoggedIn && username ? ProfileLink : SignInLink}
                </ul>
            </nav>
        </div>
    );
}