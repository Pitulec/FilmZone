import React, { useState } from "react";
import { Star, X } from "lucide-react";

export default function AddReviewModal({ isOpen, onClose, filmId, onReviewAdded }) {
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [stars, setStars] = useState(0);
	const [hoverStars, setHoverStars] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !content.trim() || stars === 0) {
			setError("Please fill all fields and select a rating.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		const token = localStorage.getItem("token");
		if (!token) {
			setError("You must be logged in to add a review.");
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await fetch("http://localhost:8000/reviews/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					film_id: parseInt(filmId),
					title: title.trim(),
					content: content.trim(),
					stars,
				}),
			});

			if (response.ok) {
				setTitle("");
				setContent("");
				setStars(0);
				setHoverStars(0);
				onClose();
				onReviewAdded(); // Refresh reviews
			} else {
				const data = await response.json();
				setError(data.detail || "Failed to add review.");
			}
		} catch (err) {
			console.error("Error adding review:", err);
			setError("Network error. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-[#2B2D42] rounded-xl p-6 w-full max-w-md mx-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-bold text-[#EDF2F4]">Add Review</h2>
					<button onClick={onClose} className="text-[#8D99AE] hover:text-[#EDF2F4]">
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-[#EDF2F4] mb-2">Title</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-3 py-2 bg-[#8d99ae21] outline outline-[#8D99AE] rounded-xl text-[#EDF2F4]"
							placeholder="Review title"
							maxLength={100}
						/>
					</div>

					<div className="mb-4">
						<label className="block text-[#EDF2F4] mb-2">Rating</label>
						<div className="flex gap-1">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setStars(star)}
									onMouseEnter={() => setHoverStars(star)}
									onMouseLeave={() => setHoverStars(0)}
									className="focus:outline-none">
									<Star
										size={24}
										className={`${
											star <= (hoverStars || stars) ? "text-[#DD4242] fill-[#DD4242]" : "text-[#8D99AE]"
										} hover:text-[#DD4242]`}
									/>
								</button>
							))}
						</div>
					</div>

					<div className="mb-4">
						<label className="block text-[#EDF2F4] mb-2">Content</label>
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							className="w-full px-3 py-2 bg-[#8d99ae21] outline outline-[#8D99AE] rounded-xl text-[#EDF2F4] h-32 resize-none"
							placeholder="Write your review here..."
							maxLength={1000}
						/>
					</div>

					{error && <p className="text-[#DD4242] mb-4">{error}</p>}

					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-2 px-4 bg-[#8D99AE] hover:bg-[#6b7688] text-[#EDF2F4] rounded-xl font-medium">
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 py-2 px-4 bg-[#DD4242] hover:bg-[#bc2121] disabled:bg-[#722121] disabled:cursor-not-allowed text-[#EDF2F4] rounded-xl font-medium">
							{isSubmitting ? "Submitting..." : "Submit Review"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
