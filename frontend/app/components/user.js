import { User } from "lucide-react";
import React from "react";
import { cookies } from "next/headers";

export default async function UserComponent() {
	const cookieStore = await cookies();
	let token = cookieStore.get("token");

	if (cookieStore.get("token") != undefined) {
		token = cookieStore.get("token").value;
		try {
			const response = await fetch("http://localhost:8000/auth/me/username", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				return (
					<span className="group inline-flex items-center gap-2">
						<User className="w-5 h-5 group-hover:text-[#DD4242]" />
						<span className="text-xl group-hover:text-[#DD4242]">Sign In</span>
					</span>
				);
			} else {
				const data = await response.json();
				const username = data?.username ?? data?.user ?? data?.sub ?? null;
				if (username) {
					return (
						<a href="/" className="group inline-flex items-center gap-2">
							<User className="w-5 h-5 group-hover:text-[#DD4242]" />
							<span className="text-xl group-hover:text-[#DD4242]">{username}</span>
						</a>
					);
				} else {
					return (
						<a href="/signin" className="group inline-flex items-center gap-2">
							<User className="w-5 h-5 group-hover:text-[#DD4242]" />
							<span className="text-xl group-hover:text-[#DD4242]">Sign In</span>
						</a>
					);
				}
			}
		} catch (error) {
			//
			return (
				<a href="/signin" className="group">
					<User className="inline w-5 h-5 group-hover:text-[#DD4242]" />
					<span className="text-xl group-hover:text-[#DD4242]">&nbsp;Sign In</span>
				</a>
			);
		}
	} else {
		return (
			<a href="/signin" className="group">
				<User className="inline w-5 h-5 group-hover:text-[#DD4242]" />
				<span className="text-xl group-hover:text-[#DD4242]">&nbsp;Sign In</span>
			</a>
		);
	}
}
