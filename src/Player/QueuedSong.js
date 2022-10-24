function QueuedSong({ name, artist, imgUrl, requester }) {
  const formattedName = name.length > 25 ? `${name.substring(0, 22)}...` : name;

  return (
    <div className="Queued-song">
      <img src={imgUrl} className="Queued-song-image" alt="logo" />
      <div className="Queued-song-info">
        <div className="Queued-song-name">{formattedName}</div>
        <div className="Queued-song-artist">{artist}</div>
        <div className="Queued-song-requester">By {requester}</div>
      </div>
    </div>
  );
}

export { QueuedSong };
