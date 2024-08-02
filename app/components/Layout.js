import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import "../../styles/index.css";
import { Providers } from "../../utilities/providers";
import { ThirdwebProvider } from "../../utilities/thirdweb";
import "../../styles/sparkle.css";
import "../../styles/matrix.css";
import "../../styles/shimmerbutton.css";
import "../../styles/fireButton.css";
// import "../../styles/vegas.css";
import "../../styles/candle.css";
import "../../styles/wallpaper.css";

import "../../styles/sg.css";
// import "../../styles/magic.css";
// import "normalize.css/normalize.css";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { ChakraProvider } from "@chakra-ui/react";
import { createWallet, walletConnect } from "thirdweb/wallets";
import { extendTheme } from "@chakra-ui/react";
import Communion from "./Communion";
import Header from "./Header.client";
import Head from "next/head";
import "../../styles/FireEffect.css";

export const metadata = {
  title: "𝓞𝖚𝖗 𝕷𝖆𝖉𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑 𝕻𝖗𝖔𝖋𝖎𝖙",
  description: "A token to believe in.",
  author: "",
  viewport: "width=device-width, initial-scale=1",
  charset: "utf-8",
  "og:title": "𝓞𝖚𝖗 𝕷𝖆𝖣𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑 𝕻𝖗𝖔𝖋𝖎𝖙",
  "og:description": "A token to believe in.",
  "og:image": "/favicon.ico",
};

<link rel="icon" type="image.svg" sizes="16x16" href="/favicon.ico" />;
const inter = Inter({ subsets: ["latin"] });

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "#1b1724", // replace with your color
        color: "white", // replace with your desired text color
      },
      components: {
        Radio: {
          baseStyle: {
            control: {
              _checked: {
                bg: "blue.500",
                borderColor: "blue.500",
                _hover: {
                  bg: "blue.600",
                },
                _before: {
                  content: `""`,
                  display: "inline-block",
                  position: "relative",
                  width: "50%",
                  height: "50%",
                  borderRadius: "50%",
                  background: "white",
                },
              },
            },
          },
        },
      },
    },
  },
});

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const wallets = [
  createWallet("io.metamask"),
  createWallet("org.uniswap"),
  createWallet("walletConnect", {
    projectId: projectId,
  }),
];
export default function RootLayout({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {" "}
      <Head>
        <title>𝓞𝖚𝖗 𝕷𝖆𝖉𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑 𝕻𝖗𝖔𝖋𝖎𝖙</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" href="/RL80_LOGO.png" as="image" />
        <link rel="preload" as="image" href="/mary_wide.jpg"></link>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossorigin="anonymous"
        ></link>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Bowlby+One+SC&family=Caesar+Dressing&family=New+Rocker&family=UnifrakturCook:wght@700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <ClerkProvider
        appearance={{
          baseTheme: shadesOfPurple,
        }}
      >
        <ChakraProvider theme={theme}>
          <ThirdwebProvider>
            <Providers>
              {/* <Header /> */}
              {/* <Header>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  {" "}
                  <SignInButton />
                </SignedOut>
              </Header> */}
              <div className={`app-container ${inter.className}`}>
                {children}
              </div>
            </Providers>
          </ThirdwebProvider>
        </ChakraProvider>
      </ClerkProvider>
    </>
  );
}
