"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const decodeJwtPayload = (token) => {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        
        const padding = '='.repeat((4 - base64.length % 4) % 4);
        const decoded = atob(base64 + padding);
        
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Failed to decode JWT payload:", e);
        return null;
    }
};

export default function AuthGuard({ children }) {
	const router = useRouter();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		try {
			const token = localStorage.getItem("token");
			const decoded = decodeJwtPayload(token);
			console.log(decoded);
			if (decoded.role == "user") {
				// Replace so user cannot go back to protected page
				router.replace("/");
			} else {
				setChecked(true);
			}
		} catch (err) {
			// In case of SSR attempt to access localStorage, redirect to sign-in
			router.replace("/");
		}
	}, [router]);

	if (!checked) return <div className="p-6 mt-50 text-center">Redirecting...</div>;
	return <>{children}</>;
}
