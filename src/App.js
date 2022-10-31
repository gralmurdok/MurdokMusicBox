import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Player } from "./Player/Player";
import { useEffect, useState } from "react";
import axios from "axios";
import { dataTypes, WebsocketManager } from "./WebSocketService";

const Config = () => {
  const [image, setImage] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    WebsocketManager.addStatusUpdateHandler((websocketMessage) => {
      const parsedData = JSON.parse(websocketMessage.data);
      const dataType = parsedData.type;

      switch (dataType) {
        case dataTypes.START_VISUAL_SHOW:
          setImage(parsedData.appData);
          break;
        case dataTypes.PLAYER:
          navigate("/player");
          break;

        default:
        // do nothing
      }

      console.log("FROM CONFIG " + parsedData.appData);
    });

    try {
      axios
        .get("/slider-info")
        .then((currentImage) =>
          setImage(currentImage.data.images[0].base64Source)
        )
        .catch((err) => {
          // do nothing
        });
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <div className="visualShow">
      <img alt="" src={image} />
    </div>
  );
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
