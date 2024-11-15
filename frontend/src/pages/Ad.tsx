import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AdType } from "../types";
import { useQuery } from "@apollo/client";
import { queryAd } from "../api/ad";

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

  async function doDelete() {
    try {
      await axios.delete<AdType>(`http://localhost:5000/ads/${id}`);
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
      <button onClick={doDelete}>Supprimer l'offre</button>
      <button onClick={onUpdate}>Modifier l'offre</button>
    </div>
  );
}
