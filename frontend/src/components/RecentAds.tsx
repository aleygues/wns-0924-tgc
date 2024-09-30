import { Ad, AdProps } from "./Ad";

const ads: AdProps[] = [
  { id: 1, picture: "/images/table.webp", title: "Table", price: 120 },
  {
    id: 1,
    picture: "/images/dame-jeanne.webp",
    title: "Dame-jeanne",
    price: 75,
  },
  { id: 1, picture: "/images/vide-poche.webp", title: "Vide-poche", price: 4 },
  {
    id: 1,
    picture: "/images/vaisselier.webp",
    title: "Vaisselier",
    price: 900,
  },
  { id: 1, picture: "/images/bougie.webp", title: "Bougie", price: 8 },
  {
    id: 1,
    picture: "/images/porte-magazine.webp",
    title: "Porte-magazine",
    price: 45,
  },
];

export function RecentAds() {
  return (
    <>
      <h2>Annonces récentes</h2>
      <section className="recent-ads">
        {ads.map((ad) => (
          <Ad
            key={ad.title}
            id={ad.id}
            picture={ad.picture}
            title={ad.title}
            price={ad.price}
          />
        ))}
      </section>
    </>
  );
}
