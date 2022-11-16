const ImagesSection = ({ images, onClickUpdate }) => {
  return (
    <div className="images_section">
      <button onClick={onClickUpdate}>Actualizar Imagenes</button>
      <div className="images_container">
        {images.map((image) => (
          <div className="image_miniature_container">
            <img className="image_miniature" alt="" src={image.base64Source} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { ImagesSection };
