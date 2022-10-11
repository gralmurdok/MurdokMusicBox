import "./App.css";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { SongRow } from "./SongRow";
import { QueuedSong } from "./QueuedSong";

function App() {
  const defaultAppStatus = {
    isReady: false,
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
    songQueue: {},
    wifiKey: "",
  };
  const refreshTimeInMiliseconds = 3000;
  const [appStatus, setAppStatus] = useState(defaultAppStatus);

  useEffect(() => {
    axios
      .get("/internal-update")
      .then((permit) => {
        setAppStatus(permit.data);
      })
      .catch(() => {
        setAppStatus(defaultAppStatus);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get("/app-status")
        .then((permit) => {
          setAppStatus(permit.data);
        })
        .catch(() => {
          // do nothing
        });
    }, refreshTimeInMiliseconds);
    return () => clearInterval(interval);
  }, []);

  function renderAuthLink() {
    let rv = null;

    if (!appStatus.isReady) {
      rv = (
        <a className="App-link" href="/spotify-login">
          Autorizar
        </a>
      );
    }

    return rv;
  }

  function renderQueuedSongs() {
    const sortedSongQueue = Object.keys(appStatus.songQueue)
      .map((trackId) => appStatus.songQueue[trackId])
      .sort((a, b) => a.requestedAt - b.requestedAt)
      .slice(0, 5)
      .filter((x) => !!x);

    let rv = null;

    if (sortedSongQueue.length) {
      rv = (
        <div className="Queued-songs-list">
          {sortedSongQueue.map((song) => (
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
    let rv = null;
    if (appStatus.isReady) {
      rv = (
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
    return rv;
  }

  function renderHeader() {
    let rv = null;
    if (appStatus.isReady) {
      rv = (
        <Fragment>
          <div className="code-container">
            <div className="code-text">WS:0985467110</div>
          </div>
        </Fragment>
      );
    }

    return rv;
  }

  return (
    <div className="App container">
      <div className="current-song">{renderPlayer()}</div>
      <div className="App-header music-code">{renderHeader()}</div>
      <div className="App-content song-queue">
        {renderAuthLink()}
        {renderQueuedSongs()}
      </div>
    </div>
  );
}

export default App;
