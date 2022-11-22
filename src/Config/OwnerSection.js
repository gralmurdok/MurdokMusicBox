const OwnerSection = ({ owner, onClickUpdateOwner, onChangeOwner }) => {
  return (
    <div className="owner_section">
      <div className="owner_title">Encargado de la fiesta</div>
      <div className="owner_form">
        <input
          type="text"
          placeholder="0999999999"
          onChange={(e) => onChangeOwner(e.target.value)}
          value={owner}
        />
        <button onClick={onClickUpdateOwner}>Guadar</button>
      </div>
    </div>
  );
};

export { OwnerSection };
