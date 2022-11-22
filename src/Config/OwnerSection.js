const OwnerSection = ({ partyCode, onClickUpdatePartyCode }) => {
  return (
    <div className="party_code_section">
      <div className="party_code">Codigo de evento: {!partyCode ? <button onClick={onClickUpdatePartyCode}>Generar</button> : partyCode }</div>
    </div>
  );
};

export { OwnerSection };
