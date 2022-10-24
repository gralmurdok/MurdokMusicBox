import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Player } from "./Player/Player";
import { useEffect, useState } from "react";
import axios from "axios";

const Config = () => {
  const [image, setImage] = useState();

  useEffect(async () => {
    try {
      const currentImage = await axios.get("/slider-info");
      setImage(currentImage.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return <img src={image} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="config" element={<Config />} />
        <Route path="player" element={<Player />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
