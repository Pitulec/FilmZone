"use client";

import React, { use } from "react";
import Rating from "@/components/Rating";
import { useState, useEffect } from "react";

export default function Poster({ filmId, width, height }) {
	const [img, setImg] = useState(null);
	const [title, setTitle] = useState(null);
	const [rating, setRating] = useState(null);

	useEffect(() => {
		async function fetchFilmPoster() {
			const url = `http://localhost:8000/films/${filmId}`;

			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`);
				}
				const result = await response.json();
				setImg(result.poster_url);
				setTitle(result.title);
			} catch (error) {
				setImg("https://i.imgur.com/3P6DDpR.png");
				setTitle("Film Title");
			}
		}
		async function fetchRating() {
			const url = `http://localhost:8000/reviews/film/${filmId}`;

			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`);
				}
				const result = await response.json();
				let ratingSum = 0;
				let ratingCount = 0;
				for (let r of result) {
					ratingSum += parseFloat(r.stars);
					ratingCount++;
				}
				setRating(ratingCount > 0 ? ratingSum / ratingCount : null);
			} catch (error) {
				setRating(null);
			}
		}

		fetchRating();
		fetchFilmPoster();
	}, [filmId]);

	return (
		<a href={`/film/${filmId}`} className="hover:cursor-pointer">
			<div
				className="relative rounded-xl outline-3 outline-[#8D99AE] aspect-1/2"
				style={{
					aspectRatio: width / height,
					backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 50), rgba(0, 0, 0, 0)),url(" + img + ")",
					backgroundSize: "cover",
				}}
				alt={title ? "Poster for " + title : "Film poster"}>
				<div className="absolute bottom-2 left-2 text-xl">
					<span className="flex">{title}</span>
					<span className="flex">
						<Rating value={rating} />
					</span>
				</div>
			</div>
		</a>
	);
}
