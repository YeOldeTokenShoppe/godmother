"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Image as ChakraImage, // Renaming to avoid conflicts
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Input,
  Text,
} from "@chakra-ui/react";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../utilities/firebaseClient";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useUser, useAuth } from "@clerk/nextjs";
import Carousel8 from "./Carousel8";

function ImageSelectionModal({
  isOpen,
  onOpen,
  onClose,
  burnedAmount,
  isResultSaved,
  setIsResultSaved,
  setSaveMessage,
  onSaveResult, // new prop
}) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [selectedImageObject, setSelectedImageObject] = useState(null);
  let avatarUrl = user ? user.imageUrl : "/default-avatar.png";
  const params = new URLSearchParams();
  params.set("height", "100px");
  params.set("width", "100px");
  params.set("quality", "100");
  params.set("fit", "crop");

  const imageUrls = [
    avatarUrl,
    "/elmo1.gif",
    "/animaSola2.png",
    "/dracarys1.gif",
    "/frank1.gif",
    "/homer1.gif",
    "/sup1.gif",
    "/louise1.gif",
    "/smoke1.gif",
    "/fever1.gif",
    "/thing11.gif",
    // "/sacred.gif",
    "/corndog1.gif",
    "/thing21.gif",
    "/sponge1.gif",
    "/mona.gif",
    "/pikachu.gif",
    "/devito1.gif",
    "/thing33.gif",
    "/thisisfine1.gif",

    "/candles.gif",
  ];

  avatarUrl = `${avatarUrl}?${params.toString()}`;

  useEffect(() => {
    if (selectedImage) {
      console.log(
        `Selected Image URL: ${selectedImage}, Avatar URL: ${avatarUrl}`
      );
      setSelectedImageObject({
        src: selectedImage,
        isFirstImage: selectedImage === avatarUrl,
      });
    }
  }, [selectedImage, avatarUrl]);

  const handleOpen = () => {
    onOpen();
  };

  const handleClose = () => {
    if (!isResultSaved) {
      setShowWarning(true);
    } else {
      onClose();
    }
  };

  const normalizeUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.origin + urlObj.pathname; // This strips out search parameters
    } catch (error) {
      console.error("Invalid URL", error);
      return url; // Fallback to the original URL in case of an error
    }
  };

  const handleSaveResult = async () => {
    const normalizedSelectedImageUrl = normalizeUrl(selectedImage);
    const normalizedAvatarUrl = normalizeUrl(avatarUrl);

    setSelectedImageObject({
      src: normalizedSelectedImageUrl,
      isFirstImage: normalizedSelectedImageUrl === normalizedAvatarUrl,
    });

    if (!selectedImage) {
      console.error("No image selected");
      return;
    }
    const image = {
      src: normalizedSelectedImageUrl,
      isFirstImage: normalizedSelectedImageUrl === normalizedAvatarUrl,
    };
    const userName = user.username;
    const userId = user.id;

    try {
      if (!user) {
        console.error("User is not signed in");
        return;
      }

      const token = await getToken({ template: "integration_firebase" });
      const auth = getAuth();
      await signInWithCustomToken(auth, token);

      await setDoc(doc(db, "results", userId), {
        userName,
        image,
        userMessage,
        createdAt: serverTimestamp(),
        burnedAmount: burnedAmount,
      });

      setIsResultSaved(true);
      setSaveMessage(
        "You've been saved!\nAnd you're entered in the next drawing"
      );
      setShowWarning(false);

      // Pass the data to the parent component
      onSaveResult({
        userName,
        image,
        userMessage,
        avatarUrl: normalizedAvatarUrl,
      }); // Include normalized avatarUrl in the payload
      onClose();
    } catch (error) {
      console.error("Error saving result: ", error);
    }
  };

  return (
    <>
      <Button onClick={handleOpen}>Join the Hall of Flame</Button>
      {showLoginError && (
        <Alert status="error">
          <AlertIcon />
          You must be logged in.
        </Alert>
      )}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay style={{ backdropFilter: "blur(10px)" }} />
        <ModalContent
          bg="#1b1724"
          border="2px"
          borderColor="#8e662b"
          height={"530px"}
          // overflowY="hidden"
        >
          <ModalHeader style={{ textAlign: "center" }} paddingTop={5}>
            <span
              style={{
                fontFamily: "UnifrakturCook",
                fontSize: "1.5rem",
                color: "#8e662b",
              }}
            >
              Than<span style={{ fontFamily: "New Rocker" }}>{"k"}</span>s,{" "}
              <span style={{ fontFamily: "New Rocker" }}>
                {user ? user.username : "Guest"}!
              </span>{" "}
              You&apos;re a Saint!
            </span>
            <br />
            <Text fontSize="sm" mt={4} mb={1}>
              Select an image to feature in the main gallery.
            </Text>
          </ModalHeader>
          {/* <ModalCloseButton /> */}

          <ModalBody>
            {showWarning && (
              <Alert
                status="warning"
                onClose={() => setShowWarning(false)}
                backgroundColor="#2b8597"
                fontSize={"small"}
                height={"50px"}
              >
                <AlertIcon height="100%" />
                {
                  "You haven't saved your result. Are you sure you want to close?"
                }
                <Button onClick={onClose} marginRight="1rem">
                  Yes
                </Button>
                <Button onClick={() => setShowWarning(false)}>No</Button>
              </Alert>
            )}
            <div style={{ overflow: "hidden" }}>
              <Carousel8
                images={imageUrls.map((url) => ({
                  url: url,

                  content: (
                    <img
                      src={url}
                      alt="Carousel item"
                      // style={{ width: "100%", height: "100%" }}
                    />
                  ),
                }))}
                avatarUrl={avatarUrl}
                onImageSelect={(image) => setSelectedImage(image.url)}
              />
            </div>
            {/* {selectedImage && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  height: "8rem",
                }}
              >
                <h4 style={{ marginTop: "1rem" }}>Selected Image:</h4>
                <Box
                  mt={4}
                  position="relative"
                  display="inline-block"
                  boxSize="6rem"
                >
                  <ChakraImage
                    src={selectedImage}
                    alt="Selected"
                    position="absolute"
                    top="40%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width="calc(100% - 1.5rem)"
                    height="auto"
                    zIndex="-1"
                  />
                  {selectedImageObject && selectedImageObject.isFirstImage && (
                    <ChakraImage
                      src="/frame.png"
                      alt="Frame"
                      position="absolute"
                      bottom="1"
                      layout="fill"
                      objectFit="contain"
                      zIndex="20"
                    />
                  )}
                </Box>
              </div>
            )} */}
            <Input
              mb={-5}
              mt={5}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              maxLength={40}
              placeholder="Add a message (40 characters max)"
            />
          </ModalBody>
          <ModalFooter
            mb={0}
            mt={-3}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              size={"sm"}
              className="shimmer-button"
              onClick={handleSaveResult}
            >
              <span className="text">Save Result</span>
              <span className="shimmer"></span>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ImageSelectionModal;
