const ImagesSection = ({ images, onClickUpdate }) => {
  return (
    <div className="images_section">
      <button onClick={onClickUpdate}>Actualizar</button>
      <div className="images_container">
        {images.map((image) => (
          <img className="image_miniature" alt="" src={image.base64Source} />
        ))}
      </div>
    </div>
  );
};

export { ImagesSection };
