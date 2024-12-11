import { useMemo, useState } from "react";
import { queryAds } from "../api/ads";
import { Ad } from "./Ad";
import AdsContainer from "./AdsContainer";
import { useQuery } from "@apollo/client";

export function RecentAds() {
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);

  const { data, loading } = useQuery(queryAds, {
    variables: {
      limit,
      offset,
      withCount: true,
    },
    fetchPolicy: "cache-and-network",
  });
  const ads = data?.ads;
  const adsCount = data?.adsCount ?? 0;
  const pagesCount = Math.ceil(adsCount / limit);

  const buttons = useMemo(() => {
    const buttons = [];
    for (let i = 0; i < pagesCount; i++) {
      buttons.push(
        <button
          onClick={() => {
            setOffset(i * limit);
          }}
        >
          Page {i + 1}
        </button>
      );
    }
    return buttons;
  }, [pagesCount]);
  // pages count = totalCount / limit

  return (
    <>
      <h2>Annonces</h2>
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
      {buttons}
    </>
  );
}
