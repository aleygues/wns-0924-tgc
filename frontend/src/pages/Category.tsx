import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ad } from "../components/Ad";
import { CategoryType } from "../types";
import AdsContainer from "../components/AdsContainer";

export function CategoryPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [category, setCategory] = useState<CategoryType | null>();

  useEffect(() => {
    async function fetch() {
      try {
        const result = await axios.get<CategoryType>(
          `http://localhost:5000/categories/${id}`
        );
        setCategory(result.data);
      } catch {
        setCategory(null);
      }
    }
    fetch();
  }, [id]);

  if (category === undefined) {
    return <p>Chargement</p>;
  }

  if (category === null) {
    return <p>Désolé, ce n'est pas trouvé</p>;
  }

  return (
    <>
      <h2>{category?.name}</h2>
      <AdsContainer>
        {category?.ads?.map((ad) => (
          <Ad
            key={ad.id}
            id={ad.id}
            picture={ad.picture}
            title={ad.title}
            price={ad.price}
            description={ad.description}
            owner={ad.owner}
            location={ad.location}
            tags={ad.tags}
            important
          />
        ))}
      </AdsContainer>
    </>
  );
}
