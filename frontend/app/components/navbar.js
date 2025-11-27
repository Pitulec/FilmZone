import React from "react";
import UserComponent from "./user";
import Searchbar from "./search";

export default function Navbar() {
	return (
		<nav className="z-50 sticky flex items-center mx-auto outline-2 outline-[#8D99AE] max-w-3xl px-7.5 py-2 top-5 rounded-full mb-15 bg-[#2B2D42]">
			<a href="/" className="text-2xl group font-bold grow text-left hover:text-[#8D99AE] hover:cursor-pointer">
				<span>Film</span>
				<span className="text-[#DD4242] group-hover:text-[#bc2121]">Zone</span>
			</a>
			<Searchbar />
			<UserComponent />
		</nav>
	);
}
