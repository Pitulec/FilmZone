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

	const isUsernameValid = username.trim().length >= 3 && username.trim().length <= 50;
	const isFormValid = isUsernameValid;

	const handleUpdate = async () => {
		setError(null);
		setSuccess(null);
		if (!isFormValid) {
			setError("Please fix form errors before updating.");
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
				<div className="text-4xl font-bold text-center mb-6">
					<span>Film</span>
					<span className="text-[#DD4242]">Zone</span>
				</div>

				<p className="text-md mb-1">Username *</p>
				<input
					type="text"
					placeholder="Enter username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					maxLength={50}
					className={`px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${
						username.length > 0 && !isUsernameValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
					}`}
				/>

				<div className="flex gap-3">
					<div className="flex-1 min-w-0">
						<p className="text-md mb-1">Role</p>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className={`w-full px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${"outline-[#8D99AE]"}`}>
							<option value="user">user</option>
							<option value="admin">admin</option>
						</select>
					</div>
				</div>

				{error && <p className="text-sm text-[#DD4242] mb-3 text-center font-medium">{error}</p>}
				{success && <p className="text-sm text-[#22c55e] mb-3 text-center font-medium">{success}</p>}

				<div className="flex gap-3">
					<button
						onClick={handleUpdate}
						disabled={!isFormValid || isLoading}
						className={`w-full font-semibold py-2 rounded-xl transition duration-200 mb-2 ${
							isFormValid && !isLoading ? "bg-[#DD4242] hover:bg-[#722121]" : "bg-[#722121] cursor-not-allowed opacity-75"
						}`}>
						{isLoading ? "Updating..." : "Update user"}
					</button>
				</div>
			</div>
		</main>
	);
}
