import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { SongRow } from "./SongRow";
import { QueuedSong } from "./QueuedSong";
import { WebsocketManager } from "../WebSocketService";

function Player() {
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
  const [appStatus, setAppStatus] = useState(defaultAppStatus);

  useEffect(() => {
    WebsocketManager.initialize();
    WebsocketManager.addStatusUpdateHandler((websocketMessage) => {
        const parsedData = JSON.parse(websocketMessage.data);
        setAppStatus(parsedData);
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

  return appStatus.isAuth ? (
    <div className="App container">
      <div className="current-song">{renderPlayer()}</div>
      <div className="App-header music-code">{renderHeader()}</div>
      <div className="App-content song-queue">{renderQueuedSongs()}</div>
    </div>
  ) : (
    renderAuthLink()
  );
}

export { Player };