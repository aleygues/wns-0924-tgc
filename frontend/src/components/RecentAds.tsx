import { queryAds } from "../api/ads";
import { Ad } from "./Ad";
import AdsContainer from "./AdsContainer";
import { useQuery } from "@apollo/client";

export function RecentAds() {
  const { data, loading } = useQuery(queryAds, {
    variables: {
      withCount: true,
    },
    fetchPolicy: "cache-and-network",
  });
  const ads = data?.ads;

  return (
    <>
      <h2>Annonces très récentes</h2>
      <AdsContainer>
        {loading === true && <p>Chargement</p>}
        {ads?.map((ad) => (
          <Ad
            key={ad.id}
            id={ad.id}
            picture={ad.picture}
            title={ad.title}
            price={ad.price}
            description={ad.description}
            location={ad.location}
            tags={ad.tags}
            createdBy={ad.createdBy}
            createdAt={ad.createdAt}
            onAddToCart={() => {}}
          />
        ))}
      </AdsContainer>
    </>
  );
}
