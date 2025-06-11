import { useState } from "react";
import { RecentAds } from "../components/RecentAds";

export function HomePage() {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>
          <button onClick={() => setShow1(!show1)}>Show 1</button>
          {show1 && <RecentAds />}
        </div>
        <div>
          <button onClick={() => setShow2(!show2)}>Show 2</button>
          {show2 && <RecentAds />}
        </div>
      </div>
    </>
  );
}
