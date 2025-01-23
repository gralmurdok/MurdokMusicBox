import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Player } from "./Player/Player";
import { VisualShow } from "./VisualShow/VisualShow";
import { Config } from "./Config/Config";
import { About } from "./About/About";
import { WeddingInvite } from "./WeddingInvite/WeddingInvite";
import { WeddingGuestList } from "./WeddingInvite/WeddingGuestList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="config" element={<Config />} />
        <Route path="visual_show" element={<VisualShow />} />
        <Route path="player" element={<Player />} />
        <Route path="about" element={<About />} />
        <Route path="wedding" element={<WeddingInvite />} />
        <Route path="guest_list_admin" element={<WeddingGuestList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
