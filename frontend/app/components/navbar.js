import React from "react";
import { House, Search, User } from "lucide-react";
import UserComponent from "./user";

export default function Navbar() {
	const menu = [
		{ label: "Search", icon: <Search className="w-4.5 h-4.5" />, href: "/search" },
		{ label: "Sign In", icon: <User className="w-5 h-5" />, href: "/signin" },
	];

	return (
		<nav className="z-50 sticky flex items-center justify-between mx-auto outline-2 outline-[#8D99AE] max-w-3xl px-7.5 py-2 top-5 rounded-full mb-15 bg-[#2B2D42]">
			<a href="/" className="text-2xl group font-bold grow text-left hover:text-[#8D99AE] hover:cursor-pointer">
				<span>Film</span>
				<span className="text-[#DD4242] group-hover:text-[#bc2121]">Zone</span>
			</a>
			<UserComponent />
			<ul className="flex items-center gap-6 font-medium">
				{menu.map((item, i) => (
					<li key={i}>
						<a href={item.href} className="flex items-center gap-2 hover:text-[#DD4242]">
							{item.icon}
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
