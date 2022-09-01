import logo from './logo.png';
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
      imgUrl: '',
      requesterName: '',
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
        <div className='App-content'>
          <div>
            <div className='playing-now'>Sonando ahora:</div>
            <div className='song-requester'>by {appStatus.currentSong.requesterName}</div>
            <SongRow name={appStatus.currentSong.name} artist={appStatus.currentSong.artist} imgUrl={appStatus.currentSong.imgUrl} />
          </div>
          <div className='code-container'>
            <div className='code-text'>{appStatus.permitToken.token}</div>
          </div>
          {renderAuthLink()}
        </div>
      </header>
    </div>
  );
}

export default App;
