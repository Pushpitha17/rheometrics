import "./App.css";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import AnalysisPage from "./pages/AnalysisPage";
import PredictionPage from "./pages/PredictionPage";

function App() {


  return (
    <Routes>
      <Route path="/" element={<Layout />} >
      <Route
          path="/"
          element={<AnalysisPage />}
        />
        <Route path="/prediction" element={<PredictionPage />} />
      </Route>
      
    </Routes>
  );
}

export default App;
