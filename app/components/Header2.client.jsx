"use client";
import React, { useState, useEffect, useRef } from "react";
import { slide as Menu } from "react-burger-menu";
import Link from "next/link";
import Image from "next/image";
import { Container, Button, Tooltip } from "@chakra-ui/react";
import { useUser, useClerk } from "@clerk/nextjs";
import { sepolia } from "thirdweb/chains";
import WalletButton1 from "./WalletButton1";
import { useActiveAccount } from "thirdweb/react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { useRouter } from "next/router";
import Head from "next/head";

function Header2() {
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

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      if (window.innerWidth <= 768) {
        setMenuWidth("100%");
      } else {
        setMenuWidth("30%");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const logoImage = new window.Image();
    logoImage.src = "/RL80_LOGO.png";
    logoImage.onload = () => setIsLogoLoaded(true);
  }, []);
  const matrixRef = useRef(null);

  useEffect(() => {
    let p = matrixRef.current;

    function addBubbles() {
      for (var i = 0; i < 50; i++) {
        // change 25 to 50
        let b = document.createElement("p");
        b.className = "bubble";
        b.innerText = Math.floor(Math.random() * 10);
        b.style.left = i * 2 + 1 + "%"; // adjust the left position to accommodate more bubbles
        b.style.animationDelay = 4 * Math.random() + "s";
        p.appendChild(b);
      }
    }
    addBubbles();
  }, []);

  return (
    <>
      <Head>
        <link rel="preload" href="/RL80_LOGO.webp" as="image" />
      </Head>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Container
          className="header"
          maxW={"1200px"}
          mb={{ base: "200px", sm: "100px", md: "125px" }}
          style={{ position: "relative" }}
        >
          <div className="header matrix-container" ref={matrixRef}>
            <p
              className="matrix-container"
              ref={matrixRef}
              style={{
                height: "250px",
                width: "120%",
              }}
            ></p>
          </div>

          <div className="section">
            <header id="header">
              <div className="menu-icon" onClick={toggleMenu}></div>
              <div className="menu-wrapper">
                <div className="logo-menu-container">
                  <div
                    id="logo"
                    style={
                      {
                        // borderLeft: "thick solid black",
                        // borderRight: "thick solid black",
                      }
                    }
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
                      Home
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
                  </Menu>
                </div>
                <WalletButton1 />

                {isSignedIn ? (
                  <button
                    id="sign-out-button"
                    onClick={() => signOut()}
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
                      // src={user.imageUrl || "/default-avatar.png"
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
                      onClick={() => clerk.openSignIn()}
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

export default Header2;
