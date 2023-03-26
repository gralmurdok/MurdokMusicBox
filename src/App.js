import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Player } from "./Player/Player";
import { VisualShow } from "./VisualShow/VisualShow";
import { Config } from "./Config/Config";
import { About } from "./About/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="config" element={<Config />} />
        <Route path="visual_show" element={<VisualShow />} />
        <Route path="player" element={<Player />} />
        <Route path="/" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
