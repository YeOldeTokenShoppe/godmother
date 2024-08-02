// RotatingBadge.js
import React, { useEffect, useRef } from "react";

const RotatingBadge = () => {
  const badgeRef = useRef(null);

  useEffect(() => {
    const elements = badgeRef.current.querySelectorAll(".badge__char");
    const step = 360 / elements.length;

    elements.forEach((elem, i) => {
      elem.style.setProperty("--char-rotate", `${i * step}deg`);
    });
  }, []);

  return (
    <div className="badge" ref={badgeRef}>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        C
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        O
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        C
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        O
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        N
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        U
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        T
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        {" "}
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        ★
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        {" "}
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        T
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        O
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        K
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        E
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        N
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        S
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        {" "}
      </span>
      <span className="badge__char" style={{ color: "#8e662b" }}>
        ★
      </span>
      {/* <span className="badge__char" style={{ color: "#8e662b" }}>
        C
      </span> */}
      <span className="badge__char" style={{ color: "#8e662b" }}>
        {" "}
      </span>
      {/* <span className="badge__char" style={{ color: "#8e662b" }}>
        ★
      </span>
      <span className="badge__char"> </span> */}
      {/* <img
        className="badge__emoji"
        src="https://cdn.shopify.com/s/files/1/1061/1924/files/Skull_Emoji_Icon.png?11214052019865124406"
        width="72"
        height="72"
        alt=""
      /> */}
      <p className="badge__emoji" style={{ fontSize: "2.6rem" }}>
        🥥
      </p>
    </div>
  );
};

export default RotatingBadge;
