import { User } from "lucide-react";
import React from "react";

export default async function UserComponent() {
	const token = localStorage.getItem("token");

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
			//
		}
	} catch (error) {
		localStorage.removeItem("token");
		return (
			<>
				<User className="w-5 h-5" />
				<span>Sign In</span>
			</>
		);
	}
}
