import "./App.css"
import { Routes, Route } from "react-router"
import Home from "./pages/Home"
import Layout from "./components/Layout"
import AnalysisPage from "./pages/AnalysisPage"
import PredictionPage from "./pages/PredictionPage"
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<AnalysisPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  )
}

export default App
