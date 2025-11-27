"use client";

import { Search } from "lucide-react";
import react from "react";

export default function Searchbar() {
	return (
		<div className="inline-flex mx-5 w-full items-center rounded-full py-1 pl-2 bg-[rgba(141,153,174,.15)] outline-2 outline-[#8D99AE] text-[#EDF2F4]">
			<Search className="inline w-5 h-5 mr-2" />
			<input className="focus:outline-none inline max-w-full" type="text" placeholder="Search..." />
		</div>
	);
}
