"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewManagerClient() {
	const router = useRouter();
	const [reviews, setReviews] = useState([]);
	const [query, setQuery] = useState("");
	const [openMenuId, setOpenMenuId] = useState(null);

	const loadReviews = async () => {
		try {
			const token = localStorage.getItem("token");
			const headers = {};
			if (token) headers["Authorization"] = `Bearer ${token}`;
			const res = await fetch("http://localhost:8000/reviews/", { headers });
			if (res.ok) {
				const data = await res.json();
				setReviews(data || []);
			} else {
				console.error("Failed to fetch reviews:", res.status, await res.text());
				alert("Failed to fetch reviews. Are you an admin?");
			}
		} catch (err) {
			console.error(err);
			alert("Connection error while fetching reviews.");
		}
	};

	useEffect(() => {
		loadReviews();
	}, []);

	const filtered = (reviews || []).filter((r) => {
		const q = query.trim().toLowerCase();
		if (!q) return true;
		return (
			(r.title || "").toLowerCase().includes(q) ||
			(r.content || "").toLowerCase().includes(q) ||
			(r.username || "").toLowerCase().includes(q)
		);
	});

	return (
		<div className="outline outline-[#8D99AE] rounded-xl px-6 py-4 bg-[#8d99ae21]">
			<div className="flex items-center justify-between gap-4 mb-4">
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					type="text"
					placeholder="Search reviews..."
					className="flex-1 sm:w-80 px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
				/>
			</div>

			<div className="h-64 overflow-auto p-2 rounded">
				{filtered.map((r, i) => (
					<div key={r.id ?? i} className="flex gap-4 p-3 border-b last:border-b-0 items-start">
						<div className="flex-1">
							<h3 className="font-semibold text-[#DD4242]">{r.title}</h3>
							<p className="text-sm text-gray-600 mt-1 leading-snug">{r.content}</p>
							<div className="mt-2 text-sm text-white">
								By: {r.username} — Stars: {r.stars}
							</div>
						</div>
						<div className="ml-2 relative">
							<button
								onClick={() => setOpenMenuId(openMenuId === r.id ? null : r.id)}
								className="px-2 py-1 rounded hover:bg-gray-100">
								⋮
							</button>
							{openMenuId === r.id && (
								<div className="absolute right-0 mt-2 w-40 bg-[#2B2D42] border rounded z-10">
									<button
										onClick={() => router.push(`/dashboard/admin/editReview/${r.id}`)}
										className="w-full text-left px-3 py-1 text-sm bg-none text-white hover:bg-gray-100">
										Edit
									</button>
									<button
										onClick={async () => {
											if (!confirm("Delete this review?")) return;
											try {
												const token = localStorage.getItem("token");
												const headers = {};
												if (token) headers["Authorization"] = `Bearer ${token}`;
												const res = await fetch(`http://localhost:8000/reviews/${r.id}`, {
													method: "DELETE",
													headers,
												});
												if (res.ok || res.status === 204) {
													setReviews((prev) => prev.filter((x) => x.id !== r.id));
													setOpenMenuId(null);
												} else {
													const data = await res.json().catch(() => ({}));
													alert(data.detail || `Failed to delete review (${res.status})`);
												}
											} catch (err) {
												console.error(err);
												alert("Connection error while deleting review.");
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
