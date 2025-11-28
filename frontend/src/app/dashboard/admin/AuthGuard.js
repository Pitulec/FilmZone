"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
	const router = useRouter();
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
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
