import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  Button,
  Text,
  Textarea,
  Heading,
  Grid,
  GridItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  SlideFade,
  Slide,
  Collapse,
} from "@chakra-ui/react";
import Image from "next/image";
import ConnectButton2 from "../components/ConnectButton2";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../utilities/firebaseClient";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useActiveAccount } from "thirdweb/react";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
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

function getScreenDimensions() {
  if (typeof window !== "undefined") {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    let ratio;
    if (isPortrait) {
      ratio = 1;
    } else {
      ratio = 0.99;
    }
    return {
      width: window.innerWidth * ratio,
      height: window.innerHeight * ratio,
    };
  } else {
    return { width: null, height: null };
  }
}

function Racetrack() {
  const gameUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/html/Races.html"
      : "https://ourlady.io/html/Races.html";

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    function handleResize() {
      setDimensions(getScreenDimensions());
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [winner, setWinner] = useState("");
  const [showWinner, setShowWinner] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const cancelRef = useRef();
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const clerk = useClerk();
  const account = useActiveAccount();
  const signer = account?.address || "";
  const { isOpen, onToggle } = useDisclosure();

  const authenticateWithFirebase = async () => {
    try {
      const token = await getToken({
        template: "integration_firebase",
      });
      if (token) {
        const auth = getAuth();
        const userCredentials = await signInWithCustomToken(auth, token);
        console.log("User signed in to Firebase:", userCredentials.user);
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

  useEffect(() => {
    function handleMessage(event) {
      console.log("Received message:", event.data);
      console.log("Message origin:", event.origin);

      const validOrigins = [
        "http://localhost:3000",
        "https://rl80-43fed.firebaseapp.com",
        "https://ourlady.io",
      ];
      if (!validOrigins.includes(event.origin)) {
        console.log("Invalid origin:", event.origin);
        return;
      }

      if (typeof event.data === "object" && event.data.type === "raceWinner") {
        const winner = event.data.winner;
        console.log("Winner received:", winner);
        setWinner(winner);
        setIsFlashing(true);
        setShowWinner(true);

        setTimeout(() => {
          setIsFlashing(false);
          setShowSaveButton(true);
        }, 5000);
      } else {
        console.log("Unexpected message format:", event.data);
      }
    }
    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);
  const handleSaveResult = async () => {
    if (!isLoaded || !isSignedIn) {
      console.error("User must be logged in and loaded to save the result");
      setIsErrorOpen(true);
      return;
    }

    if (!winner) {
      console.error("No winner available to save");
      setIsErrorOpen(true);
      return;
    }

    if (!signer) {
      console.error("User must connect their wallet to save the result");
      setIsErrorOpen(true);
      return;
    }

    const resultData = {
      winner: winner,
      timestamp: serverTimestamp(),
      userId: user.id,
      userName: user.username,
      userAvatar: user.imageUrl,
      walletAddress: signer,
    };

    setDoc(doc(db, "raceResults", user.id), resultData)
      .then(() => {
        console.log("Document successfully written!");
        setIsOpen1(true);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  if (!dimensions.width || !dimensions.height) return null;

  return (
    <Box py="0" mt="2rem" mb={10}>
      <Grid templateColumns="1fr" gap={5}>
        <div className="divider1" />
        <GridItem>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={5}>
            <GridItem>
              <Heading as="h1" size="xl">
                The RacetracK
              </Heading>
              <Box>
                <Text as="span">
                  <Image
                    src="/horseshoe.png"
                    alt="lucky"
                    height={75}
                    width={75}
                    style={{
                      float: "left",

                      marginRight: "1rem",
                      transform: "rotate(-20deg)",
                    }}
                  />
                  Blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias.{" "}
                  {/* <Image
                    src="/horseshoe.png"
                    alt="lucky"
                    height={75}
                    width={75}
                    style={{
                      float: "right",

                      marginLeft: "1rem",
                      transform: "rotate(20deg)",
                    }}
                  /> */}
                  Your descriptive text goes here. This can be as long or as
                  short as you need it to be.
                </Text>
              </Box>
            </GridItem>
            <Flex justifyContent="center" alignItems="center">
              <GridItem>
                <Button
                  bg={"goldenrod"}
                  color="white"
                  bottom=""
                  onClick={onToggle}
                >
                  See Latest Winner
                </Button>
                <Collapse in={isOpen} animateOpacity>
                  {/* <SlideFade in={isOpen} offsetY="2px"> */}
                  <Box
                    // mt={0}
                    // ml={0}
                    // mr={"5rem"}
                    border={"solid, 1px, goldenrod"}
                    style={{
                      borderRadius: "5px",
                      width: "20rem",
                      height: "5rem",
                      backgroundColor: "green",
                      backdropfilter: "blur(10px)",
                    }}
                  >
                    <Confetti>
                      <Heading
                        mb={2}
                        mt={2}
                        fontSize={"1.3rem"}
                        align={"left"}
                        color={"goldenrod"}
                      >
                        Latest Winner
                      </Heading>
                      <Text fontSize={"1rem"} fontWeight={"bold"}>
                        {"w3ndi "}won {"88,000 "}tokens on{" date "} with{" "}
                        {" horse "}
                      </Text>
                    </Confetti>
                  </Box>
                </Collapse>
                {/* </SlideFade> */}
              </GridItem>
            </Flex>
          </Grid>
        </GridItem>
        <GridItem>
          <Box
            as="iframe"
            className="iframe-container"
            src={gameUrl}
            style={{
              width: "100%",
              height: `${dimensions.height}px`,
              border: "none",
            }}
            allowFullScreen
            title="Horse Race"
            scrolling="no"
          />
        </GridItem>
        <GridItem>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={5}
            mb={5}
          >
            <GridItem>
              <GridItem>
                <div
                  style={{
                    border: "1px solid",
                    minHeight: "100px",
                    padding: "5px",
                    position: "relative",
                    color: "grey",
                  }}
                >
                  {!winner && "Race results will be shown here"}
                  {winner && (
                    <div
                      className={isFlashing ? "flash" : ""}
                      style={{ position: "absolute", top: "5px", left: "5px" }}
                    >
                      Race finished! {winner} wins! Click "Save Result" to enter
                      sweepstakes or restart the race.
                    </div>
                  )}
                </div>
              </GridItem>
              <Flex justifyContent="center" alignItems="center" mt={3}>
                {isSignedIn ? (
                  signer ? (
                    <Button
                      className="shimmer-button"
                      onClick={handleSaveResult}
                      disabled={!winner}
                    >
                      <span className="text">Save Result</span>
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
            </GridItem>
            <GridItem>
              <Accordion ml={9} mt={0} allowToggle width={"80%"}>
                <AccordionItem>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="center" fontSize="1.3rem">
                        Read the Deets
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel>
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
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <AlertDialog
        isOpen1={isOpen1}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen1(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="#1b1724" border="2px" borderColor="#8e662b">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Result Saved!
            </AlertDialogHeader>
            <AlertDialogBody>
              Your race result {winner} was saved at{" "}
              {new Date().toLocaleString()}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsOpen1(false)} ref={cancelRef}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog isOpen1={isErrorOpen} onClose={() => setIsErrorOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="#1b1724" border="2px" borderColor="#8e662b">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>
            <AlertDialogBody>
              Please ensure you are signed in and connected to a wallet to save
              the result.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsErrorOpen(false)} ref={cancelRef}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default Racetrack;
