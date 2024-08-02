import React, { useState, useEffect } from "react";
import BootstrapCarousel from "@/app/components/BootstrapCarousel";
import Hero from "@/app/components/Hero";
import Header from "@/app/components/Header.client";
import NavBar from "@/app/components/NavBar.client";
import Layout from "@/app/components/Layout";
import Carnival from "@/app/components/Carnival";
import Communion from "@/app/components/Communion";
import Racetrack from "@/app/components/Racetrack";
import Lottery from "@/app/components/Lottery";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function carnival() {
  // const [isVisible, setIsVisible] = useState(true);
  // const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // useEffect(() => {
  //   // Check if the splash screen has been shown before
  //   const splashScreenShown = localStorage.getItem("splashScreenShown");

  //   if (!splashScreenShown && !hasBeenVisible) {
  //     const timer = setTimeout(() => {
  //       setIsVisible(false);
  //       setHasBeenVisible(true);
  //       // Set the flag in localStorage
  //       localStorage.setItem("splashScreenShown", "true");
  //     }, 7000); // Increase this value to make the SplashScreen visible for a longer period

  //     return () => clearTimeout(timer);
  //   } else {
  //     // If the splash screen has been shown before, don't show it again
  //     setIsVisible(false);
  //     setHasBeenVisible(true);
  //   }
  // }, [hasBeenVisible]);
  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            height: "18rem",
            margin: "0",
            display: "block",
          }}
        >
          {/* <Header>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              {" "}
              <SignInButton />
            </SignedOut> */}
          <Header />
        </div>
        <div style={{ marginTop: "3rem" }}>
          <Carnival />
        </div>

        <div>
          <Lottery />
        </div>
        <div style={{ marginTop: "3rem" }}>
          <Racetrack />
        </div>
        <div style={{ marginTop: "3rem" }}>
          <NavBar />
        </div>
        <div style={{ marginTop: "3rem" }}>
          <Communion />
        </div>
      </Layout>
    </>
  );
}
