import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SongRow } from './SongRow';

function App() {
  const defaultAppStatus = {
    isReady: false,
    permitToken: {
      token: '',
      validUntil: 0,
    },
    currentSong: {
      name: '',
      artist: '',
    }
  };
  const refreshTimeInMiliseconds = 5000;
  const [appStatus, setAppStatus] = useState(defaultAppStatus);

  useEffect(() => {
    axios.get('/app-status').then((permit) => {
      setAppStatus(permit.data)
    }).catch(() => {
      setAppStatus(defaultAppStatus);
    });
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('/app-status').then((permit) => {
        setAppStatus(permit.data)
      }).catch(() => {
        setAppStatus(defaultAppStatus);
      });
    }, refreshTimeInMiliseconds);
    return () => clearInterval(interval);
  }, []);

  function renderAuthLink() {
    let rv = null;

    if (!appStatus.isReady) {
      rv = (<a
        className="App-link"
        href="/spotify-login"
      >
        Autorizar
      </a>)
    }

    return rv;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <span>Sonando ahora:</span>
          <SongRow name={appStatus.currentSong.name} artist={appStatus.currentSong.artist} />
        </div>
        <p>
          {appStatus.permitToken.token}
        </p>
        {renderAuthLink()}
      </header>
    </div>
  );
}

export default App;
