// components/FireEffect.js
import React, { useEffect } from "react";
import styled from "styled-components";

const FireText = styled.p`
  font-size: 5rem;
  margin: auto;
  font-family: system-ui;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--fire-color-primary, gold);
  -webkit-text-stroke: 2px var(--fire-color-second, orangered);
  text-stroke: 2px var(--fire-color-second, orangered);
  text-shadow: 1px 1px 5px var(--fire-color-second, orangered);
  position: relative;
  line-height: 100%;
`;

const Bubble = styled.div`
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-image: radial-gradient(
    var(--fire-color-primary, gold) 20%,
    var(--fire-color-second, orangered)
  );
  box-sizing: border-box;
  position: absolute;
  z-index: -1;
  bottom: 25px;
  opacity: 0;
  mix-blend-mode: overlay;
  animation: floatUpFire 1s ease-in infinite;

  @keyframes floatUpFire {
    25% {
      opacity: 1;
      transform: scale(1);
      filter: blur(5px);
    }
    100% {
      bottom: 10rem;
      opacity: 0;
      transform: scale(0);
      filter: blur(10px);
    }
  }
`;

const FireEffect = ({ text }) => {
  useEffect(() => {
    const p = document.querySelector(".fire-text");
    const pWidth = p.getBoundingClientRect().width;

    const addBubbles = () => {
      for (let i = 0; i < pWidth / 3; i++) {
        const b = document.createElement("div");
        b.className = "fire-bubble";
        b.style.width = Math.random() < 0.5 ? "30px" : "50px";
        b.style.left = Math.random() * (pWidth - 50) + "px";
        b.style.bottom = 10 * Math.random() + "px";
        b.style.animationDelay = 4 * Math.random() + "s";
        p.appendChild(b);
      }
    };

    addBubbles();
  }, []);

  return <FireText className="fire-text">{text}</FireText>;
};

export default FireEffect;
