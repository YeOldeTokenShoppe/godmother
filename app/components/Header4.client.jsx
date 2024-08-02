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

function Header4() {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  useEffect(() => {
    const logoImage = new window.Image();
    logoImage.src = "/RL80_LOGO.webp";
    logoImage.onload = () => setIsLogoLoaded(true);
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
          //   mb={{ base: "200px", sm: "100px", md: "125px" }}
          style={{ position: "absolute", zIndex: 1, width: "100%" }}
        >
          <div className="section">
            <header id="header">
              <div className="menu-wrapper">
                <div className="logo-menu-container">
                  <div id="logo">
                    {/* <div
                      style={{
                        position: "absolute",
                        fontFamily: "Caesar Dressing",
                        fontSize: ".5rem",
                        bottom: "0",
                        left: "31%",
                        top: "5%",
                        color: "#debc88",
                      }}
                    >
                      {"PERPETUUM"}
                    </div> */}
                    <img
                      src="/RL80_LOGO.webp"
                      alt="Logo"
                      style={{
                        width: "75px",
                        height: "75px",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                    {/* <div
                      style={{
                        position: "absolute",
                        fontFamily: "Caesar Dressing",
                        fontSize: ".5rem",
                        bottom: "0",
                        left: "18%",
                        color: "#debc88",
                        transform: "rotate(20deg)",
                      }}
                    >
                      {"LUCRUM "}
                    </div> */}
                    {/* <div
                      style={{
                        position: "absolute",
                        fontFamily: "Caesar Dressing",
                        fontSize: ".5rem",
                        bottom: "0",
                        right: "16%",
                        color: "#debc88",
                        transform: "rotate(-20deg)",
                      }}
                    >
                      {" GAUDIUM"}
                    </div> */}
                  </div>
                </div>
              </div>
            </header>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header4;
