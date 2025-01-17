import { useNavigate, useParams } from "react-router-dom";
import { AdType } from "../types";
import { useMutation, useQuery } from "@apollo/client";
import { queryAd } from "../api/ad";
import { mutationDeleteAd } from "../api/deleteAd";
import { queryAds } from "../api/ads";

export function AdPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data } = useQuery<{ ad: AdType }>(queryAd, {
    variables: {
      id,
    },
  });
  const ad = data?.ad;

  const [doDelete] = useMutation(mutationDeleteAd, {
    refetchQueries: [queryAds],
  });
  async function onDelete() {
    try {
      await doDelete({
        variables: {
          id,
        },
      });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  }

  function onUpdate() {
    navigate(`/ads/${id}/edit`);
  }

  if (ad === undefined) {
    return <p>Chargement</p>;
  }

  return (
    <div>
      <h1>{ad.title}</h1>
      <p>{ad.description}</p>
      <p>{ad.category?.name}</p>
      <p>Créée par {ad.createdBy?.email}</p>
      {/* Should be displayed only for admins and author */}
      <button onClick={onDelete}>Supprimer l'offre</button>
      <button onClick={onUpdate}>Modifier l'offre</button>
    </div>
  );
}
