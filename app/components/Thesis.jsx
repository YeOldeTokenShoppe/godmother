"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  AspectRatio,
  Skeleton,
} from "@chakra-ui/react";
// import Header from "./Header.client";
import Image from "next/image";

const scrollUrl = "/html/scroll.html";

const Thesis = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [iframeHeight, setIframeHeight] = useState("40vh");

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth < 400) {
      setIframeHeight("50vh");
    } else {
      setIframeHeight("40vh");
    }
  }, [windowWidth]);

  return (
    <>
      {/* <div style={{ width: "100%", margin: "0", display: "block" }}>
        <Header />
      </div> */}
      <Box py={{ base: 0, md: 8 }}>
        <Flex
          direction={["column-reverse", "column-reverse", "row-reverse"]}
          align="center"
          // gridGap={5}
        >
          <Box
            mt={5}
            // ml={2}
            // mr={2}
            flex={["1 0 100%", "1 0 100%", "1 0 50%"]}
            minH={{ base: "300px", md: "auto" }}
          >
            <iframe
              src={scrollUrl}
              style={{
                width: "400px",
                height: window.innerWidth < 400 ? "48vh" : "42vh",
                border: "none",
              }}
              allowFullScreen
              title="Scroll"
            />
          </Box>
          <Box
            flex={["1 0 100%", "1 0 100%", "1 0 50%"]}
            textAlign={["center", "center", "left"]}
            justifyContent="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
            pl={[0, 0, 5, 12]}
            // syle={{ marginLeft: "3rem" }}
          >
            <h1 style={{ fontSize: "3em" }}>Thesis</h1>
            <Text fontSize="lg" mb={5} ml={8}>
              A treatise in which we discuss ethics, economics, metaphysics and
              the future of the{" "}
              <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span> token.
            </Text>
            <Skeleton isLoaded={imageLoaded}>
              <Image
                src="/crier.png"
                alt="crier"
                height="250"
                width="250"
                onLoad={() => setImageLoaded(true)}
              />
            </Skeleton>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Thesis;
