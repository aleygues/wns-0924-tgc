import { useParams } from "react-router-dom";
import { Ad } from "../components/Ad";
import { CategoryType } from "../types";
import AdsContainer from "../components/AdsContainer";
import { useQuery } from "@apollo/client";
import { queryCategory } from "../api/category";

export function CategoryPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data } = useQuery<{ category: CategoryType }>(queryCategory, {
    variables: {
      id,
    },
  });
  const category = data?.category;

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
