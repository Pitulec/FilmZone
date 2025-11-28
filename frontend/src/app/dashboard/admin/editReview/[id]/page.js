import EditReviewForm from "./EditReviewForm";

export default function Page({ params }) {
	return <EditReviewForm reviewId={params.id} />;
}
