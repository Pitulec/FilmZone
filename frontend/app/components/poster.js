"use client";

import React, { use } from "react";
import Rating from "./rating";
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
				setRating(result.rating || 0.0); 
			} catch (error) {
				setImg("/poster-placeholder.jpg"); // set a local placeholder image
				setTitle("Film Title");
				setRating(0.0);
			}
		}

		fetchFilmPoster();
	}, [filmId]); 

	return (
		<a href={`/film?id=${filmId}`} className="hover:cursor-pointer">
			<div
				className="relative rounded-xl outline-3 outline-[#8D99AE] aspect-1/2"
				style={{
					aspectRatio: width / height,
					backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 50), rgba(0, 0, 0, 0)),url(" + img + ")",
					backgroundSize: "cover",
				}}
				alt={title ? "Poster for " + title : "Film poster"}
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