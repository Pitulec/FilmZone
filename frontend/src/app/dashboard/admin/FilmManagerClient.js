"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function FilmManagerClient({ initialFilms = [] }) {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [sort, setSort] = useState("name_asc");
	const [films, setFilms] = useState(initialFilms || []);
	const [openMenuId, setOpenMenuId] = useState(null);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		const matched = (films || initialFilms || []).filter((f) => {
			if (!q) return true;
			const t = (f.title || "").toLowerCase();
			const d = (f.description || "").toLowerCase();
			return t.includes(q) || d.includes(q);
		});

		const sorted = [...matched];
		if (sort === "name_asc") sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
		else if (sort === "name_desc") sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
		// rating sort left as no-op because backend model doesn't include aggregated rating yet

		return sorted;
	}, [query, sort, films]);

	return (
		<div className="outline outline-[#8D99AE] rounded-xl px-6 py-4 bg-[#8d99ae21]">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						type="text"
						placeholder="Search..."
						className="flex-1 sm:w-80 px-3 py-2 rounded-full border border-gray-300 focus:outline-none"
					/>
				</div>

				<div className="flex items-center gap-3">
					<span className="text-sm text-white">Sort by:</span>
					<select
						value={sort}
						onChange={(e) => setSort(e.target.value)}
						className="px-3 py-1 rounded border text-sm bg-none text-white">
						<option className="bg-none text-white" value="name_asc">
							Name (asc)
						</option>
						<option className="bg-none text-white" value="name_desc">
							Name (desc)
						</option>
					</select>
				</div>
			</div>

			<div className="h-64 overflow-auto p-2 rounded">
				{filtered.map((f, i) => (
					<div key={f.id ?? i} className="flex gap-4 p-3 border-b last:border-b-0 items-start">
						{f.poster_url ? (
							<img src={f.poster_url} alt={`${f.title} poster`} className="w-20 h-28 rounded-md shrink-0 object-cover" />
						) : (
							<div className="w-20 h-28 rounded-md shrink-0 bg-pink-500" />
						)}

						<div className="flex-1">
							<h3 className="font-semibold text-[#DD4242]">{f.title}</h3>
							<p className="text-sm text-gray-600 mt-1 leading-snug">{f.description}</p>
							<div className="mt-2 text-sm text-yellow-500">★ ★ ★ ★ ☆</div>
						</div>
						<div className="ml-2 relative">
							<button
								onClick={() => setOpenMenuId(openMenuId === f.id ? null : f.id)}
								className="px-2 py-1 rounded hover:bg-gray-100">
								⋮
							</button>
							{openMenuId === f.id && (
								<div className="absolute right-0 mt-2 w-40 bg-[#2B2D42] border rounded z-10">
									<button
										onClick={() => router.push(`/dashboard/admin/editFilm/${f.id}`)}
										className="w-full text-left px-3 py-1 text-sm bg-none text-white hover:bg-gray-100">
										Edit
									</button>
									<button
										onClick={async () => {
											if (!confirm("Delete this film?")) return;
											try {
												const token = localStorage.getItem("token");
												const headers = {};
												if (token) headers["Authorization"] = `Bearer ${token}`;
												const res = await fetch(`http://localhost:8000/films/${f.id}`, {
													method: "DELETE",
													headers,
												});
												if (res.ok || res.status === 204) {
													setFilms((prev) => prev.filter((x) => x.id !== f.id));
													setOpenMenuId(null);
												} else {
													const data = await res.json().catch(() => ({}));
													alert(data.detail || `Failed to delete film (${res.status})`);
												}
											} catch (err) {
												console.error(err);
												alert("Connection error while deleting film.");
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
