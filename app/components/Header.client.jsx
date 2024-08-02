import React, { useState, useEffect, useRef } from "react";
import { slide as Menu } from "react-burger-menu";
import Link from "next/link";
import Image from "next/image";
import { Container, Button, Tooltip } from "@chakra-ui/react";
import { useUser, useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { sepolia } from "thirdweb/chains";
import WalletButton1 from "./WalletButton1";
import { useActiveAccount } from "thirdweb/react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";

function Header() {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const { user, isSignedIn } = useUser();
  const clerk = useClerk(); // Use useClerk to access signOut
  const [menuOpen, setMenuOpen] = useState(false);
  const [emoji, setEmoji] = useState("😇");
  const account = useActiveAccount();
  const closeMenu = () => setMenuOpen(false);
  const node = useRef();
  const router = useRouter();
  const currentUrl = router.asPath;
  const toggleMenu = (event) => {
    event.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Function to handle outside click
    const handleClickOutside = (e) => {
      if (node.current.contains(e.target)) {
        // Inside click
        return;
      }
      // Outside click
      closeMenu();
    };

    // Check if document is defined
    if (typeof document !== "undefined") {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [node]);

  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setEmoji((prevEmoji) => (prevEmoji === "😇" ? "😈" : "😇"));
    }, 3000); // Change emoji every 3 seconds

    return () => clearInterval(emojiInterval);
  }, []);

  const signOut = () => {
    clerk.signOut().then(() => {
      router.push(currentUrl); // Redirect to the current URL after sign-out
    });
  };

  const handleSignInClick = () => {
    sessionStorage.setItem("redirectUrl", currentUrl);
    clerk.openSignIn({
      redirectUrl: currentUrl, // Redirect to the current URL after sign-in
    });
  };

  useEffect(() => {
    const redirectUrl = sessionStorage.getItem("redirectUrl");
    if (isSignedIn && redirectUrl) {
      sessionStorage.removeItem("redirectUrl");
      router.push(redirectUrl);
    }
  }, [isSignedIn, router]);

  const [menuWidth, setMenuWidth] = useState("30%");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 760) {
        setMenuWidth("100%");
      } else {
        setMenuWidth("35%");
      }
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Call handleResize once to set the initial menu width
    handleResize();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const logoImage = new window.Image();
    logoImage.src = "/RL80_LOGO.webp";
    logoImage.onload = () => setIsLogoLoaded(true);
  }, []);

  const headerRef = useRef(null);
  useEffect(() => {
    if (!headerRef.current || window.innerWidth <= 550) {
      return;
    }

    const sparkle = headerRef.current;

    var current_star_count = 0;

    const MAX_STARS = 60;
    const STAR_INTERVAL = 16;

    const MAX_STAR_LIFE = 3;
    const MIN_STAR_LIFE = 1;

    const MAX_STAR_SIZE = 40;
    const MIN_STAR_SIZE = 20;

    const MIN_STAR_TRAVEL_X = 100;
    const MIN_STAR_TRAVEL_Y = 100;

    const Star = class {
      constructor() {
        this.size = this.random(MAX_STAR_SIZE, MIN_STAR_SIZE);

        this.x = this.random(
          sparkle.offsetWidth * 0.75,
          sparkle.offsetWidth * 0.25
        );
        this.y = sparkle.offsetHeight / 2 - this.size / 2;

        this.x_dir = this.randomMinus();
        this.y_dir = this.randomMinus();

        this.x_max_travel =
          this.x_dir === -1 ? this.x : sparkle.offsetWidth - this.x - this.size;
        this.y_max_travel = sparkle.offsetHeight / 2 - this.size;

        this.x_travel_dist = this.random(this.x_max_travel, MIN_STAR_TRAVEL_X);
        this.y_travel_dist = this.random(this.y_max_travel, MIN_STAR_TRAVEL_Y);

        this.x_end = this.x + this.x_travel_dist * this.x_dir;
        this.y_end = this.y + this.y_travel_dist * this.y_dir;

        this.life = this.random(MAX_STAR_LIFE, MIN_STAR_LIFE);

        this.star = document.createElement("div");
        this.star.classList.add("star");

        this.star.style.setProperty("--start-left", this.x + "px");
        this.star.style.setProperty("--start-top", this.y + "px");

        this.star.style.setProperty("--end-left", this.x_end + "px");
        this.star.style.setProperty("--end-top", this.y_end + "px");

        this.star.style.setProperty("--star-life", this.life + "s");
        this.star.style.setProperty("--star-life-num", this.life);

        this.star.style.setProperty("--star-size", this.size + "px");
        this.star.style.setProperty("--star-color", this.randomRainbowColor());
      }

      draw() {
        sparkle.appendChild(this.star);
      }

      pop() {
        sparkle.removeChild(this.star);
      }

      random(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      randomRainbowColor() {
        return "hsla(" + this.random(360, 0) + ", 100%, 50%, 1)";
      }

      randomMinus() {
        return Math.random() > 0.5 ? 1 : -1;
      }
    };

    setInterval(() => {
      if (current_star_count >= MAX_STARS) {
        return;
      }

      current_star_count++;

      var newStar = new Star();

      newStar.draw();

      setTimeout(() => {
        current_star_count--;

        newStar.pop();
      }, newStar.life * 1000);
    }, STAR_INTERVAL);
  }, []);

  return (
    <>
      <Head>
        <link rel="preload" href="/RL80_LOGO.webp" as="image" />
      </Head>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Container
          className="header sparkle"
          ref={headerRef}
          maxW={"1200px"}
          mb={{ base: "200px", sm: "100px", md: "125px" }}
          style={{ position: "relative" }}
        >
          <div className="section">
            <header id="header">
              <div className="menu-icon" onClick={toggleMenu}></div>
              <div className="menu-wrapper">
                <div className="logo-menu-container">
                  <div
                    id="logo"
                    // style={{
                    //   borderLeft: "thick solid black",
                    //   borderRight: "thick solid black",
                    // }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        fontFamily: "Caesar Dressing",
                        fontSize: ".8rem",
                        bottom: "0",
                        left: "31%",
                        top: "5%",
                        color: "#debc88",
                      }}
                    >
                      {"PERPETUUM"}
                    </div>
                    <Image
                      src="/RL80_LOGO.webp"
                      height="180"
                      width="180"
                      alt="Logo"
                      priority
                      fetchpriority="high"
                      priority="high"
                    />
                    <div
                      style={{
                        position: "absolute",
                        fontFamily: "Caesar Dressing",
                        fontSize: ".8rem",
                        bottom: "0",
                        left: "18%",
                        color: "#debc88",
                        transform: "rotate(20deg)",
                      }}
                    >
                      {"LUCRUM "}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        fontFamily: "Caesar Dressing",
                        fontSize: ".8rem",
                        bottom: "0",
                        right: "16%",
                        color: "#debc88",
                        transform: "rotate(-20deg)",
                      }}
                    >
                      {" GAUDIUM"}
                    </div>
                  </div>
                </div>
                <div ref={node}>
                  <Menu
                    isOpen={menuOpen}
                    onStateChange={({ isOpen }) => setMenuOpen(isOpen)}
                    width={menuWidth}
                  >
                    <Link href="./" className="menu-item" onClick={closeMenu}>
                      <span
                        // className="glowingLetters"
                        style={{ fontFamily: "Oleo Bold" }}
                      ></span>
                      Home
                      <span
                        // className="glowingLetters"
                        style={{ fontFamily: "Oleo Bold" }}
                      ></span>
                    </Link>
                    <Link
                      href="./thesis"
                      className="menu-item"
                      s
                      onClick={closeMenu}
                    >
                      Thesis
                    </Link>
                    <Link
                      href="./numerology"
                      className="menu-item"
                      onClick={closeMenu}
                    >
                      Numerology
                    </Link>
                    <Link
                      href="./gallery"
                      className="menu-item"
                      onClick={closeMenu}
                    >
                      Bless us,{" "}
                      <span style={{ fontFamily: "Oleo Bold" }}>{"RL80 "}</span>
                    </Link>
                    {/* <Link
                      href="./carnival"
                      className="menu-item"
                      onClick={closeMenu}
                    >
                      L80 LucK
                    </Link> */}
                    <Link
                      href="./communion"
                      className="menu-item"
                      onClick={closeMenu}
                    >
                      Communion
                    </Link>
                    {/* <Link
                      href="./communion"
                      className="menu-item"
                      onClick={closeMenu}
                    >
                      Virgin Records
                    </Link> */}
                  </Menu>
                </div>

                <WalletButton1 />

                {isSignedIn ? (
                  <button
                    id="sign-out-button"
                    onClick={signOut}
                    style={{
                      position: "absolute",
                      width: "3rem",
                      height: "3rem",
                      top: "3rem",
                      right: "5%",
                      minWidth: "3rem",
                      zIndex: "911",
                    }}
                  >
                    <Image
                      id="user-avatar"
                      src={user.imageUrl}
                      // src={user.imageUrl || "🥸"}
                      alt="User Avatar"
                      layout="fill"
                      objectFit="cover"
                    />
                  </button>
                ) : (
                  <Tooltip
                    hasArrow
                    label="Sign-in!"
                    bg="green.600"
                    closeDelay={500}
                    placement="left-start"
                  >
                    <button
                      id="sign-in-button"
                      onClick={handleSignInClick}
                      style={{
                        top: "3rem",
                        right: "5%",
                        position: "absolute",
                        width: "3rem",
                        minWidth: "3rem",
                        height: "3rem",
                        zIndex: "911",
                      }}
                    >
                      <span style={{ fontSize: "2.5rem" }}>{emoji}</span>
                    </button>
                  </Tooltip>
                )}
              </div>
            </header>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;
