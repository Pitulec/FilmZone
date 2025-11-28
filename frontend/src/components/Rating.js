import React, { use } from "react";
import { Star } from "lucide-react";

export default function Rating({ value }) {
    if (value == null || value == undefined) {
        return <span>No rating</span>;
    } else {
        return (
            <span>
                <span className="mr-1">{value.toFixed(1)}</span>
                <Star className="w-4 h-4 inline mr-1" />
                <Star className="w-4 h-4 inline mr-1" />
                <Star className="w-4 h-4 inline mr-1" />
                <Star className="w-4 h-4 inline mr-1" />
                <Star className="w-4 h-4 inline mr-1" />
            </span>
        );
    }
}