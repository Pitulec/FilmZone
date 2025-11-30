"use client";
import React, { useState } from "react";
import FilmManagerClient from "./films/FilmManagerClient";
import UserManagerClient from "./UserManagerClient";
import ReviewManagerClient from "./ReviewManagerClient";

export default function AdminDashboardClient({ initialFilms = [] }) {
	const [active, setActive] = useState("films");

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex gap-2">
					<button
						onClick={() => setActive("films")}
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							active === "films" ? "bg-[#DD4242] text-white" : "bg-transparent text-white/80"
						}`}>
						Films
					</button>
					<button
						onClick={() => setActive("users")}
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							active === "users" ? "bg-[#DD4242] text-white" : "bg-transparent text-white/80"
						}`}>
						Users
					</button>
					<button
						onClick={() => setActive("reviews")}
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							active === "reviews" ? "bg-[#DD4242] text-white" : "bg-transparent text-white/80"
						}`}>
						Reviews
					</button>
				</div>
			</div>

			<div className="mt-4">
				{active === "films" && (
					<section>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-md font-semibold text-[#DD4242]">Manage films</h3>
							<a
								href="/dashboard/admin/newFilm"
								role="button"
								className="inline-block bg-[#DD4242] text-white px-3 py-1 rounded-full text-sm">
								+ Add new
							</a>
						</div>
						<FilmManagerClient initialFilms={initialFilms} />
					</section>
				)}

				{active === "users" && (
					<section>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-md font-semibold text-[#DD4242]">Manage users</h3>
						</div>
						<UserManagerClient />
					</section>
				)}

				{active === "reviews" && (
					<section>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-md font-semibold text-[#DD4242]">Manage reviews</h3>
						</div>
						<ReviewManagerClient />
					</section>
				)}
			</div>
		</div>
	);
}
