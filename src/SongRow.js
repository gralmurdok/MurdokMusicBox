import './App.css';

function SongRow({ name, artist }) {
  return (
    <div className="SongRow">
      <div>{name}</div>
      <div>{artist}</div>
    </div>
  );
}

export { SongRow };
