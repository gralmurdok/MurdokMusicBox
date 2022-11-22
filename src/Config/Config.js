import "./Config.css";
import { useState } from "react";
import axios from "axios";
import { ImagesSection } from "./ImagesConfig";
import { OwnerSection } from "./OwnerSection";
import { ApproveButton } from "./ApproveButton";

const defaultSliderStatus = {
  images: [],
};

const Config = () => {
  const [sliderStatus, setSliderStatus] = useState(defaultSliderStatus);
  const [owner, setOwner] = useState("");

  const updateSliderStatus = () => {
    axios
      .get("/slider-info")
      .then((currentAppData) => {
        setSliderStatus({
          images: currentAppData.data.images,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateOwner = () => {
    axios
      .post("/update-party-owner", {
        owner,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const approveParty = () => {
    axios
      .post("/approve-party", {
        owner,
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="config">
      <OwnerSection
        onClickUpdateOwner={updateOwner}
        onChangeOwner={setOwner}
        owner={owner}
      />
      <ImagesSection
        images={sliderStatus.images}
        onClickUpdate={updateSliderStatus}
      />
      <ApproveButton onClickApprove={approveParty} />
    </div>
  );
};

export { Config };
