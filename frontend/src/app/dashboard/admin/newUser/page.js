"use client";
import { useState } from "react";

export default function NewUserPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("user");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleAddUser = async () => {
		setError(null);
		setSuccess(null);
		if (username.trim().length < 3 || password.length < 6) {
			setError("Provide valid username and password.");
			return;
		}
		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const headers = { "Content-Type": "application/json" };
			if (token) headers["Authorization"] = `Bearer ${token}`;
			const res = await fetch("http://localhost:8000/users/", {
				method: "POST",
				headers,
				body: JSON.stringify({ username: username.trim(), password, role }),
			});
			if (res.ok) {
				setSuccess("User created successfully.");
				setUsername("");
				setPassword("");
			} else {
				const data = await res.json().catch(() => ({}));
				setError(data.detail || "Failed to create user.");
			}
		} catch (err) {
			console.error(err);
			setError("Connection error.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="flex items-center justify-center min-h-screen">
			<div className="flex flex-col bg-[#8d99ae21] outline outline-[#8D99AE] rounded-xl p-8 w-md">
				<h2 className="text-2xl font-bold mb-4 text-center">Create user</h2>
				<p className="text-md mb-1">Username</p>
				<input value={username} onChange={(e) => setUsername(e.target.value)} className="px-3 py-2 mb-3 rounded" />
				<p className="text-md mb-1">Password</p>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-3 py-2 mb-3 rounded" />
				<p className="text-md mb-1">Role</p>
				<select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 mb-3 rounded">
					<option value="user">user</option>
					<option value="admin">admin</option>
				</select>

				{error && <p className="text-sm text-[#DD4242] mb-3">{error}</p>}
				{success && <p className="text-sm text-[#22c55e] mb-3">{success}</p>}

				<button onClick={handleAddUser} disabled={isLoading} className="bg-[#DD4242] text-white px-4 py-2 rounded">
					{isLoading ? "Creating..." : "Create user"}
				</button>
			</div>
		</main>
	);
}
