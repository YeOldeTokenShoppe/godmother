// Import styles
import React, { useState, useEffect } from "react";

import WordPressSlider from "@/app/components/WordPressSlider";
import Layout from "@/app/components/Layout";
import TokenText from "@/app/components/TokenText";

export default function Sample() {
  // Component
  return (
    <>
      <WordPressSlider />
      {/* <div
        // className="flex-text"
        style={{
          display: "flex",
          height: "5vh",
          width: "auto",
          position: "absolute",
          bottom: "5rem",
        }}
      >
        <TokenText />
      </div> */}
    </>
  );
}
