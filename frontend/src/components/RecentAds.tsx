import React, { useEffect, useState } from "react";
import { Ad, AdProps } from "./Ad";

async function getAds(): Promise<AdProps[]> {
  return [
    {
      id: 1,
      picture:
        "https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994_1280.jpg",
      title: "Table",
      price: 120,
    },
    {
      id: 1,
      picture:
        "https://cdn.pixabay.com/photo/2016/09/27/13/06/sculpture-1698293_1280.jpg",
      title: "Dame-jeanne",
      price: 75,
    },
    {
      id: 1,
      picture:
        "https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994_1280.jpg",
      title: "Vide-poche",
      price: 4,
    },
    {
      id: 1,
      picture:
        "https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994_1280.jpg",
      title: "Vaisselier",
      price: 900,
    },
    {
      id: 1,
      picture:
        "https://cdn.pixabay.com/photo/2019/12/15/11/20/candles-4696862_1280.jpg",
      title: "Bougie",
      price: 8,
    },
    {
      id: 1,
      picture:
        "https://cdn.pixabay.com/photo/2017/03/28/12/17/chairs-2181994_1280.jpg",
      title: "Porte-magazine",
      price: 45,
    },
  ];
}

// RecentAds({children})

export function RecentAds() {
  const [totalPrice, setTotalPrice] = useState(0);
  /* const arr = useState(0);
  const counter = arr[0];
  const setCounter = arr[1]; */

  const [ads, setAds] = useState<AdProps[]>([]);
  useEffect(() => {
    console.log("Mounting the component");
    getAds().then((newAds) => {
      setAds(newAds);
      console.log("New array values =>", ads);
    });

    return () => {
      console.log("Unmounting component");
    };
  }, []);

  console.log(`On render, ads is =>`, ads);
  console.log(`On render, total is =>`, totalPrice);

  return (
    <>
      <h2>Annonces récentes</h2>
      Prix total : {totalPrice}
      <section className="recent-ads">
        {ads.map((ad) => (
          <div key={ad.title}>
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
