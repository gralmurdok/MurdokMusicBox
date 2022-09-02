import logo from "./logo.png";
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
      .slice(0, 2)
      .filter((x) => !!x);

    if (sortedSongQueue.length) {
      return (
        <Fragment>
          <div className="Queue-next">En cola:</div>
          <div className="Queued-songs-list">
            {sortedSongQueue.map((song) => (
              <QueuedSong
                name={song.name}
                artist={song.artist}
                imgUrl={song.imgUrl}
              />
            ))}
          </div>
        </Fragment>
      );
    }
  }

  function renderPlayer() {
    let rv = null;
    if (appStatus.isReady) {
      rv = (
        <Fragment>
          <div>
            <div className="playing-now">Sonando ahora:</div>
            <div className="song-requester">
              by {appStatus.currentSong.requesterName}
            </div>
            <SongRow
              name={appStatus.currentSong.name}
              artist={appStatus.currentSong.artist}
              imgUrl={appStatus.currentSong.imgUrl}
            />
            {renderQueuedSongs()}
          </div>
          <div className="code-container">
            <div className="code-text">{appStatus.permitToken.token}</div>
          </div>
        </Fragment>
      );
    }
    return rv;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="App-content">
          {renderPlayer()}
          {renderAuthLink()}
        </div>
      </header>
    </div>
  );
}

export default App;
