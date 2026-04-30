import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Demo from "./Demo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;