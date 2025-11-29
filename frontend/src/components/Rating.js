import React, { use } from "react";
import RatingStars from "./RatingStars";

export default function Rating({ value, size = 24 }) {
	if (value == null || value == undefined) {
		return <span>No rating</span>;
	} else {
		return (
			<span className="flex justify-center items-center">
				<span className="mr-1">{value.toFixed(1)}</span>
				<RatingStars value={value} size={size} />
			</span>
		);
	}
}
