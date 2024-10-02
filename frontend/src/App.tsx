import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/Home";
import { AboutPage } from "./pages/About";
import { PageLayout } from "./components/Layout";
import { AdPage } from "./pages/Ad";
import { AdEditorPage } from "./pages/AdEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route Component={PageLayout}>
          <Route path="/" Component={HomePage} />
          <Route path="/ads/:id" Component={AdPage} />
          <Route path="/ads/new" Component={AdEditorPage} />
          <Route path="/about" Component={AboutPage} />
          <Route path="*" Component={() => <Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
