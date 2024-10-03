import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdProps } from "../components/Ad";

export function AdPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [ad, setAd] = useState<AdProps>();

  useEffect(() => {
    async function fetch() {
      const result = await axios.get<AdProps>(
        `http://localhost:5000/ads/${id}`
      );
      setAd(result.data);
    }
    fetch();
  }, [id]);

  if (ad === undefined) {
    return <p>Chargement</p>;
  }

  return (
    <div>
      <h1>{ad.title}</h1>
      <p>{ad.description}</p>
      <p>{ad.category?.name}</p>
    </div>
  );
}
