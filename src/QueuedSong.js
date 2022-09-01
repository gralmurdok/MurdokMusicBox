import './App.css';

function QueuedSong({ name, artist, imgUrl }) {
  const formattedName = name.length > 25 ? `${name.substring(0, 22)}...` : name;

  return (
    <div className="Queued-song">
      <img src={imgUrl} className="Queued-song-image" alt="logo" />
      <div className='Queued-song-info'>
        <div className='Queued-song-name'>{formattedName}</div>
        <div className='Queued-song-artist'>{artist}</div>
      </div>
    </div>
  );
}

export { QueuedSong };
