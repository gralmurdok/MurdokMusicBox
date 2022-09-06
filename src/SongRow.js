import "./App.css";

function SongRow({ name, artist, imgUrl }) {
  const formattedName = name.length > 50 ? `${name.substring(0, 47)}...` : name;

  function renderImage() {
    let rv = null;

    if (imgUrl) {
      rv = <img src={imgUrl} className="SongRow-image" alt="logo" />;
    }

    return rv;
  }

  return (
    <div className="SongRow">
      {renderImage()}
      <div className="SongRow-song-info">
        <div className="song-name">{formattedName}</div>
        <div className="song-artist">{artist}</div>
      </div>
    </div>
  );
}

export { SongRow };
