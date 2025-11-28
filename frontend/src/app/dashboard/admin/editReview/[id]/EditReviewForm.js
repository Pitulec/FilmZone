"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditReviewForm({ reviewId }) {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [stars, setStars] = useState(5);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		const fetchReview = async () => {
			try {
				const res = await fetch(`http://localhost:8000/reviews/${reviewId}`);
				if (!res.ok) throw new Error(`Failed to load review: ${res.status}`);
				const data = await res.json();
				if (!mounted) return;
				setTitle(data.title || "");
				setContent(data.content || "");
				setStars(data.stars || 5);
			} catch (err) {
				console.error(err);
				setError("Could not load review. Please try again.");
			}
		};
		fetchReview();
		return () => (mounted = false);
	}, [reviewId]);

	const handleUpdate = async () => {
		setError(null);
		setSuccess(null);
		if (!title.trim()) {
			setError("Title is required.");
			return;
		}
		setIsLoading(true);
		try {
			const token = localStorage.getItem("token");
			const headers = { "Content-Type": "application/json" };
			if (token) headers["Authorization"] = `Bearer ${token}`;
			const res = await fetch(`http://localhost:8000/reviews/${reviewId}`, {
				method: "PUT",
				headers,
				body: JSON.stringify({ title: title.trim(), content: content.trim(), stars }),
			});
			if (res.ok) {
				setSuccess("Review updated successfully.");
				setTimeout(() => router.push("/dashboard/admin/reviews"), 700);
			} else {
				const data = await res.json().catch(() => ({}));
				setError(data.detail || "Failed to update review.");
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
				<h2 className="text-2xl font-bold mb-4 text-center">Edit review</h2>
				<p className="text-md mb-1">Title</p>
				<input value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 mb-3 rounded" />
				<p className="text-md mb-1">Content</p>
				<textarea value={content} onChange={(e) => setContent(e.target.value)} className="px-3 py-2 mb-3 rounded" />
				<p className="text-md mb-1">Stars</p>
				<input
					type="number"
					min={1}
					max={10}
					value={stars}
					onChange={(e) => setStars(Number(e.target.value))}
					className="px-3 py-2 mb-3 rounded"
				/>

				{error && <p className="text-sm text-[#DD4242] mb-3">{error}</p>}
				{success && <p className="text-sm text-[#22c55e] mb-3">{success}</p>}

				<div className="flex gap-3">
					<button onClick={handleUpdate} disabled={isLoading} className="bg-[#DD4242] text-white px-4 py-2 rounded">
						{isLoading ? "Updating..." : "Update review"}
					</button>
					<button onClick={() => router.push("/dashboard/admin/reviews")} className="px-4 py-2 rounded border">
						Cancel
					</button>
				</div>
			</div>
		</main>
	);
}
