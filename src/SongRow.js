import './App.css';

function SongRow({ name, artist, imgUrl }) {
  return (
    <div className="SongRow">
      <img src={imgUrl} className="SongRow-image" alt="logo" />
      <div className='SongRow-song-info'>
        <div className='song-name'>{name}</div>
        <div className='song-artist'>{artist}</div>
      </div>
    </div>
  );
}

export { SongRow };
