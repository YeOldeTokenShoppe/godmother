"use client";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../utilities/firebaseClient";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useActiveAccount } from "thirdweb/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Text,
  Grid,
  GridItem,
  Heading,
  SlideFade,
  useDisclosure,
} from "@chakra-ui/react";
import ConnectButton2 from "../components/ConnectButton2";
import Image from "next/image";
import Confetti from "./Confetti";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app;

// Check if any Firebase apps have already been initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the already initialized Firebase app
}

function Carnival() {
  const [isCarnivalModalOpen, setIsCarnivalModalOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const onClose = () => setIsOpen1(false);
  const cancelRef = useRef();
  const account = useActiveAccount();
  const signer = account?.address || "";
  const { getToken } = useAuth();
  const router = useRouter();
  const clerk = useClerk();
  const { isOpen, onToggle } = useDisclosure();

  const authenticateWithFirebase = async () => {
    try {
      // console.log("Signing in with Clerk to Firebase...");
      const token = await getToken({ template: "integration_firebase" });
      if (token) {
        const auth = getAuth();
        const userCredentials = await signInWithCustomToken(auth, token);
        // console.log("User signed in to Firebase:", userCredentials.user);
      } else {
        console.error("Failed to retrieve token from Clerk.");
      }
    } catch (error) {
      console.error("Error signing in with Clerk:", error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      authenticateWithFirebase();
    }
  }, [isSignedIn]);

  const handleSaveEmoji = async () => {
    if (!isLoaded || !isSignedIn) {
      // console.log("User not loaded or not signed in");
      // console.error("User must be logged in and loaded to save the emoji");
      setIsErrorOpen(true);
      return;
    }

    if (!selectedEmoji) {
      // console.log("No emoji selected");
      // console.error("Please spin the wheel to select an emoji before saving.");
      setIsErrorOpen(true);
      return;
    }

    if (!signer) {
      // console.log("No wallet connected");
      // console.error("User must connect their wallet to save the emoji");
      setIsErrorOpen(true);
      return;
    }

    const userData = {
      emoji: selectedEmoji,
      timestamp: serverTimestamp(),
      userId: user.id,
      userName: user.username,
      userAvatar: user.imageUrl,
      walletAddress: signer,
    };

    setDoc(doc(db, "emojis", user.id), userData)
      .then(() => {
        console.log("Document successfully written!");
        setIsOpen1(true);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  useEffect(() => {
    function handleMessage(event) {
      // console.log("message event data:", event.data);
      if (event.data.selectedEmoji) {
        setSelectedEmoji(event.data.selectedEmoji);
      }
    }
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <Box py="0" pb="5rem" mt="-5">
        {/* <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          // gap={5}
          alignItems="center"
          mb={10}
        >
          <GridItem
            mb="3rem"
            colSpan={{ base: 1, md: 1 }}
            order={{ base: 1, md: 1 }}
          >
            <Image src="/welcome.gif" height="380" width="650" alt="welcome" />
          </GridItem> */}

        {/* <GridItem colSpan={{ base: 1, md: 1 }} order={{ base: 2, md: 2 }}>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Heading as="h1" size="2xl">
                LucK Be{" "}
                <span style={{ fontFamily: "Oleo Bold" }}>{" RL80"}</span>!
              </Heading>
              <Text>
                {" "}
                <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span>{" "}
                hodlers, Rejoice! If you hold at least 1000 tokens, you can
                enjoy these guilt-free games, and enter to win more{" "}
                <span style={{ fontFamily: "Oleo Bold" }}>{" RL80 "}</span> in
                the weekly drawing.
              </Text>
            </Flex>
          </GridItem>
        </Grid> */}
        {/* <div className="divider1" /> */}
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          gap={5}
          alignItems="center"
        >
          <GridItem colSpan={{ base: 1, md: 1 }} order={{ base: 2, md: 2 }}>
            <iframe
              src="https://ourlady.io/html/wheel.html"
              style={{ width: "100%", height: "52vh", border: "none" }}
              allowFullScreen
              title="Wheel of Fortune"
            />
            {/* <Flex justifyContent="center" alignItems="center">
              <Button bg={"goldenrod"} color="white" onClick={onToggle}>
                See Latest Winner
              </Button>
            </Flex>
            <SlideFade in={isOpen} offsetY="2px">
              <Box
                ml={"1rem"}
                mr={"1rem"}
                border={"solid, 1px, goldenrod"}
                style={{
                  borderRadius: "5px",
                  width: "auto",
                  height: "5rem",
                  backgroundColor: "green",
                }}
              >
                <Confetti>
                  <Heading
                    mb={2}
                    mt={2}
                    fontSize={"1.3rem"}
                    align={"left"}
                    color="goldenrod"
                  >
                    Latest Winner
                  </Heading>
                  <Text fontSize={"1rem"} fontWeight={"bold"}>
                    {"Vitalik "}won {"87,000 "}tokens on{" date "} with
                    {" number "}
                    <br />
                    {"(link)"}
                  </Text>
                </Confetti>
              </Box>
            </SlideFade> */}
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 1 }} order={{ base: 1, md: 1 }}>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Heading as="h1" size="xl">
                The Wheel of Fortune
              </Heading>
              <Text>
                <Image
                  src="/Angel.png"
                  alt="itchy"
                  height={75}
                  width={75}
                  style={{
                    float: "left",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                />
                In medieval and ancient philosophy, the Wheel of Fortune, or{" "}
                <span style={{ fontStyle: "italic" }}>Rota Fortunae,</span> is a
                symbol of the capricious nature of Fate. As a crypto trader, you
                remain indifferent to market conditions, able to profit from any
                situation, good or bad.{" "}
                <Image
                  src="/Devil.png"
                  alt="itchy"
                  height={75}
                  width={75}
                  style={{
                    float: "right",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                />
                Spin the wheel to select an emoji and save your choice.
              </Text>
              <Accordion allowToggle width={"100%"}>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box
                        flex="1"
                        mb={-5}
                        textAlign="center"
                        fontSize="1.3rem"
                      >
                        Read the Deets
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={0}>
                    <Text
                      mb={15}
                      fontSize={"small"}
                      style={{ fontSize: "0.8rem", lineHeight: "1.2" }}
                    >
                      Drawings held weekly using Chainlink Random Number
                      Generator to choose winning emoji, and then winner among
                      participants that select winning emoji. Prize is 10% of
                      treasury. Participants must hold a minimum of 1000 RL80 at
                      both the time of entry and the drawing.
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              <Flex justify="center" mt={3}>
                {isSignedIn ? (
                  signer ? (
                    <Button
                      className="shimmer-button"
                      onClick={handleSaveEmoji}
                      disabled={!selectedEmoji}
                    >
                      <span className="text">Save Emoji</span>
                      <span className="shimmer"></span>
                    </Button>
                  ) : (
                    <ConnectButton2 />
                  )
                ) : (
                  <Button
                    className="shimmer-button"
                    onClick={() => {
                      clerk.openSignIn({
                        redirectUrl: `${window.location.origin}/carnival`,
                      });
                    }}
                  >
                    <span className="text">Sign In</span>
                    <span className="shimmer"></span>
                  </Button>
                )}
              </Flex>
            </Flex>
          </GridItem>
        </Grid>
        <AlertDialog
          isOpen1={isOpen1}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent bg="#1b1724" border="2px" borderColor="#8e662b">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Result Saved!
              </AlertDialogHeader>
              <AlertDialogBody>
                Your emoji {selectedEmoji} was saved at{" "}
                {new Date().toLocaleString()}.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={onClose} ref={cancelRef}>
                  Close
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog
          isOpen1={isErrorOpen}
          onClose={() => setIsErrorOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent bg="#1b1724" border="2px" borderColor="#8e662b">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Error
              </AlertDialogHeader>
              <AlertDialogBody>
                Please spin the wheel to select an emoji before saving.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsErrorOpen(false)}>
                  Close
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <div className="divider3" style={{ width: "60%" }} />
      </Box>
    </>
  );
}

export default Carnival;
