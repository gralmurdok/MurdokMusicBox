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
  const [partyCode, setPartyCode] = useState("");

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

  const updatePartyCode = () => {
    axios
      .get("/update-party-code")
      .then((response) => {
        setPartyCode(response.data.specialEventCode);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const approveParty = () => {
    axios
      .post("/approve-party")
      .then(() => {
        setPartyCode("");
        setSliderStatus(defaultSliderStatus);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="config">
      <OwnerSection
        onClickUpdatePartyCode={updatePartyCode}
        partyCode={partyCode}
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
