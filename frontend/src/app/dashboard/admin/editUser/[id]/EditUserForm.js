"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUserForm({ userId }) {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [role, setRole] = useState("user");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		const fetchUser = async () => {
			try {
				const token = localStorage.getItem("token");
				const headers = {};
				if (token) headers["Authorization"] = `Bearer ${token}`;
				const res = await fetch(`http://localhost:8000/users/${userId}`, { headers });
				if (!res.ok) throw new Error(`Failed to load user: ${res.status}`);
				const data = await res.json();
				if (!mounted) return;
				setUsername(data.username || "");
				setRole(data.role || "user");
			} catch (err) {
				console.error(err);
				setError("Could not load user. Please try again.");
			}
		};
		fetchUser();
		return () => (mounted = false);
	}, [userId]);

	const handleUpdate = async () => {
		setError(null);
		setSuccess(null);
		if (username.trim().length < 3) {
			setError("Username too short.");
			return;
		}
		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const headers = { "Content-Type": "application/json" };
			if (token) headers["Authorization"] = `Bearer ${token}`;
			const res = await fetch(`http://localhost:8000/users/${userId}`, {
				method: "PUT",
				headers,
				body: JSON.stringify({ username: username.trim(), role }),
			});
			if (res.ok) {
				setSuccess("User updated successfully.");
				setTimeout(() => router.push("/dashboard/admin/users"), 700);
			} else {
				const data = await res.json().catch(() => ({}));
				setError(data.detail || "Failed to update user.");
			}
		} catch (err) {
			console.error(err);
			setError("Connection error. Make sure the server is running.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="flex items-center justify-center min-h-screen">
			<div className="flex flex-col bg-[#8d99ae21] outline outline-[#8D99AE] rounded-xl p-8 w-md">
				<h2 className="text-2xl font-bold mb-4 text-center">Edit user</h2>
				<p className="text-md mb-1">Username</p>
				<input value={username} onChange={(e) => setUsername(e.target.value)} className="px-3 py-2 mb-3 rounded" />
				<p className="text-md mb-1">Role</p>
				<select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 mb-3 rounded">
					<option value="user">user</option>
					<option value="admin">admin</option>
				</select>

				{error && <p className="text-sm text-[#DD4242] mb-3">{error}</p>}
				{success && <p className="text-sm text-[#22c55e] mb-3">{success}</p>}

				<div className="flex gap-3">
					<button onClick={handleUpdate} disabled={isLoading} className="bg-[#DD4242] text-white px-4 py-2 rounded">
						{isLoading ? "Updating..." : "Update user"}
					</button>
					<button onClick={() => router.push("/dashboard/admin/users")} className="px-4 py-2 rounded border">
						Cancel
					</button>
				</div>
			</div>
		</main>
	);
}
