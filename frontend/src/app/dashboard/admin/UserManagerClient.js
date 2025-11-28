"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserManagerClient() {
	const router = useRouter();
	const [users, setUsers] = useState([]);
	const [query, setQuery] = useState("");
	const [openMenuId, setOpenMenuId] = useState(null);

	const loadUsers = async () => {
		try {
			const token = localStorage.getItem("token");
			const headers = {};
			if (token) headers["Authorization"] = `Bearer ${token}`;
			const res = await fetch("http://localhost:8000/users/", { headers });
			if (res.ok) {
				const data = await res.json();
				setUsers(data || []);
			} else {
				console.error("Failed to fetch users:", res.status, await res.text());
				alert("Failed to fetch users. Are you an admin?");
			}
		} catch (err) {
			console.error(err);
			alert("Connection error while fetching users.");
		}
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const filtered = (users || []).filter((u) => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return (u.username || "").toLowerCase().includes(q) || (u.role || "").toLowerCase().includes(q);
	});

	return (
		<div className="outline outline-[#8D99AE] rounded-xl px-6 py-4 bg-[#8d99ae21]">
			<div className="flex items-center justify-between gap-4 mb-4">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					type="text"
					placeholder="Search users..."
					className="flex-1 sm:w-80 px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
				/>
			</div>

			<div className="h-64 overflow-auto p-2 rounded">
				{filtered.map((u, i) => (
					<div key={u.id ?? i} className="flex gap-4 p-3 border-b last:border-b-0 items-center">
						<div className="flex-1">
							<h3 className="font-semibold text-[#DD4242]">{u.username}</h3>
							<p className="text-sm text-gray-600 mt-1">Role: {u.role}</p>
						</div>
						<div className="ml-2 relative">
							<button
								onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
								className="px-2 py-1 rounded hover:bg-gray-100">
								⋮
							</button>
							{openMenuId === u.id && (
								<div className="absolute right-0 mt-2 w-40 bg-[#2B2D42] border rounded z-10">
									<button
										onClick={() => router.push(`/dashboard/admin/editUser/${u.id}`)}
										className="w-full text-left px-3 py-1 text-sm bg-none text-white hover:bg-gray-100">
										Edit
									</button>
									<button
										onClick={async () => {
											if (!confirm("Delete this user?")) return;
											try {
												const token = localStorage.getItem("token");
												const headers = {};
												if (token) headers["Authorization"] = `Bearer ${token}`;
												const res = await fetch(`http://localhost:8000/users/${u.id}`, {
													method: "DELETE",
													headers,
												});
												if (res.ok || res.status === 204) {
													setUsers((prev) => prev.filter((x) => x.id !== u.id));
													setOpenMenuId(null);
												} else {
													const data = await res.json().catch(() => ({}));
													alert(data.detail || `Failed to delete user (${res.status})`);
												}
											} catch (err) {
												console.error(err);
												alert("Connection error while deleting user.");
											}
										}}
										className="w-full text-left px-3 py-1 text-sm bg-none text-red-600 hover:bg-gray-100">
										Delete
									</button>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
