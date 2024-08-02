import React, { useState, useEffect, useRef } from "react";
import Header3 from "../app/components/Header3.client";
import Communion from "../app/components/Communion";
import RootLayout from "@/app/components/Layout";
import { Heading, Skeleton, Box, Image, Stack } from "@chakra-ui/react";
import Script from "next/script";
import Link from "next/link";
// import "../styles/sparkle.css";
export default function communion() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const recordUrl = "/html/recordPlayer.html";
  const node = useRef();
  const headerRef = useRef(null);
  useEffect(() => {
    if (!headerRef.current) {
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
        this.star.classList.add("star", "star-transparent");

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
  }, [headerRef.current]);

  return (
    // Your JSX here

    <>
      <RootLayout>
        <div
          style={{
            position: "relative",
            width: "100%",
            margin: "0",
            display: "block",
          }}
        >
          <Header3
            style={{ position: "absolute", width: "100%", top: 0, left: 0 }}
          />
        </div>

        <section className="container">
          <div className="wrap">
            <div className="pattern"></div>
          </div>
        </section>

        <div
          className="sgwrapper"
          style={{
            position: "relative",
            height: "calc(100vh - 50px)",
            // display: "flex",
            justifyContent: "center",
            // alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          <div className="item">
            <Image
              src="/Phone.png"
              alt="phone"
              style={{ maxWidth: "10rem" }}
              layout="fill"
              objectFit="contain"
              className="foreground-image"
              onLoad={() => setImageLoaded(true)}
            />
            <Link href="#">
              <Heading
                className="socials1"
                color="gold.600"
                fontSize={"1.1rem"}
                style={{
                  position: "absolute",
                  top: "20%",
                  right: "30%",
                  // transform: "rotate(-10deg)",
                }}
              >
                Dex Screener
              </Heading>
              {/* <Image
                src="/instagram_.png"
                alt="Instagram"
                width={258}
                height={257}
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  zIndex: "100",
                  position: "absolute",
                  top: "20%",
                  right: "30%",
                  color: "gold.100",
                }}
              /> */}
            </Link>
          </div>
          <div
            className="item"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {" "}
            <Image
              src="/shop.png"
              alt="gucci"
              style={{ maxWidth: "10rem", left: "30%" }}
              layout="fill"
              objectFit="contain"
              className="foreground-image"
              onLoad={() => setImageLoaded(true)}
              // style={{ right: "2rem" }}
            />
            <Link href="#">
              <Heading
                fontSize={"1.5rem"}
                color="gold.600"
                s
                className="socials"
                style={{
                  position: "absolute",
                  top: "10%",
                  right: "30%",
                }}
              >
                Instagram
              </Heading>
            </Link>
          </div>
          <div className="item">
            {" "}
            <Image
              src="/babypepe.png"
              alt="babypepe"
              style={{ maxWidth: "10rem", bottom: "2rem" }}
              layout="fill"
              objectFit="contain"
              className="foreground-image"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className="item">
            <Image
              src="/ride.png"
              alt="ride the lightning"
              style={{ maxWidth: "10rem" }}
              layout="fill"
              objectFit="contain"
              className="foreground-image"
              onLoad={() => setImageLoaded(true)}
              // style={{ left: "1rem" }}
            />

            {/* <Link href="#">
              <Heading
                className="socials"
                fontSize={"1.5rem"}
                color="gold.600"
                style={{
                  position: "absolute",
                  top: "25%",
                  right: "20%",
                  color: "#bf975b",
                  // transform: "rotate(-10deg)",
                }}
              >
                Telegram
              </Heading>
            </Link> */}
          </div>
          <div className="item">
            {" "}
            <Image
              src="/wifhat.png"
              alt="beats"
              style={{ maxWidth: "10rem", left: "30%" }}
              layout="fill"
              objectFit="contain"
              className="foreground-image"
              onLoad={() => setImageLoaded(true)}
              // style={{ left: "1rem", bottom: "0" }}
            />
          </div>
          <div className="item">
            {" "}
            <Image
              src="/bike.png"
              alt="bike with Brett"
              style={{ maxWidth: "10rem", left: "30%" }}
              layout="fill"
              objectFit="contain"
              className="foreground-image"
              onLoad={() => setImageLoaded(true)}
            />
            <Link href="#">
              <Heading
                fontSize={"1.5rem"}
                color="pink"
                className="socials1"
                style={{
                  position: "absolute",
                  top: "20%",
                  right: "30%",
                  // transform: "rotate(10deg)",
                }}
              >
                X (Twitter)
              </Heading>
            </Link>
          </div>
          <div className="item">
            <Box
              style={{ position: "relative", height: "100vh", width: "100vw" }}
            >
              <iframe
                src="/html/recordPlayer.html"
                style={{
                  position: "absolute",
                  width: "60vw",
                  height: "50vh",
                  border: "none",
                  transform: "scale(0.65) translate(-50%, -50%)",
                  top: "75%",
                  left: "40%",
                }}
                allowFullScreen
                title="Scroll"
              />
            </Box>
          </div>
        </div>
        <div></div>
        <div className="credit" style={{ marginTop: "1rem" }}>
          Contact: hello@ourlady.io &copy; Made with C8H11NO2 + C10H12N2O +
          C43H66N12O12S2 by 𝕆𝙭𝓎𝑡𝐨𝐤𝗲𝓷𝒔
        </div>
      </RootLayout>
    </>
  );
}
