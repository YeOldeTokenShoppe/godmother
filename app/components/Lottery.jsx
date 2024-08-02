import React, { useState, useEffect, useRef } from "react";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { initializeApp, getApps } from "firebase/app";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useActiveAccount } from "thirdweb/react";
import {
  Box,
  Button,
  Text,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Flex,
  Heading,
  SlideFade,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { db } from "../../utilities/firebaseClient";
import ConnectButton2 from "../components/ConnectButton2";
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

function Lottery() {
  const [lotteryNumber, setLotteryNumber] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const onClose = () => setIsOpen1(false);
  const cancelRef = useRef();
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const clerk = useClerk();
  const account = useActiveAccount();
  const signer = account?.address || "";
  const { isOpen, onToggle } = useDisclosure();

  const authenticateWithFirebase = async () => {
    try {
      console.log("Signing in with Clerk to Firebase...");
      const token = await getToken({ template: "integration_firebase" });
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

  const handleSaveLotteryNumber = async () => {
    if (!isLoaded || !isSignedIn) {
      console.log("User not loaded or not signed in");
      console.error(
        "User must be logged in and loaded to save the lottery number"
      );
      setIsErrorOpen(true);
      return;
    }

    if (!lotteryNumber || !isScratched) {
      console.log("No lottery number received or not sufficiently scratched");
      console.error(
        "Please scratch the ticket to reveal a lottery number before saving."
      );
      setIsErrorOpen(true);
      return;
    }

    if (!signer) {
      console.log("No wallet connected");
      console.error(
        "User must connect their wallet to save the lottery number"
      );
      setIsErrorOpen(true);
      return;
    }

    const userData = {
      lotteryNumber: lotteryNumber,
      timestamp: serverTimestamp(),
      userId: user.id,
      userName: user.username,
      userAvatar: user.imageUrl,
      walletAddress: signer,
    };

    setDoc(doc(db, "lotteryNumbers", user.id), userData)
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
      console.log("Lottery handleMessage function called");
      console.log("Received message:", event.data);
      console.log("Message origin:", event.origin);

      if (event.data.type === "randomNumber") {
        setLotteryNumber(event.data.value);
        console.log("Lottery number set to:", event.data.value);
      }
      if (event.data.type === "scratched") {
        setIsScratched(true);
        console.log("Ticket scratched:", event.data.value);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const scrollUrl = "/html/scratch.html";

  return (
    <Box py={0} mt={5}>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(2, 1fr)",
        }}
        alignItems="center"
      >
        <Box ml={0} order={{ base: 2, md: 1 }}>
          <iframe
            src={scrollUrl}
            style={{
              width: "100%",
              height: "40vh",
              border: "none",
              // transform: "scale(0.95)",
              overflow: "none",
            }}
            allowFullScreen
            title="Scroll"
          />
          <Flex
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Button bg={"goldenrod"} color="white" onClick={onToggle}>
              See Latest Winner
            </Button>

            <SlideFade in={isOpen} offsetY="2px" s>
              <Box
                // mt={9}
                // ml={"3rem"}
                // mr={"3rem"}
                border={"solid, 1px, goldenrod"}
                style={{
                  borderRadius: "5px",

                  height: "5rem",
                  width: "20rem",
                  backgroundColor: "green",
                }}
              >
                {" "}
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
                    {"Vitalik "}won {"87,000 "}tokens on{" date "} with{" "}
                    {" number "}
                  </Text>
                </Confetti>
              </Box>
            </SlideFade>
          </Flex>
        </Box>

        <Box ml={10} order={{ base: 1, md: 2 }} mx="auto">
          <h2>The Lottery</h2>
          <Text align={"center"}>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate{" "}
            <Image
              src="/pup.png"
              alt="itchy"
              height={75}
              width={75}
              style={{ float: "right", marginBottom: "10px" }}
            />
            non provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga.
          </Text>

          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" mb={-5} textAlign="center" fontSize="1.3rem">
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
                  Drawings held weekly using Chainlink Random Number Generator
                  to choose winning emoji, and then winner among participants
                  that select winning emoji. Prize is 10% of treasury.
                  Participants must hold a minimum of 1000 RL80 at both the time
                  of entry and the drawing.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Box display="flex" justifyContent="center" mt={4}>
            {isSignedIn ? (
              signer ? (
                <Button
                  className="shimmer-button"
                  onClick={handleSaveLotteryNumber}
                  disabled={!lotteryNumber || !isScratched}
                >
                  <span className="text">
                    Save Lottery
                    <br /> Number
                  </span>
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
          </Box>
        </Box>
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
              Your lottery number {lotteryNumber} was saved at{" "}
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
      <AlertDialog isOpen1={isErrorOpen} onClose={() => setIsErrorOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="#1b1724" border="2px" borderColor="#8e662b">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>
            <AlertDialogBody>
              Please scratch the ticket to reveal a lottery number before
              saving.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsErrorOpen(false)}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

export default Lottery;
