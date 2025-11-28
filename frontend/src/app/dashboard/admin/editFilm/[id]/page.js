import EditFilmForm from "./EditFilmForm";

export default function Page({ params }) {
	return <EditFilmForm filmId={params.id} />;
}
