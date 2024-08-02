"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Box,
  Image as ChakraImage,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { useDisconnect } from "thirdweb/react";
import { ethers } from "ethers";
import { useActiveAccount, TransactionButton } from "thirdweb/react";
import { ThirdwebProvider } from "../../utilities/thirdweb";
import ConnectButton2 from "./ConnectButton2";
import { burn } from "thirdweb/extensions/erc20";
import { CONTRACT } from "../../utilities/constants";
import ImageSelectionModal from "./ImageSelectionModal";
import TokenText from "./TokenText";

const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.origin + urlObj.pathname; // This will ignore search and hash
  } catch (error) {
    console.error("Error normalizing URL:", error);
    return url; // Fallback to the original URL if there's an error
  }
};

function BurnModal({ isOpen, onClose, onTransactionComplete }) {
  const account = useActiveAccount();
  const signer = account?.address || "";
  const { disconnect } = useDisconnect();
  const [isFlameVisible, setIsFlameVisible] = useState(false);
  const [value, setValue] = useState(1000);
  const show = isOpen;
  const [transactionStatus, setTransactionStatus] = useState("");
  const [transactionCompleted, setTransactionCompleted] = useState(false);
  const [isImageSelectionModalOpen, setIsImageSelectionModalOpen] =
    useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [burnedAmount, setBurnedAmount] = useState(0);
  const [isResultSaved, setIsResultSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userConfirmed, setUserConfirmed] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const cancelRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  const handleOpenImageSelectionModal = () => {
    setIsImageSelectionModalOpen(true);
  };

  const handleCloseImageSelectionModal = () => {
    setIsImageSelectionModalOpen(false);
  };

  const confirmTransaction = () => {
    setIsAlertDialogOpen(true);
  };

  const handleSaveResult = ({ userName, image, userMessage }) => {
    console.log(`Saving Result - Image URL: ${image.src}`);
    setUserName(userName);
    setSelectedImage(image); // Assuming `image` has an `isFirstImage` property
    setUserMessage(userMessage);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md" motionPreset="2">
        <ModalOverlay style={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg="#1b1724"
          borderRadius="lg"
          border="2px"
          borderColor="#8e662b"
        >
          <ModalHeader
            fontSize="2.3rem"
            mb={3}
            mt={4}
            fontFamily={"UnifrakturCook"}
            color="#8e662b"
          >
            {transactionStatus === "completed"
              ? "Transaction Complete!"
              : "Burn an Offering?"}
          </ModalHeader>
          <Text align={"left"} ml={3}>
            {transactionStatus === "completed"
              ? "Your transaction has been completed successfully."
              : "Some explanatory text here about how the process works."}
          </Text>
          <ModalBody
            className={
              transactionStatus === "completed" && isResultSaved
                ? ""
                : isFlameVisible
                ? "gradient-background"
                : ""
            }
          >
            {transactionStatus === "pending" && (
              <Flex
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <TokenText />
                <p className="blink" style={{ fontSize: "20px" }}>
                  Please wait - transaction pending...
                </p>
                <Spinner size="xl" />
              </Flex>
            )}
            {(transactionStatus !== "completed" || !isResultSaved) && (
              <div className="holder">
                <div className="candle">
                  <div className="thread"></div>
                  {isFlameVisible && (
                    <>
                      <div className="blinking-glow"></div>
                      <div className="glow"></div>
                      <div className="flame"></div>
                    </>
                  )}
                </div>
              </div>
            )}
            {transactionStatus === "completed" && isResultSaved && (
              <div style={{ textAlign: "center" }}>
                <p>{`Thanks, ${userName}!`}</p>
                <Box
                  position="relative"
                  display="inline-block"
                  // width="100%"
                  // height="auto"
                  boxSize="9rem"
                  mb="5"
                >
                  {selectedImage.isFirstImage && (
                    <ChakraImage
                      src="/frame.png"
                      alt="Frame"
                      position="absolute"
                      top="0"
                      // layout="fill"
                      objectFit="contain"
                      zIndex="200"
                      unoptimized
                    />
                  )}
                  <Box
                    as="img"
                    src={selectedImage.src}
                    alt="Selected"
                    position="absolute"
                    top="58%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    width="calc(100% - 2.5rem)"
                    height="auto"
                    zIndex="-1"
                  />
                </Box>
                <p>{userMessage}</p>
                <p>{saveMessage}</p>
              </div>
            )}

            {transactionStatus !== "completed" && !isResultSaved && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: "20px",
                }}
              >
                <p>Choose token amount to burn.</p>
                <NumberInput
                  size="lg"
                  maxW={32}
                  defaultValue={1000}
                  min={0}
                  step={1000}
                  value={value}
                  onChange={(valueAsString, valueAsNumber) =>
                    setValue(valueAsNumber)
                  }
                >
                  <NumberInputField color="white" />
                  <NumberInputStepper>
                    <NumberIncrementStepper color="white" />
                    <NumberDecrementStepper color="white" />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            {!account ? (
              <ConnectButton2 />
            ) : transactionStatus !== "completed" && !isResultSaved ? (
              <ThirdwebProvider>
                <TransactionButton
                  className="burnButton"
                  transaction={() =>
                    burn({
                      contract: CONTRACT,
                      amount: ethers.utils.parseUnits(
                        value.toString(),
                        "ether"
                      ),
                    })
                  }
                  onTransactionConfirmed={(receipt) => {
                    setIsFlameVisible(true);
                    setTransactionStatus("completed");
                    setTransactionCompleted(true);
                    setBurnedAmount(value);
                    onTransactionComplete();
                  }}
                >
                  {transactionStatus === "pending"
                    ? "Transaction Pending..."
                    : "Burn Tokens"}
                  <span className="shimmer"></span>
                </TransactionButton>
              </ThirdwebProvider>
            ) : transactionCompleted && !isResultSaved ? (
              <Button
                className="shimmer-button burnButton pulse"
                onClick={handleOpenImageSelectionModal}
              >
                <span className="text">
                  Join the <br />
                  Hall of Flame
                </span>
                <span className="shimmer"></span>
              </Button>
            ) : (
              <Button mt={0} className="shimmer-button" onClick={handleClose}>
                Return to Gallery
                <span className="shimmer"></span>
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
        <ImageSelectionModal
          isOpen={isImageSelectionModalOpen}
          onOpen={handleOpenImageSelectionModal}
          onClose={handleCloseImageSelectionModal}
          setSelectedImage={setSelectedImage}
          burnedAmount={burnedAmount}
          setIsResultSaved={setIsResultSaved}
          setSaveMessage={setSaveMessage}
          onSaveResult={handleSaveResult} // Pass the new prop
        />
      </Modal>
    </>
  );
}

export default BurnModal;
