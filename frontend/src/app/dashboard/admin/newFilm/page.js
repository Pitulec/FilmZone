"use client";
import { useState } from "react";

export default function Home() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [creator, setCreator] = useState("");
	const [year, setYear] = useState("");
	const [posterUrl, setPosterUrl] = useState("");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const isTitleValid = title.trim().length >= 1 && title.trim().length <= 200;
	const isCreatorValid = creator.trim().length >= 1 && creator.trim().length <= 100;
	const parsedYear = Number(year);
	const isYearValid = Number.isInteger(parsedYear) && parsedYear >= 1888 && parsedYear <= new Date().getFullYear();
	const isPosterValid = posterUrl.trim().length >= 10;
	const isDescriptionValid = description.length <= 1000;

	const isFormValid = isTitleValid && isCreatorValid && isYearValid && isPosterValid && isDescriptionValid;

	const handleAddFilm = async () => {
		setError(null);
		setSuccess(null);

		if (!isFormValid) {
			setError("Please fill all required fields correctly.");
			return;
		}

		setIsLoading(true);

		const payload = {
			title: title.trim(),
			description: description.trim() || null,
			creator: creator.trim(),
			year: parsedYear,
			poster_url: posterUrl.trim(),
		};

		try {
			const token = localStorage.getItem("token");

			const headers = {
				"Content-Type": "application/json",
			};
			if (token) headers["Authorization"] = `Bearer ${token}`;

			const response = await fetch("http://localhost:8000/films", {
				method: "POST",
				headers,
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				setSuccess("Film added successfully.");
				setTitle("");
				setDescription("");
				setCreator("");
				setYear("");
				setPosterUrl("");
			} else {
				const data = await response.json();
				const errorMessage = data.detail || "Failed to add film.";
				setError(errorMessage);
				console.error("Backend error:", data);
			}
		} catch (err) {
			console.error("Connection error:", err);
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

				<p className="text-md mb-1">Title *</p>
				<input
					type="text"
					placeholder="Enter movie title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					maxLength={200}
					className={`px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${
						title.length > 0 && !isTitleValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
					}`}
				/>

				<p className="text-md mb-1">Description</p>
				<textarea
					placeholder="Short description (optional)"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					maxLength={1000}
					className={`px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${
						description.length > 0 && !isDescriptionValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
					}`}
				/>

				<p className="text-md mb-1">Creator (director) *</p>
				<input
					type="text"
					placeholder="Director / creator"
					value={creator}
					onChange={(e) => setCreator(e.target.value)}
					maxLength={100}
					className={`px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${
						creator.length > 0 && !isCreatorValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
					}`}
				/>

				<div className="flex gap-3">
					<div className="flex-1 min-w-0">
						<p className="text-md mb-1">Year *</p>
						<input
							type="text"
							placeholder="e.g. 1994"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							maxLength={4}
							className={`w-full px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${
								year.length > 0 && !isYearValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
							}`}
						/>
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-md mb-1">Poster URL *</p>
						<input
							type="text"
							placeholder="https://example.com/poster.jpg"
							value={posterUrl}
							onChange={(e) => setPosterUrl(e.target.value)}
							className={`w-full px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${
								posterUrl.length > 0 && !isPosterValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
							}`}
						/>
					</div>
				</div>

				{error && <p className="text-sm text-[#DD4242] mb-3 text-center font-medium">{error}</p>}
				{success && <p className="text-sm text-[#22c55e] mb-3 text-center font-medium">{success}</p>}

				<button
					onClick={handleAddFilm}
					disabled={!isFormValid || isLoading}
					className={`font-semibold py-2 rounded-xl transition duration-200 mb-2 ${
						isFormValid && !isLoading ? "bg-[#DD4242] hover:bg-[#722121]" : "bg-[#722121] cursor-not-allowed opacity-75"
					}`}>
					{isLoading ? "Adding film..." : "Add film"}
				</button>
			</div>
		</main>
	);
}
