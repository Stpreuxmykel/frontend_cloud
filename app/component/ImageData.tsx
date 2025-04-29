// components/ProfileImage.tsx

import React from "react";

// Define the interface for the props
interface ImageProps {
  src: string;
  alt: string;
  className:string;
  key?:number;
}

// Define the functional component using React.FC and the ImageProps type
const ImageData: React.FC<ImageProps> = ({ src, alt, className, key }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      key={key} 
    />
  );
};

export default ImageData;
