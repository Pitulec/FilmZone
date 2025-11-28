"use client";
import { useState } from "react";

export default function Home() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const isUsernameValid = username.length >= 6 && username.length <= 70;
	const isPasswordValid = password.length >= 6 && password.length <= 70;
	const isFormValid = isUsernameValid && isPasswordValid;

	const handleSignIn = async () => {
		if (!isFormValid) {
			setError("Fulfill form (6-70 characters).");
			return;
		}

		setError(null);
		setIsLoading(true);

		const url = "http://localhost:8000/auth/signin";
		const formData = new URLSearchParams();
		formData.append("username", username);
		formData.append("password", password);

		try {
			const response = await fetch("http://localhost:8000/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: formData.get("username"),
					role: "user",
					password: formData.get("password"),
				}),
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("token", data.access_token);
			} else {
				const data = await response.json();
				const errorMessage = data.detail;

				setError(errorMessage);
				console.error("Backend error:", data);
			}
		} catch (err) {
			console.error("Connection error:", err);
			setError("Connection error. Make sure the server is running (e.g., CORS or network error).");
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

				<p className="text-md mb-1">Username</p>
				<input
					type="text"
					placeholder="John Doe"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					minLength={6}
					maxLength={70}
					className={`px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-3 ${
						username.length > 0 && !isUsernameValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
					}`}
				/>
				{username.length > 0 && !isUsernameValid && (
					<p className="text-sm text-[#DD4242] mb-3 -mt-2">Username must be between 6 and 70 characters long.</p>
				)}

				<p className="text-md mb-1">Password</p>
				<input
					type="password"
					placeholder="P@ssword123!"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					minLength={6}
					maxLength={70}
					className={`px-3 py-2 bg-[#8d99ae21] outline rounded-xl mb-6 ${
						password.length > 0 && !isPasswordValid ? "outline-[#DD4242]" : "outline-[#8D99AE]"
					}`}
				/>
				{password.length > 0 && !isPasswordValid && (
					<p className="text-sm text-[#DD4242] mb-3 -mt-5">Password must be between 6 and 70 characters long.</p>
				)}

				{error && <p className="text-sm text-[#DD4242] mb-3 text-center font-medium">{error}</p>}

				<button
					onClick={handleSignIn}
					disabled={!isFormValid || isLoading}
					className={`font-semibold py-2 rounded-xl transition duration-200 mb-2 ${
						isFormValid && !isLoading ? "bg-[#DD4242] hover:bg-[#722121]" : "bg-[#722121] cursor-not-allowed opacity-75"
					}`}>
					{isLoading ? "Signing up..." : "Sign up"}
				</button>

				<a href="/auth/signin" className="text-center font-semibold text-[#8D99AE]">
					Already have an account? <span className="underline">Sign in</span>
				</a>
			</div>
		</main>
	);
}