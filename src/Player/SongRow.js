function SongRow({ name, artist, imgUrl, requester }) {
  const formattedName = name.length > 50 ? `${name.substring(0, 47)}...` : name;

  function renderImage() {
    let rv = null;

    if (imgUrl) {
      rv = (
        <div className="SongRow-image-container">
          <img src={imgUrl} className="SongRow-image" alt="logo" />
        </div>
      );
    }

    return rv;
  }

  return (
    <div className="SongRow">
      {renderImage()}
      <div className="SongRow-song-info">
        <div className="song-name">{formattedName}</div>
        <div className="song-artist">{artist}</div>
        <div className="song-requester">By {requester}</div>
      </div>
    </div>
  );
}

export { SongRow };
