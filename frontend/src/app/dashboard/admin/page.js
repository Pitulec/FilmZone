import AuthGuard from "./AuthGuard";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function UserDashboard() {
	let films = [];
	try {
		const res = await fetch("http://localhost:8000/films/", { cache: "no-store" });
		if (res.ok) {
			films = await res.json();
		} else {
			console.error("Failed to fetch films:", res.status, await res.text());
		}
	} catch (err) {
		console.error("Error fetching films:", err);
	}

	return (
		<AuthGuard>
			<div className="flex justify-center p-6 mt-25">
				<div className="w-full max-w-5xl">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-[#DD4242]">Admin dashboard</h2>
					</div>
					<AdminDashboardClient initialFilms={films} />
				</div>
			</div>
		</AuthGuard>
	);
}
