import { User } from "lucide-react";
import React from "react";
import { cookies } from "next/headers";

export default async function UserComponent() {
	const cookieStore = await cookies();
	let token = cookieStore.get("token");

	if (cookieStore.get("token") != undefined) {
		token = cookieStore.get("token").value;
		try {
			const response = await fetch("http://localhost:8000/auth/" + token);

			if (!response.ok) {
				return (
					<>
						<User className="w-5 h-5" />
						<span>Sign In</span>
					</>
				);
			} else {
				return (
					<>
						<User className="w-5 h-5" />
						<span>User</span>
					</>
				);
			}
		} catch (error) {
			cookieStore.delete("token");
			return (
				<>
					<User className="w-5 h-5" />
					<span>Sign In</span>
				</>
			);
		}
	}
}
