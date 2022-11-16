const OwnerSection = ({ owner, onClickUpdateOwner, onChangeOwner }) => {
  return (
    <div className="owner_section">
      <div>Encargado de la fiesta</div>
      <input
        type="text"
        placeholder="0999999999"
        onChange={(e) => onChangeOwner(e.target.value)}
        value={owner}
      />
      <button onClick={onClickUpdateOwner}>Guadar</button>
    </div>
  );
};

export { OwnerSection };
