"use client";

import React, { useState, useEffect } from "react";
import Poster from "@/components/Poster";
import Rating from "@/components/Rating";
import AddReviewModal from "@/components/AddReviewModal";
import { Plus, User, Calendar } from "lucide-react";

function ReviewCard({ review }) {
	return (
		<div className="mb-6">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-bold mb-1">{review.title}</h3>
				<div className="flex items-center">
					<Rating value={review.stars} size={16} />
				</div>
			</div>
			<p className="mt-2 text-[#EDF2F4]">{review.content}</p>
		</div>
	);
}

export default function FilmPage({ params }) {
	const [filmId, setFilmId] = useState(null);

	useEffect(() => {
		let mounted = true;
		Promise.resolve(params)
			.then((p) => {
				if (mounted && p && p.id) setFilmId(p.id);
			})
			.catch((err) => {
				console.error("Failed to resolve params:", err);
			});

		return () => {
			mounted = false;
		};
	}, [params]);
	const [filmDetails, setFilmDetails] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchReviews = async () => {
		try {
			const reviewsResponse = await fetch(`http://localhost:8000/reviews/film/${filmId}`);
			if (reviewsResponse.ok) {
				const reviewsResult = await reviewsResponse.json();
				setReviews(reviewsResult);
			} else {
				console.error("Failed to fetch reviews");
			}
		} catch (err) {
			console.error("Error fetching reviews:", err);
		}
	};

	useEffect(() => {
		if (!filmId) return;
		async function fetchFilmData() {
			const filmUrl = `http://localhost:8000/films/${filmId}`;

			try {
				const filmResponse = await fetch(filmUrl);
				if (!filmResponse.ok) throw new Error(`Film response status: ${filmResponse.status}`);
				const filmResult = await filmResponse.json();
				setFilmDetails(filmResult);

				await fetchReviews();
			} catch (err) {
				console.error("Failed to fetch film data:", err);
				setError("Failed to load film data.");

				setFilmDetails({
					title: "Movie Placeholder",
					description:
						"{film}.{description} = Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac magna scelerisque, aliquam libero non, maximus felis. Cras semper eu ex nec tincidunt. Mauris ultricies urna id arcu bibendum convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris pharetra felis sodales lectus maximus, at mattis nisl consequat. Aenean quis convallis augue, et blandit nisi. Pellentesque porta ac nunc sit amet tincidunt. Donec consectetur feugiat metus, id congue neque. Integer tristique nunc et felis mollis, sit amet eleifend elit porta. Aenean finibus mi at ligula vestibulum, a accumsan est eleifend. Etiam massa quam, bibendum eget mattis ut, vehicula vel magna. Pellentesque fringilla eget massa sit amet lobortis.",
				});
				setReviews([
					{
						title: "{review}.{title}",
						rating: 4,
						content:
							"{review}.{content} = Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac magna scelerisque, aliquam libero non, maximus felis. Cras semper eu ex nec tincidunt. Mauris ultricies urna id arcu bibendum convallis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris pharetra felis sodales lectus maximus, at mattis nisl consequat. Aenean quis convallis augue, et blandit nisi. Pellentesque porta ac nunc sit amet tincidunt. Donec consectetur feugiat metus, id congue neque. Integer tristique nunc et felis mollis, sit amet eleifend elit porta. Aenean finibus mi at ligula vestibulum, a accumsan est eleifend. Etiam massa quam, bibendum eget mattis ut, vehicula vel magna. Pellentesque fringilla eget massa sit amet lobortis.",
					},
				]);
			} finally {
				setLoading(false);
			}
		}

		fetchFilmData();
	}, [filmId]);

	if (loading) {
		return <h1 className="text-center text-3xl font-bold my-20">Loading...</h1>;
	}

	if (error && !filmDetails) {
		return <h1 className="text-center text-3xl font-bold my-20 text-[#DD4242]">{error}</h1>;
	}

	return (
		<main className="mx-auto max-w-3xl px-7.5 mt-25">
			<h1 className="text-2xl font-bold mb-8 text-[#EDF2F4]">Film details & reviews</h1>

			<div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
				<div className="shrink-0 w-64">
					<div className="w-full aspect-2/3 overflow-hidden rounded-xl outline-3 outline-[#8D99AE]">
					<img src={filmDetails?.poster_url} alt={filmDetails?.title} className="rounded-xl outline-2 outline-[#8D99AE] shadow-2xl shadow-[#8d99ae2c] w-[300px] h-[450px] object-cover flex-shrink-0"/>
					</div>
				</div>

				<div className="grow">
					<h2 className="text-4xl font-bold text-[#EDF2F4] mb-4">{filmDetails?.title || "Film Title Placeholder"}</h2>
					<p className="text-[#EDF2F4] leading-relaxed">{filmDetails?.description || "Description placeholder..."}</p>
					<p className="mt-4 text-sm text-neutral-400"><User className="inline w-5" /> {filmDetails?.creator || "Creator Placeholder"}</p>
					<p className="text-sm text-neutral-400"><Calendar className="inline w-5" /> {filmDetails?.year || "Year Placeholder"}</p>
				</div>
			</div>

			<hr className="my-10 border-t-2 border-[#8D99AE]" />

			<div className="mb-20">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-bold text-[#DD4242]">User reviews</h2>

					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center justify-center bg-[#DD4242] hover:bg-[#bc2121] py-2 px-4 rounded-full font-medium text-[#EDF2F4] w-50 gap-1">
						<span className="text-xl leading-none">+</span> Review
					</button>
				</div>

				{reviews.length > 0 ? (
					reviews.map((review, index) => <ReviewCard key={index} review={review} />)
				) : (
					<p className="text-[#8D99AE]">No reviews yet!</p>
				)}
			</div>

			<AddReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} filmId={filmId} onReviewAdded={fetchReviews} />
		</main>
	);
}
