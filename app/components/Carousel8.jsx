import React, { useState } from "react";
import styles from "./Carousel8.module.css";

const Carousel8 = ({ images, onImageSelect, avatarUrl }) => {
  const [currdeg, setCurrdeg] = useState(0);
  const [selectedUrl, setSelectedUrl] = useState(null); // State to track the selected image
  const rotationStep = 360 / images.length;

  // Function to extract the base URL (ignoring query parameters)
  const getBaseUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`;
    } catch (e) {
      return url; // Return the original URL if there's an error parsing it
    }
  };

  const avatarBaseURL = getBaseUrl(avatarUrl);

  const handleSelectImage = (image) => {
    setSelectedUrl(image.url); // Update the selected URL state
    onImageSelect(image); // Propagate the selected image up if needed
  };

  const rotate = (direction) => {
    const newDegree =
      currdeg + (direction === "next" ? -rotationStep : rotationStep);
    setCurrdeg(newDegree);
  };

  return (
    <div className={styles.container8}>
      <div
        className={styles.carousel8}
        style={{ transform: `rotateY(${currdeg}deg)` }}
      >
        {images.map((image, index) => {
          const isAvatar = getBaseUrl(image.url) === avatarBaseURL;
          const isSelected = getBaseUrl(image.url) === getBaseUrl(selectedUrl); // Check if the current image is selected

          return (
            <div
              key={index}
              className={`${styles.item8} ${
                isSelected ? styles.selectedImage : ""
              }`} // Apply the selectedImage class if the image is selected
              style={{
                transform: `rotateY(${
                  index * rotationStep
                }deg) translateZ(320px)`,
              }}
              onClick={() => handleSelectImage(image)}
            >
              <img
                src={image.url}
                alt={`Slide ${index + 1}`}
                className={isAvatar ? styles.avatarImage : ""}
              />
              {isAvatar && (
                <img
                  src="/ovalFrame.png"
                  alt="Frame"
                  className={styles.frameStyle}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.next} onClick={() => rotate("next")}>
        Next
      </div>
      <div className={styles.prev} onClick={() => rotate("prev")}>
        Prev
      </div>
    </div>
  );
};

export default Carousel8;
