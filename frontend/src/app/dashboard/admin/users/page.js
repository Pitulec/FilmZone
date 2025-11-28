"use client";
import React from "react";
import AuthGuard from "../AuthGuard";
import UserManagerClient from "../UserManagerClient";

export default function UsersPage() {
	return (
		<AuthGuard>
			<div className="flex justify-center p-6 mt-25">
				<div className="w-full max-w-5xl">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-[#DD4242]">Manage users</h2>
						<a
							href="/dashboard/admin/newUser"
							role="button"
							className="inline-block bg-[#DD4242] text-white px-3 py-1 rounded-full text-sm">
							+ Add new
						</a>
					</div>

					<UserManagerClient />
				</div>
			</div>
		</AuthGuard>
	);
}
