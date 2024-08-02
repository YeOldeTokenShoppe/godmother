import React, { useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionIcon,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Center,
  Button,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  Stack,
  useClipboard,
  IconButton,
  useMediaQuery,
} from "@chakra-ui/react";
import { WarningIcon, CopyIcon, CheckIcon } from "@chakra-ui/icons";
import Image from "next/image";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import styled from "styled-components";
import { chain } from "../../utilities/chain";
import { createThirdwebClient, ConnectButton } from "thirdweb";
import { ThirdwebProvider, PayEmbed } from "thirdweb/react";
import { ethereum, sepolia } from "thirdweb/chains";
import { darkTheme, MediaRenderer } from "thirdweb/react";
import "../../styles/gradientEffect.css";
import {
  createWallet,
  walletConnect,
  inAppWallet,
  base,
} from "thirdweb/wallets";
import { useConnect, useActiveAccount, useActiveWallet } from "thirdweb/react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../utilities/firebaseClient";
import { TwitterTweetEmbed } from "react-twitter-embed";
import dynamic from "next/dynamic";
import RotatingText from "./RotatingText";
import Carnival from "./Carnival";
import RotatingTweet from "./RotatingTweets";
import CustomConnectEmbed from "./CustomWallet";
import RotatingBadge from "./RotatingBadge";

const BootstrapCarousel = dynamic(() => import("./BootstrapCarousel"), {
  ssr: false,
});
const StarComponent = dynamic(() => import("./Stars"), { ssr: false });
const SafariStarComponent = dynamic(() => import("./SafariStar"), {
  ssr: false,
});
const TextMarquee = dynamic(() => import("./TextMarquee"), { ssr: false });

const isChrome = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isSafari = /^((?!chrome|android).)*safari/.test(userAgent);
  return (
    userAgent.indexOf("chrome") > -1 &&
    userAgent.indexOf("edge") === -1 &&
    !isSafari
  );
};

const StyledText = styled(Text)`
  font-family: "Roboto", sans-serif;
`;
const ListItem = styled.li`
  &::before {
    content: "✨";
    padding-right: 10px;
  }
`;

const useOutsideClick = (refs, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refs.every((ref) => ref.current && !ref.current.contains(event.target))
      ) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, handler]);
};

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
const client = createThirdwebClient({ clientId });
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
// const { connect } = useConnect();

const wallets = [
  // createWallet("com.coinbase.wallet"),
  createWallet("io.metamask"),
  // createWallet("org.uniswap"),
  // createWallet("app.phantom"),
  createWallet("walletConnect", {
    projectId: projectId,
  }),
  // inAppWallet({
  //   auth: {
  //     options: ["email"],
  //   },
  // }),
];
// const wallet = useActiveWallet();

const images = [
  {
    src: "/mary_wide.jpg",
    alt: "Your FAIR Godmother of Crypto        ",
    width: 612,
    height: 612,
    fetchpriority: "high",
  },

  {
    src: "/Lowrider.jpg",
    alt: "Our Lady provides special protection to lowriders and custom car enthusiasts",
    width: 612,
    height: 612,
  },
  {
    src: "/BabyPirate2.jpg",
    alt: "Our Lady teaches a baby pirate the value of money in this early Roman fresco",
    width: 612,
    height: 612,
  },
  {
    src: "/battle.jpg",
    alt: "Our Lady battles an evil-doer in this Byzantine-era cathedral panel",
    width: 612,
    height: 612,
  },
  {
    src: "/MaryMime.jpg",
    alt: "Before the age of memes, mimes enjoyed the special patronage of Our Lady",
    width: 612,
    height: 612,
  },
  {
    src: "/Manga.jpg",
    alt: "Our Lady has been featured in a popular manga series, with her Shiba Inu sidekick",
    width: 612,
    height: 612,
  },
  {
    src: "/4tunas.jpg",
    alt: "Our Lady shows acolytes how to find their own four tunas in order to prosper for a lifetime",
    width: 612,
    height: 612,
  },
  {
    src: "/toastSingle.jpg",
    alt: "Our Lady's image has been known to appear in unexpected places",
    width: 612,
    height: 612,
  },
];

const Hero = () => {
  const [isChromeBrowser, setIsChromeBrowser] = useState(false);
  const [isSmallScreen] = useMediaQuery("(max-width: 600px)");
  useEffect(() => {
    setIsChromeBrowser(isChrome());
  }, []);
  const account = useActiveAccount();

  const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const { hasCopied, onCopy } = useClipboard(tokenAddress);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpen = (id) => {
    setOpenPopover(id);
  };

  const handleClose = () => {
    setOpenPopover(null);
  };

  const popoverRefs = [useRef(), useRef(), useRef()];

  useOutsideClick(popoverRefs, handleClose);

  const [topBurner, setTopBurner] = useState(null);
  const [marqueeImages, setMarqueeImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "results"),
        orderBy("burnedAmount", "desc"),
        limit(1)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const result = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          src: doc.data().image.src,
          alt: doc.data().image.alt,
          message: doc.data().userMessage,
          userName: doc.data().userName,
          burnedAmount: doc.data().burnedAmount,
          isComposite: doc.data().image.isFirstImage || false,
        }))[0];
        setTopBurner(result);
      });
      return () => unsubscribe();
    };

    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const fetchMarqueeData = async () => {
      const q = query(
        collection(db, "results"),
        orderBy("createdAt", "desc"),
        limit(100)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          src: doc.data().image.src,
          alt: doc.data().image.alt,
          message: doc.data().userMessage,
          userName: doc.data().userName,
          burnedAmount: doc.data().burnedAmount,
          createdAt: doc.data().createdAt,
          isComposite: doc.data().image.isFirstImage || false,
        }));

        // Sort by burnedAmount to get top burners
        const sortedByAmount = [...results].sort(
          (a, b) => b.burnedAmount - a.burnedAmount
        );

        // Top 3 burners
        const topBurners = sortedByAmount
          .slice(0, 3)
          .map((image) => ({ ...image, type: "Top Burner" }));

        // Most recent burners (excluding top burners)
        const recentBurners = results
          .filter((r) => !topBurners.some((tb) => tb.id === r.id))
          .slice(0, 10)
          .map((image) => ({ ...image, type: "New Burner" }));

        // Combine top burners and recent burners
        const combinedImages = [...topBurners, ...recentBurners];

        setMarqueeImages(combinedImages);
      });
      return () => unsubscribe();
    };

    fetchMarqueeData().catch(console.error);
  }, []);

  return (
    <>
      <Box>
        <Flex direction={{ base: "column", sm: "row" }} align="center">
          <Box flex="1.1">
            <BootstrapCarousel images={images} />
          </Box>
          <Box flex="1" ml={0}>
            {/* <Heading as="h1" size="2rem" mb="1rem" ml={3}>
              Our Lady of Perpetual Profit
            </Heading> */}
            <div style={{ position: "absolute", display: "inline-block" }}>
              <RotatingText />
            </div>

            {/* <Box
              // mb={20}
              as="iframe"
              src="html/rotatingText.html"
              width={{ base: "100%", sm: "100%" }}
              minWidth={{
                base: "300px",
                sm: "300px",
                md: "400px",
                lg: "400px",
              }} // Setting minimum width
              height={{ base: "10rem" }}
              border="none"
              scrolling="no" // Disable scrolling
              style={{ overflow: "hidden" }} // Ensure no overflow
            /> */}
            <StyledText align={"left"} mt={"9.5rem"} ml={4}>
              Introducing <span style={{ fontFamily: "Oleo Bold" }}>RL80</span>,
              the divinely deflationary token that lets you pay homage to 𝓞𝖚𝖗
              𝕷𝖆𝖉𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑 𝕻𝖗𝖔𝖋𝖎𝖙, the icon of intercession and good
              fortune.
              <br />
              <ul
                style={{
                  listStyleType: "none",
                  marginTop: "1rem",
                }}
              >
                <li
                  style={{
                    paddingLeft: "30px", // Adjust this to change the indentation
                    textIndent: "-1px", // Should be negative of paddingLeft
                    background: `url(/goldStar2.png) no-repeat`,
                    backgroundSize: "20px 20px",
                  }}
                >
                  Burn tokens for 𝓞𝖚𝖗 𝕷𝖆𝖉𝖞 and join other luminaries in the
                  hallowed{" "}
                  <a href="#reflected glory" style={{ color: "gold" }}>
                    Hall of Flame
                  </a>
                  !
                </li>
                {/* <br /> */}
                <li
                  style={{
                    paddingLeft: "30px", // Adjust this to change the indentation
                    textIndent: "-1px", // Should be negative of paddingLeft
                    background: `url(/goldStar2.png) no-repeat`,
                    backgroundSize: "20px 20px",
                  }}
                >
                  Spin the Wheel of Fate for a chance to win more tokens!
                </li>
                <li
                  style={{
                    paddingLeft: "30px", // Adjust this to change the indentation
                    textIndent: "-1px", // Should be negative of paddingLeft
                    background: `url(/goldStar2.png) no-repeat`,
                    backgroundSize: "20px 20px",
                  }}
                >
                  Hold tokens for good luck and watch their value increase as
                  supply decreases!
                </li>
              </ul>
              <br />
            </StyledText>

            {/* <div
              style={{
                position: "absolute",
                // top: "43rem",
                right: "10rem",
                zIndex: "10",
              }}
            >
              <RotatingBadge />
            </div> */}
          </Box>
        </Flex>
      </Box>
      <StyledText
        fontSize={"xx-large"}
        color={"#ffff"}
        align={"left"}
        float={"left"}
        ml={4}
        mt={-8}
        mt={5}
        // backgroundColor={"#b16e9c"}
        border={"#8e662b solid 3px"}
        borderRadius={"10px"}
        padding={"10px"}
      >
        Renowned theologians and economists agree:{" "}
        <span style={{ fontFamily: "Oleo Bold", color: "#b16e9c" }}>
          {" RL80 "}
        </span>
        <span style={{ fontWeight: "bold", color: "#b16e9c" }}>
          {" "}
          may be the holy grail of digital tokens
        </span>
      </StyledText>
      <Box mt={0}>
        {/* <div style={{ width: "100%", align: "left" }}>
          <Text
            className="pullQuote"
            align={"left"}
            pb={"1.5rem"}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
            }}
          >
            <span
              style={{
                marginRight: "5px",
                borderRadius: "5px",
                fontFamily: "MagnificoChaos",
                fontSize: "3rem",
                color: "white",
                backgroundColor: "rgba(255, 0, 0, 0.7)",
                backdropfilter: "blur(10px)",
                width: "4rem",
                height: "4.5rem",
                display: "inline-block",
                lineHeight: "4rem",
                textAlign: "center",
                float: "left",
                borderColor: "goldenrod",
                borderStyle: "solid",
                borderWidth: "2px",
              }}
            >
              T
            </span>
            heologians and economists agree:{" "}
            <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span> is
            uniquely designed for perpetual profit, making it the holy grail of
            digital assets.
          </Text>
        </div> */}
        <Flex
          direction={{ base: "column-reverse", sm: "row-reverse" }}
          align="center"
          justifyContent="flex-end"
          gridGap={3}
          py={{ base: 0, md: 8 }}
        >
          <Box mt={10} mb={10} flex="1" order={{ base: 1, sm: 2 }}>
            <Heading as="h2" size="xl" mb={3}>
              Buy{" "}
              <span
                // className="glowingLetters"
                style={{ fontFamily: "Oleo Bold" }}
              >
                RL80
              </span>
            </Heading>
            <Text ml={5}>
              <span style={{ fontFamily: "Oleo Bold" }}>RL80</span> is now
              available on the Base blockchain. Secure some in good faith and
              chart your journey up and to the right, with 𝓞𝖚𝖗 𝕷𝖆𝖉𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑
              𝕻𝖗𝖔𝖋𝖎𝖙 as your guardian and guide. New to crypto? You can buy{" "}
              <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span>
              even if you don't already have a wallet. Just click 'How to Buy'
              below.
            </Text>
            <Accordion allowToggle width={"100%"} ml={3}>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="center" fontSize="1.3rem">
                      How to Buy
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <ul style={{ fontSize: "0.8rem", lineHeight: "1.2" }}>
                    <li>
                      Get a wallet: If you don't already have a crypto wallet,
                      such as Metamask or Coinbase, for example, you can create
                      one from here using your social media login and computer
                      passkey. You will be the only one with the walley key.
                      Neither Coinbase or the RL80 website accesses this data.
                    </li>
                    <li>
                      Get Some Base ETH: have Base ETH in your wallet to switch
                      to RL80. If you don’t have any ETH, you can buy it
                      directly from the purchasing modal on this website, or
                      transfer some from another wallet, or buy on another
                      exchange and send it to your wallet.
                    </li>
                    <li>
                      Switch Base ETH for RL80. For the first 80 days from
                      launch (July xx, 2024) there is a 3% Buy/Sell tax, so set
                      the slippage for at least 3%.
                    </li>
                  </ul>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Box
              className="gradient-background"
              ml={5}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "3px solid #333",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
              }}
            >
              <Stack>
                <Flex>
                  <Badge
                    colorScheme={"red"}
                    variant="solid"
                    style={{
                      transform: "rotate(-10deg)",
                    }}
                  >
                    VERIFY BEFORE YOU BUY!
                  </Badge>
                </Flex>
                <Text size="20px" fontWeight={"bold"} mb={0}>
                  {"  Token Address:"}
                  <br />
                </Text>
                <Text
                  size="16px"
                  wordBreak="break-all"
                  whiteSpace="normal"
                  mb={0}
                >
                  {tokenAddress}
                </Text>
                <IconButton
                  onClick={onCopy}
                  ml={2}
                  mt={0}
                  icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
                  aria-label={hasCopied ? "Copied" : "Copy"}
                  size="med"
                  bg="transparent"
                  _hover={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                  _focus={{ boxShadow: "none" }}
                />
              </Stack>
            </Box>
            {/* <Box display="flex" justifyContent="center" mt={-12}>
              <Button colorScheme="blue">Create Wallet</Button>
            </Box> */}
          </Box>
          <Box flex="1" mt={10}>
            <Center>
              <div
                className="image-effect2"
                style={{
                  marginBottom: "2.5rem",
                  marginRight: ".5rem",
                  marginLeft: ".5rem",
                  // marginTop: "3.5rem",
                }}
              >
                {!account ? (
                  <CustomConnectEmbed />
                ) : (
                  <div>
                    <Box
                      bg="#1b1724"
                      border="2px"
                      borderColor="#8e662b"
                      borderRadius={"20px"}
                      width="350px"
                      height="500px"
                    >
                      <Heading mt={5} fontSize={"25px"} textAlign="center">
                        Buy RL80
                      </Heading>
                      <Text mt={-3} fontSize="sm">
                        Enter an amount to buy, then
                        <br />
                        click 'Continue' to get a quote
                      </Text>
                      <Flex
                        justifyContent="center"
                        alignItems="center"
                        flex="1"
                      >
                        <ThirdwebProvider>
                          <PayEmbed
                            theme={darkTheme({
                              colors: {
                                accentText: "#d3b1c8",
                                accentButtonBg: "#d3b1c8",
                                accentButtonText: "#161316",
                                // borderColor: "#E9C162",
                                modalBg: "#1B1724",
                                selectedTextColor: "#fff",
                                secondaryButtonText: "#fff",
                                primaryButtonText: "#1b1724",
                                connectedButtonBgHover: "#b26e9c",
                                separatorLine: "#E9C162",
                                selectedTextBg: "#ffffff",
                                secondaryIconHoverColor: "#E9C162",
                                primaryText: "#E9C162",
                                secondaryText: "#706f78",
                                connectedButtonBg: "#d3b1c8",
                                secondaryButtonHoverBg: "#b26e9c",
                                primaryButtonBg: "#c69de1",
                                secondaryIconHoverBg: "#b26e9c",
                              },
                            })}
                            connectOptions={{
                              connectModal: {
                                size: "wide",
                                zindex: 911,

                                title: "Connect to OLOPP",
                                titleIcon: "/ourlady.svg",
                                welcomeScreen: () => {
                                  return (
                                    <div
                                      style={{
                                        height: "100%",
                                        width: "100%",
                                      }}
                                    >
                                      <MediaRenderer
                                        src="/Triumph.jpg"
                                        height="100%"
                                        width="100%"
                                      />
                                    </div>
                                  );
                                },
                                showThirdwebBranding: false,
                              },
                              wallets: wallets,

                              showAllWallets: true,
                              appMetadata: {
                                name: "𝓞𝖚𝖗 𝕷𝖆𝖉𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖗𝖕𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑 𝕻𝖗𝖔𝖋𝖎𝖙",
                                url: "https://ourlady.io",
                                logoUrl: "/ourlady.svg",
                              },
                            }}
                            client={client}
                            payOptions={{
                              prefillBuy: {
                                token: {
                                  address:
                                    "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
                                  name: "Ether",
                                  symbol: "ETH",
                                  icon: "...", // optional
                                },
                                chain: chain,
                                allowEdits: {
                                  amount: true, // allow editing buy amount
                                  token: false, // disable selecting buy token
                                  chain: false, // disable selecting buy chain
                                },
                              },
                            }}
                          />
                        </ThirdwebProvider>
                      </Flex>
                    </Box>
                  </div>
                )}
              </div>
            </Center>
          </Box>
        </Flex>
      </Box>

      <Box>
        <div style={{ width: "100%", align: "left" }}>
          <Text
            className="pullQuote"
            align={"left"}
            mb={3}
            pb={4}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              lineHeight: "1.3",
            }}
          >
            <span
              style={{
                marginRight: "5px",
                // paddingTop: ".4rem",
                // marginBottom: "1rem",
                borderRadius: "5px",
                fontFamily: "MagnificoChaos",
                fontSize: "3rem",
                color: "white",
                backgroundColor: "rgba(255, 0, 0, 0.7)",
                backdropfilter: "blur(10px)",
                width: "4rem",
                height: "4rem",
                display: "inline-block",
                lineHeight: "4rem",
                textAlign: "center",
                float: "left",
                borderColor: "goldenrod",
                borderStyle: "solid",
                borderWidth: "3px",
              }}
            >
              D
            </span>
            o you want to become a multi-millionaire? Refer your crypto-curious
            friend or abuela to buy $5 of{" "}
            <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span> - you'll
            both be entered to win 10 million{" "}
            <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span>tokens!
          </Text>
        </div>
        <Flex
          direction={{ base: "column", sm: "row" }}
          align="center"
          justifyContent="flex-end"
          gridGap={3}
          py={{ base: 0, md: 8 }}
          // mt={-9}
        >
          <Box flex="1" ml={5} order={{ base: 0, sm: 1 }}>
            <Heading as="h2" size="xl" mt={5} mb={3} lineHeight={1}>
              {/* Most{" "}
              <span
                // className="glowingLetters"
                style={{ fontFamily: "Oleo Bold" }}
              >
                V
              </span> */}
              The
              <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span>Hall of
              <span style={{ fontFamily: "Oleo Bold" }}>{" F"}</span>lame
            </Heading>

            <StyledText id="reflected glory">
              Burn small, symbolic amounts of
              <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span> tokens
              and your saintly sacrifice will be showcased here,{" "}
              <a href="/gallery" style={{ color: "goldenrod" }}>
                here
              </a>
              , and{" "}
              <a href="/gallery" style={{ color: "goldenrod" }}>
                here.{" "}
              </a>
              Plus, participants will also be entered into a weekly drawing for
              Our Lady's treasury wallet.
            </StyledText>
            {/* <div class="quote-container">
              "La vie est belle"
              <span class="translation-tooltip">Life is beautiful</span>
            </div> */}
          </Box>
          <Box mt={5}>
            <Flex direction={{ base: "column", sm: "row" }} align="center">
              <Box
                flex="1"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* {isChromeBrowser ? <StarComponent /> : <AlternativeComponent />} */}
                {topBurner &&
                  (isChromeBrowser ? (
                    <StarComponent>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {topBurner.isComposite ? (
                          <div
                            style={{
                              position: "relative",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "150px",
                              height: "150px",
                            }}
                          >
                            <Image
                              src="/frame.png"
                              alt="Frame"
                              layout="fill"
                              objectFit="contain"
                              style={{
                                position: "absolute",
                                top: "0",
                                zIndex: "200",
                              }}
                              unoptimized
                            />
                            <Avatar
                              src={topBurner.src}
                              alt={topBurner.alt}
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "calc(100% - 2.6rem)",
                                height: "auto",
                                zIndex: "-1",
                              }}
                            />
                          </div>
                        ) : (
                          <Image
                            src={topBurner.src}
                            alt={topBurner.alt}
                            width={150}
                            height={150}
                            layout="intrinsic"
                            unoptimized
                          />
                        )}
                        <Text fontSize="medium" textAlign="center">
                          {topBurner.userName}
                          <br />
                          Burned: {topBurner.burnedAmount} tokens
                          <br />
                          <Text
                            as="span"
                            fontFamily="Oleo Bold, sans-serif"
                            color="#bf975b"
                          >
                            {/* MVB */}
                          </Text>
                        </Text>
                      </div>
                    </StarComponent>
                  ) : (
                    <SafariStarComponent>
                      <div
                        style={{
                          position: "absolute",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          marginLeft: "25px",
                          martinBottom: "0",
                        }}
                      >
                        {topBurner.isComposite ? (
                          <div
                            style={{
                              position: "relative",
                              display: "flex",

                              justifyContent: "center",
                              alignItems: "center",
                              width: "150px",
                              height: "150px",
                            }}
                          >
                            <Image
                              src="/frame.png"
                              alt="Frame"
                              layout="fill"
                              objectFit="contain"
                              style={{
                                position: "absolute",
                                top: "0",
                                zIndex: "2",
                              }}
                              unoptimized
                            />
                            <Avatar
                              src={topBurner.src}
                              alt={topBurner.alt}
                              style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "calc(100% - 2.8rem)",
                                height: "auto",
                                zIndex: "1",
                              }}
                            />
                          </div>
                        ) : (
                          <Image
                            src={topBurner.src}
                            alt={topBurner.alt}
                            width={150}
                            height={150}
                            loading="lazy"
                            unoptimized
                          />
                        )}
                        <Text fontSize="small" textAlign="center">
                          {topBurner.userName}
                          <br />
                          Burned: {topBurner.burnedAmount} tokens
                          <br />
                          <span
                            style={{
                              fontFamily: "Oleo Bold",
                              color: "#8e662b",
                            }}
                          >
                            {/* MVB */}
                          </span>
                        </Text>
                      </div>
                    </SafariStarComponent>
                  ))}
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box mb={5} mt={-5}>
        <Flex direction="column" align="center" mb="4.5rem">
          {marqueeImages.length > 0 && (
            <Box className="marquee-container" position="relative">
              <TextMarquee images={marqueeImages} />
            </Box>
          )}
        </Flex>
      </Box>
      {/* <Box mt={10}>
        <Flex
          direction={{ base: "column", sm: "row" }}
          align="center"
          justifyContent="flex-end"
          gridGap={3}
          py={{ base: 0, md: 8 }}
          mb={"4rem"}
        >
          <Box flex="1" order={{ base: 2, sm: 1 }}>
            <Heading as="h2" size="xl" mb={-1}>
              The{" "}
              <span
                className="glowingLetters"
                style={{
                  fontFamily: "Oleo Bold",
                  color: "#bf975b",
                }}
              >
                Halo
              </span>{" "}
              Effect
            </Heading>
            <StyledText mt={4}>
              The average human brain produces about 12-25 watts of electrical
              activity. However, historical iconography of Our Lady suggest that
              her mental powers could have exceeded 1000 watts, manifesting in
              her famous halo. By obtaining{" "}
              <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span>{" "}
              tokens, you too can appear much brighter than average!
            </StyledText>
          </Box>

          <Box
            flex="1"
            order={{ base: 2, sm: 2 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <div>
                <Image
                  src="/brain2.png"
                  alt="Brain Image 2"
                  width={200}
                  height={200}
                  loading="lazy"
                />
                <p style={{ fontSize: "12px" }}>Average 15-watt Brain</p>
              </div>
              <div className="image-effect1">
                <Image
                  src="/brain1.png"
                  alt="Brain Image 2"
                  width={200}
                  height={250}
                  loading="lazy"
                />
                <p style={{ fontSize: "12px" }}>
                  1000-watt Brain <br />
                  (simulated)
                </p>
              </div>
            </Box>
          </Box>
        </Flex>
      </Box> */}
      <div style={{ marginTop: "3rem" }}>
        <Carnival />
      </div>

      {/* <Box
        pr={5}
        className="gradient-background"
        style={{
          display: "flex",
          flexDirection: "column",
          borderColor: "grey",
          borderStyle: "solid",
          borderWidth: "1px",
          borderRadius: "10px",
          width: "70%",
          minWidth: "20rem",
          marginRight: "15%",
          marginLeft: "15%",
          position: "relative",
          paddingTop: "40px", // Adjust padding to make space for the heading
        }}
      >
        {" "}
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={3}
          className="responsive-heading"
        >
          Our Lady Reads Your Messages
        </Heading>
        <Box
          pr={5}
          className="responsive-box"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            position: "relative",
          }}
        >
          <Box
            flex="2" // Takes up two-thirds of the width
            order={{ base: 3, md: 1 }} // Change order on smaller screens
            style={{ position: "relative" }} // Ensure the Box positions relatively
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                display: "flex",
                alignItems: "flex-end",
                left: "0",
              }}
            >
              <Image
                src="/checking2.png"
                alt="She reads her texts"
                width={isSmallScreen ? 198 : 340}
                height={isSmallScreen ? 248 : 430}
                loading="lazy"
              />
            </div>
          </Box>

          <Box
            flex="1"
            order={{ base: 2, md: 2 }}
            style={{ maxWidth: "50%", width: "100%" }} // Set a maximum width and 100% width for responsiveness
          >
            <TwitterTweetEmbed
              tweetId={"933354946111705097"}
              options={{ theme: "light" }}
              style={{ width: "100%" }}
            />
          </Box>
        </Box>
        <style jsx>{`
          .responsive-heading {
            width: 100%;
            text-align: center; // Center text on all screens
            margin-right: 0;
            margin-left: 40%;
          }
          .responsive-box {
            flex-direction: column;
            align-items: center;
          }
          @media (min-width: 768px) {
            .responsive-box {
              flex-direction: row;
              align-items: flex-end;
            }
            .responsive-heading {
              width: auto;
              text-align: left; // Align text to the left on larger screens
              margin-right: 10px;
              margin-left: 40%;
            }
          }
        `}</style>
      </Box> */}
    </>
  );
};

export default Hero;
