import { useEffect, useState } from "react";
import { Ad, AdProps } from "./Ad";
import axios from "axios";

export function RecentAds() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [ads, setAds] = useState<AdProps[]>([]);

  useEffect(() => {
    async function fetch() {
      const result = await axios.get<AdProps[]>("http://127.0.0.1:5000/ads");
      setAds(result.data);
    }
    fetch();
  }, []);

  return (
    <>
      <h2>Annonces récentes</h2>
      Prix total : {totalPrice}
      <section className="recent-ads">
        {ads.map((ad) => (
          <div key={ad.id}>
            <Ad
              id={ad.id}
              picture={ad.picture}
              title={ad.title}
              price={ad.price}
              onAddToCart={() => setTotalPrice(totalPrice + ad.price)}
            />
          </div>
        ))}
      </section>
    </>
  );
}
