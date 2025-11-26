/** @type {import('next').NextConfig} */
const nextConfig = {
	/* config options here */
	reactCompiler: true,

	images: {
		remotePatterns: [new URL("https://i.imgur.com/")],
	},
};

export default nextConfig;
