// StarComponent.js
import React, { useEffect, useRef } from "react";
import "../../styles/stars2.css";

const StarComponent2 = ({ children }) => {
  const starRef = useRef(null);

  useEffect(() => {
    const elements = starRef.current.querySelectorAll(".star-badge__char");
    const step = 360 / elements.length;

    elements.forEach((elem, i) => {
      elem.style.transform = `rotate(${i * step}deg) translate(100px) rotate(${
        i * -step
      }deg)`;
    });
  }, []);

  return (
    <div className="star-badge" ref={starRef}>
      {[...Array(8)].map((_, i) => (
        <span className="star-badge__char" key={i}></span>
      ))}
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default StarComponent2;
