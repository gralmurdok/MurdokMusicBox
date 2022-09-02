import "./App.css";

function SongRow({ name, artist, imgUrl }) {
  const formattedName = name.length > 50 ? `${name.substring(0, 47)}...` : name;

  return (
    <div className="SongRow">
      <img src={imgUrl} className="SongRow-image" alt="logo" />
      <div className="SongRow-song-info">
        <div className="song-name">{formattedName}</div>
        <div className="song-artist">{artist}</div>
      </div>
    </div>
  );
}

export { SongRow };
