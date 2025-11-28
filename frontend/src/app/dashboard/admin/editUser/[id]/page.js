import EditUserForm from "./EditUserForm";

export default function Page({ params }) {
	return <EditUserForm userId={params.id} />;
}
