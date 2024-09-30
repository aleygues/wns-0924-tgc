import "./App.css";
import { Navbar } from "./components/Navbar";
import { RecentAds } from "./components/RecentAds";

function App() {
  return (
    <body>
      <Navbar />
      <main className="main-content">
        <RecentAds />
      </main>
    </body>
  );
}

export default App;
