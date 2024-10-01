import { useParams } from "react-router-dom";

export function AdPage() {
  const params = useParams<{ id: string }>();

  const id = Number(params.id);

  return <p>On affiche l'offre {id}</p>;
}
