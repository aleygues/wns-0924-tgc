import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdType } from "../types";

export function AdPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [ad, setAd] = useState<AdType>();

  useEffect(() => {
    async function fetch() {
      const result = await axios.get<AdType>(`http://localhost:5000/ads/${id}`);
      setAd(result.data);
    }
    fetch();
  }, [id]);

  async function doDelete() {
    try {
      await axios.delete<AdType>(`http://localhost:5000/ads/${id}`);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
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
    </div>
  );
}
