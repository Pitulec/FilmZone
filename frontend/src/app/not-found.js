export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-8">Oops! The page you're looking for doesn't exist.</p>
            <a href="/" className="bg-[#DD4242] hover:bg-[#bc2121] text-white font-semibold py-3 px-6 rounded-lg">
                Go Back Home
            </a>
        </div>
    );
}