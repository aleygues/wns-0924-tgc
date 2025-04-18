import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { queryAd } from "../api/ad";
import { mutationDeleteAd } from "../api/deleteAd";
import { queryAds } from "../api/ads";
import { queryWhoami } from "../api/whoiam";

export function AdPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: whoamiData } = useQuery(queryWhoami);
  const me = whoamiData?.whoami;

  const { data } = useQuery(queryAd, {
    variables: {
      id: id as string,
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
          id: id as string,
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

  if (ad === null) {
    return <p>Annonce introuvable</p>;
  }

  return (
    <div>
      <h1>{ad.title}</h1>
      <p>{ad.description}</p>
      <p>{ad.category?.name}</p>
      <p>Créée par {ad.createdBy?.email ?? "(information cachée)"}</p>
      {/* Should be displayed only for admins and author */}
      {(me?.role === "admin" || me?.id === ad.createdBy.id) && (
        <>
          <button onClick={onDelete}>Supprimer l'offre</button>
          <button onClick={onUpdate}>Modifier l'offre</button>
        </>
      )}
    </div>
  );
}
