import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MapPage from "./Map";
import Demo from "./Demo";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Home
              onStartCharging={() => window.location.href = "/demo"}
            />
          }
        />

        <Route path="/map" element={<MapPage />} />

        <Route path="/demo" element={<Demo />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;