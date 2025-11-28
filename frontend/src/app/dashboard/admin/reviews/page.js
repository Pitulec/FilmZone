"use client";
import React from "react";
import AuthGuard from "../AuthGuard";
import ReviewManagerClient from "../ReviewManagerClient";

export default function ReviewsPage() {
	return (
		<AuthGuard>
			<div className="flex justify-center p-6 mt-25">
				<div className="w-full max-w-5xl">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-[#DD4242]">Manage reviews</h2>
					</div>

					<ReviewManagerClient />
				</div>
			</div>
		</AuthGuard>
	);
}
