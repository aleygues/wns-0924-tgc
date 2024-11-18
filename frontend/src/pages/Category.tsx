import { useParams } from "react-router-dom";
import { Ad } from "../components/Ad";
import AdsContainer from "../components/AdsContainer";
import { useQuery } from "@apollo/client";
import { queryCategory } from "../api/category";

export function CategoryPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data } = useQuery(queryCategory, {
    variables: {
      id: id as string,
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
            tags={ad.tags as any}
            important
          />
        ))}
      </AdsContainer>
    </>
  );
}
