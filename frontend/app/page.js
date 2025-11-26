import Poster from "./components/poster";

export default function Home() {
	return (
		<>
			<div className="grid grid-cols-5 mx-auto mt-20 max-w-3xl gap-10">
				<span className="col-span-3">
					<h1 className="text-5xl font-medium text-left mt-5 text-[#DD4242]">Discover. Rate. Share your favorite movies.</h1>
					<p className="text-xl font-medium text-left mt-5 text-[#EDF2F4]">
						Join our community to review your favorite films and explore new recommendations.
						<br />
						<a href="/#trending" className="inline-block bg-[#DD4242] hover:bg-[#bc2121] mt-5 py-3 px-10 rounded-xl">
							Start exploring
						</a>
					</p>
				</span>
				<div className="col-span-2">
					<h2 className="text-xl my-5 text-[#DD4242] font-bold">Featured:</h2>
					<Poster filmId="1" width="300" height="300" className="row-span-2" />
				</div>
			</div>
			<div className="items-center justify-between mx-auto max-w-3xl mt-20">
				<h1 id="trending" className="text-3xl my-5 text-[#DD4242] font-bold">
					Trending:
				</h1>
				<div className="grid grid-cols-3 items-center justify-between mx-auto gap-10">
					<Poster filmId="1" width="300" height="450" />
					<Poster filmId="1" width="300" height="450" />
					<Poster filmId="1" width="300" height="450" />
				</div>
			</div>
			<div className="items-center justify-between mx-auto max-w-3xl mt-20">
				<h1 className="text-3xl my-5 text-[#DD4242] font-bold">Top films:</h1>
				<div className="grid grid-cols-4 items-center justify-between mx-auto gap-5">
					<Poster filmId="1" width="300" height="450" />
					<Poster filmId="1" width="300" height="450" />
					<Poster filmId="1" width="300" height="450" />
					<Poster filmId="1" width="300" height="450" />
				</div>
			</div>
		</>
	);
}
