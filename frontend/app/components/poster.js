"use client";

import React, { use } from "react";
import Rating from "./rating";
import { useState } from "react";

export default function Poster({ filmId, width, height }) {
	const [img, setImg] = useState(null);
	const [title, setTitle] = useState(null);
	const [rating, setRating] = useState(null);

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
			setRating(0.0);
		} catch (error) {
			setImg(""); //set placeholders, inform user of error.
		}
	}

	fetchFilmPoster();

	return (
		<a className="hover:cursor-pointer">
			<div
				className="relative rounded-xl outline-3 outline-[#8D99AE] aspect-1/2"
				style={{
					aspectRatio: width / height,
					backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 50), rgba(0, 0, 0, 0)),url(" + img + ")",
					backgroundSize: "cover",
				}}
				alt="" //alt plakatu na podstawie movieId
			>
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
