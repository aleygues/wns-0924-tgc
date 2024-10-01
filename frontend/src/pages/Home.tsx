import { useState } from "react";
import { RecentAds } from "../components/RecentAds";

export function HomePage() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(!show)}>Afficher/fermer</button>
      {show === true && <RecentAds />}
    </>
  );
}
