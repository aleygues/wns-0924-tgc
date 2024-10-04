import { useEffect, useState } from "react";
import { Ad } from "./Ad";
import axios from "axios";
import { AdType } from "../types";
import AdsContainer from "./AdsContainer";

export function RecentAds() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [ads, setAds] = useState<AdType[]>([]);

  useEffect(() => {
    async function fetch() {
      const result = await axios.get<AdType[]>("http://127.0.0.1:5000/ads");
      setAds(result.data);
    }
    fetch();
  }, []);

  return (
    <>
      <h2>Annonces récentes</h2>
      Prix total : {totalPrice}
      <AdsContainer>
        {ads.map((ad) => (
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
            onAddToCart={() => setTotalPrice(totalPrice + ad.price)}
          />
        ))}
      </AdsContainer>
    </>
  );
}
