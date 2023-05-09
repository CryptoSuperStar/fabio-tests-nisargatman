import React, { useState } from 'react';
const ImageWithSpinner = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => setIsLoading(false);

  return (
    <div className="image-wrapper">
      {isLoading && <div className="spinner" />}
      <img 
        className='card-image'
        src={`assets/image/${src}`} 
        alt={alt} 
        onLoad={handleLoad}
      />
    </div>
  );
};

export default ImageWithSpinner;