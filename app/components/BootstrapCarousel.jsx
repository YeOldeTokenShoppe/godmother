import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { Skeleton } from "@chakra-ui/react";
import Image from "next/image";

function BootstrapCarousel({ images = [] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imageElements = images.map((image) => {
      const img = new window.Image();
      img.src = image.src;
      return img;
    });

    Promise.all(
      imageElements.map(
        (img) =>
          new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(img.src); // Pass the image src to the reject function
          })
      )
    )
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load image", err); // This will now log the src of the image that failed to load
      });
  }, [images]);

  if (loading) {
    return <Skeleton isLoaded={!loading} height="612px" />;
  }

  return (
    <Carousel interval={5000}>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            src={image.src}
            className="d-block w-100"
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
          />
          <div
            className="caption"
            style={{
              fontSize: ".75rem",
              paddingTop: ".5rem",
              textAlign: "center",
            }}
          >
            {image.alt}
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default BootstrapCarousel;
