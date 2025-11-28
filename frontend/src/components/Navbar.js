import React from "react";
import { Search, User } from "lucide-react";

export default function Navbar() {
	return (
        <div className="flex justify-center">
            <nav className="z-50 fixed flex items-center justify-between outline outline-[#8D99AE] rounded-full px-7.5 py-2 top-5 bg-[#8d99ae21] gap-6 sm:min-w-xl">
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
                    <li>
                        <a href="/auth/signin" className="flex items-center gap-2 hover:text-[#DD4242] transition-all">
                        <User className="w-5" />
                        Sign In
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

	);
}