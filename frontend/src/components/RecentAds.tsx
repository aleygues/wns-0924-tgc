import { useState } from "react";
import { queryAds } from "../api/ads";
import { AdType } from "../types";
import { Ad } from "./Ad";
import AdsContainer from "./AdsContainer";
import { useQuery } from "@apollo/client";

export function RecentAds() {
  const [showAds, setShowAds] = useState(false);
  const { data, loading } = useQuery<{ ads: AdType[] }>(queryAds, {
    skip: !showAds,
  });
  const ads = data?.ads;

  return (
    <>
      <h2>Annonces récentes</h2>
      <button onClick={() => setShowAds(!showAds)}>Show ads</button>
      {showAds && (
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
              owner={ad.owner}
              location={ad.location}
              tags={ad.tags}
              onAddToCart={() => {}}
            />
          ))}
        </AdsContainer>
      )}
    </>
  );
}
