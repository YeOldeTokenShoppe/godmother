"use client";
import BootstrapCarousel from "../app/components/BootstrapCarousel";
import Hero from "../app/components/Hero";
import Header from "../app/components/Header.client";
import NavBar from "../app/components/NavBar.client";
import Layout from "../app/components/Layout";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Communion from "@/app/components/Communion";
import Head from "next/head";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import WordPressSlider from "@/app/components/WordPressSlider";
import TokenText from "@/app/components/TokenText";
import RotatingText from "@/app/components/RotatingText";
import RotatingBadge from "@/app/components/RotatingBadge";
import StarComponent from "@/app/components/Stars";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preload" href="/RL80_LOGO.webp" as="image" />
        <title>𝓞𝖚𝖗 𝕷𝖆𝖉𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑 𝕻𝖗𝖔𝖋𝖎𝖙</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image.svg" sizes="16x16" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Beth+Ellen&family=Bowlby+One&family=Inter:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=UnifrakturCook:wght@700&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Layout>
        <div
          style={{
            width: "100%",
            height: "18rem",
            margin: "0",
            display: "block",
          }}
        >
          <Header />
          {/* <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut> */}
        </div>
        <Hero />
        {/* <TokenText /> */}
        {/* <RotatingBadge /> */}
        {/* <StarComponent /> */}
        {/* <WordPressSlider /> */}

        <div style={{ marginTop: "3rem" }}>
          <NavBar />
          <div style={{ marginTop: "3rem" }}>
            <Communion style={{ visibility: "visible" }} />
          </div>
        </div>
      </Layout>
    </>
  );
}
