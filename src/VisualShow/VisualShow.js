import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { dataTypes, WebsocketManager } from "../WebSocketService";

const defaultSliderStatus = {
  images: [],
};

const VisualShow = () => {
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
    <div className="visual_show">
      <img alt="" src={sliderStatus.images[currentImageIndex]?.base64Source} />
    </div>
  );
};

export { VisualShow };
