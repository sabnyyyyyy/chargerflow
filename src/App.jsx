import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MapPage from "./Map";
import Demo from "./Demo";

function App() {
  return (
    <HashRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Home
              onStartCharging={() => window.location.href = "/#/demo"}
            />
          }
        />

        <Route path="/map" element={<MapPage />} />

        <Route path="/demo" element={<Demo />} />

      </Routes>

    </HashRouter>
  );
}

export default App;