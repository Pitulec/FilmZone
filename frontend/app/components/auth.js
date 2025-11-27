import { cookies } from "next/headers";

export default async function Login(formData) {
	const user = new URLSearchParams();
	user.append("username", formData.get("username"));
	user.append("password", formData.get("password"));

	//validate

	try {
		const response = await fetch("http://localhost:8000/auth/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: user,
		});

		if (response.ok) {
			const data = await response.json();
			const expireDate = new Date() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
			const cookieStore = await cookies();
			cookieStore.set("token", data.access_token, { expires: expireDate, httpOnly: true, path: "/" });
			navigate("/");
		} else {
			const errData = await response.json();
		}
	} catch (error) {
		//show err
	}
}
