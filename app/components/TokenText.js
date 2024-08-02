// FireEffect.js
import React, { useEffect, useRef } from "react";

const TokenText = () => {
  const fireRef = useRef(null);

  useEffect(() => {
    const obj = fireRef.current;
    const fps = 200;
    const letters = obj.innerHTML.split("");
    obj.innerHTML = ""; // Clear the original content
    letters.forEach((letter) => {
      const span = document.createElement("span");
      span.innerText = letter;
      obj.appendChild(span);
    });

    const animateLetters = obj.querySelectorAll("span");
    const intervalId = setInterval(() => {
      animateLetters.forEach((letter) => {
        letter.style.fontSize = `${80 + Math.floor(Math.random() * 50)}px`;
      });
    }, fps);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <p ref={fireRef} className="unique-fire-effect">
      RL80
    </p>
  );
};

export default TokenText;
