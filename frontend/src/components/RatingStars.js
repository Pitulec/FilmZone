import React from "react";

export default function RatingStars({ value = 0, max = 5, size = 24 }) {
	const rating = Math.max(0, Math.min(value, max));
	return (
		<div className="inline gap-4 justify-center items-center">
			{Array.from({ length: max }).map((_, i) => {
				const filled = i < rating;
				return (
					<svg
						key={i}
						width={size}
						height={size}
						viewBox="0 0 24 24"
						fill={filled ? "#DD4242" : "none"}
						stroke="#8D99AE"
						strokeWidth="1"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{ display: "inline-block" }}>
						<polygon points="12,2 15,9 22,9.5 17,15 18.5,22 12,18.5 5.5,22 7,15 2,9.5 9,9" />
					</svg>
				);
			})}
		</div>
	);
}
