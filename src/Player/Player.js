import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { SongRow } from "./SongRow";
import { QueuedSong } from "./QueuedSong";
import { dataTypes, WebsocketManager } from "../WebSocketService";
import { useNavigate } from "react-router-dom";

const defaultAppStatus = {
  isAuth: false,
  permitToken: {
    token: "",
    validUntil: 0,
  },
  currentSong: {
    name: "",
    artist: "",
    imgUrl: "",
    requesterName: "",
  },
  songQueue: [],
  wifiKey: "",
};

function Player() {
  const [appStatus, setAppStatus] = useState(defaultAppStatus);
  const navigate = useNavigate();

  useEffect(() => {
    WebsocketManager.addStatusUpdateHandler((websocketMessage) => {
      const parsedData = JSON.parse(websocketMessage.data);
      const dataType = parsedData.type;

      switch (dataType) {
        case dataTypes.PLAYER:
          setAppStatus(parsedData.appData);
          break;
        case dataTypes.LOAD_IMAGE:
          navigate("/visual_show");
          break;
        default:
        // do nothing
      }

      console.log(parsedData);
    });

    axios
      .get("/app-status")
      .then((permit) => {
        setAppStatus(permit.data);
      })
      .catch(() => {
        // do nothing
      });
  }, []);

  function renderAuthLink() {
    return (
      <div className="Auth-link-container">
        <a className="App-link" href="/spotify-login">
          Autorizar
        </a>
      </div>
    );
  }

  function renderQueuedSongs() {
    let rv = null;

    if (appStatus.songQueue.length > 0) {
      rv = (
        <div className="Queued-songs-list">
          {appStatus.songQueue.map((song) => (
            <QueuedSong
              name={song.name}
              artist={song.artist}
              imgUrl={song.imgUrl}
              requester={song.requesterName}
            />
          ))}
        </div>
      );
    } else {
      rv = null;
    }

    return <div className="Queued-songs-container">{rv}</div>;
  }

  function renderPlayer() {
    return (
      <Fragment>
        <div>
          <div className="songs-container">
            <SongRow
              name={appStatus.currentSong.name}
              artist={appStatus.currentSong.artist}
              imgUrl={appStatus.currentSong.imgUrl}
              requester={appStatus.currentSong.requesterName}
            />
          </div>
        </div>
      </Fragment>
    );
  }

  function renderHeader() {
    return (
      <Fragment>
        <div className="code-container">
          <div className="code-text">WS:0985467110</div>
        </div>
      </Fragment>
    );
  }

  const player = (
    <Fragment>
      <div className="current-song">{renderPlayer()}</div>
      <div className="App-header music-code">{renderHeader()}</div>
      <div className="App-content song-queue">{renderQueuedSongs()}</div>
    </Fragment>
  );

  return (
    <div
      className="App container"
      onDoubleClick={() =>
        !document.fullscreenElement
          ? document.body.requestFullscreen()
          : document.exitFullscreen()
      }
    >
      {appStatus.isAuth ? player : renderAuthLink()}
    </div>
  );
}

export { Player };
