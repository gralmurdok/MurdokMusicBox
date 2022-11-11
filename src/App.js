import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Player } from "./Player/Player";
import { useEffect, useState } from "react";
import axios from "axios";
import { dataTypes, WebsocketManager } from "./WebSocketService";

const defaultSliderStatus = {
  images: []
};

const Config = () => {
  const [sliderStatus, setSliderStatus] = useState(defaultSliderStatus);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    WebsocketManager.addStatusUpdateHandler((websocketMessage) => {
      const parsedData = JSON.parse(websocketMessage.data);
      const dataType = parsedData.type;
      const imageIndex = parsedData.appData ?? 0;

      switch (dataType) {
        case dataTypes.LOAD_IMAGE:
          setCurrentImageIndex(imageIndex);
          break;
        case dataTypes.PLAYER:
          navigate("/player");
          break;

        default:
        // do nothing
      }

      console.log(`FROM CONFIG ${websocketMessage.data}`);
    });

    axios
      .get("/slider-info")
      .then((currentAppData) => {
        setSliderStatus({
          images: currentAppData.data.images,
        });

        console.log(JSON.stringify(sliderStatus.images, null, 2));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="visualShow">
      <img alt="" src={sliderStatus.images[currentImageIndex]?.base64Source} />
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
