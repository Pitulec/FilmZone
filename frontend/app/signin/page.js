import react from "react";
import { Login } from "../scripts/auth";

export default function SignIn() {
	return (
		<>
			<div className="flex items-center justify-between mx-auto outline-2 outline-[#8D99AE] max-w-3xl p-10 top-25 rounded-xl mb-15 bg-[#2B2D42]">
				<form
					className="block w-full max-w-sm mx-auto"
					action={async (formData) => {
						await Login(formData);
						redirect("/");
					}}>
					<h1 className="text-center font-bold text-5xl mb-10">
						Film<span className="text-[#DD4242]">Zone</span>
					</h1>
					<label htmlFor="username" className="block mb-2 text-sm font-medium text-[#EDF2F4]">
						Username
					</label>
					<input
						type="text"
						id="username"
						name="username"
						className="mb-4 p-2 w-full text-[#EDF2F4] rounded-xl bg-[rgba(141,153,174,.15)] outline-2 outline-[#8D99AE]"
					/>
					<label htmlFor="password" className="block mb-2 text-sm font-medium text-[#EDF2F4]">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						className="mb-4 p-2 w-full text-[#EDF2F4] rounded-xl bg-[rgba(141,153,174,.15)] outline-2 outline-[#8D99AE]"
					/>
					<button type="submit" className="bg-[#DD4242] mt-2 w-full text-[#EDF2F4] px-4 py-2 rounded-xl hover:bg-[#bc2121]">
						Sign In
					</button>
					<p className="mt-2">
						Don't have an account yet?&nbsp;
						<a href="/signup" className="underline hover:text-[#DD4242]">
							Sign Up
						</a>
					</p>
				</form>
			</div>
		</>
	);
}
