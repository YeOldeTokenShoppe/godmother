// "use client";
import { useState } from "react";
import {
  useActiveAccount,
  useActiveWallet,
  useAutoConnect,
  useConnect,
  useConnectModal,
  useDisconnect,
  ConnectButton,
  ConnectEmbed,
  darkTheme,
  MediaRenderer,
} from "thirdweb/react";
import { getContract, defineChain, createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { chain } from "../../utilities/chain";
import {
  Flex,
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Text,
} from "@chakra-ui/react";
import { client } from "../../utilities/constants";
import WalletButton1 from "./WalletButton1";

function CustomConnectEmbed() {
  // State to control the modal's open/close state
  const [isOpen, setIsOpen] = useState(true);

  // Function to close the modal
  const onClose = () => setIsOpen(false);
  // Check if wallet is connected
  const account = useActiveAccount();
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

  //Create an array of recommended wallets
  const recommendedWallets = [createWallet("com.coinbase.wallet")];
  //Create an array of wallets to display
  const wallets = [
    // createWallet("com.coinbase.wallet"),
    // createWallet("io.metamask"),
    // createWallet("org.uniswap"),
    // createWallet("app.phantom"),
    // createWallet("walletConnect", {
    //   projectId: projectId,
    // }),
    inAppWallet({
      auth: {
        options: ["email"],
      },
    }),
  ];
  const wallets2 = [
    createWallet("io.metamask"),
    createWallet("org.uniswap"),
    createWallet("app.phantom"),
    createWallet("walletConnect", {
      projectId: projectId,
    }),
  ];
  // Check if wallet is connected
  return (
    <Box
      bg="#1b1724"
      border="2px"
      borderColor="#8e662b"
      borderRadius={"20px"}
      width="380px"
      height="500px"
    >
      <Heading mt={5} fontSize={25} textAlign="center">
        Get Your Wallet
      </Heading>
      <Text mt={-3} mb={0} fontSize="sm">
        Create a New In-App Wallet
        <br /> or Connect Your Existing Wallet
      </Text>
      <Flex justifyContent="center" alignItems="center" flex="1">
        <ConnectEmbed
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
              // separatorLine: "#E9C162",
              selectedTextBg: "#ffffff",
              secondaryIconHoverColor: "#E9C162",
              primaryText: "#E9C162",
              secondaryText: "#706f78",
              connectedButtonBg: "#d3b1c8",
              secondaryButtonHoverBg: "#b26e9c",
              primaryButtonBg: "#c69de1",
              secondaryIconHoverBg: "#b26e9c",
              border: "none",
            },
          })}
          client={client}
          // chain={chain}
          wallets={wallets}
          showThirdwebBranding={false}
        />
      </Flex>
      <Flex justifyContent="center" alignItems="center" flex="1">
        <ConnectButton
          label={"sign-in"}
          client={client}
          // chain={CHAIN2}
          wallets={wallets2}
          connectButton={
            {
              label: "Connect Wallet",
              id: "wallet-button",
            }
            // onClick: handleSignOut,
          }
          appMetadata={{
            name: "𝓞𝖚𝖗 𝕷𝖆𝖉𝖞 𝔬𝔣 𝕻𝖊𝖗𝖕𝖊𝖙𝖚𝖆𝖑 𝕻𝖗𝖔𝖋𝖎𝖙",
            url: "https://ourlady.io",
            //   logoUrl: "https://ourlady.io/images/ourlady.svg",
          }}
          // supportedTokens={{
          //   [CHAIN]: [
          //     {
          //       address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
          //       name: "Ether",
          //       symbol: "ETH",
          //       icon: "https://ourlady.io/images/ourlady.svg",
          //     },
          //   ],
          // }}
          theme={darkTheme({
            colors: {
              accentText: "#d3b1c8",
              accentButtonBg: "#d3b1c8",
              accentButtonText: "#161316",
              borderColor: "#E9C162",
              modalBg: "#1B1724",
              selectedTextColor: "#fff",
              secondaryButtonText: "#fff",
              primaryButtonText: "#ffffff",
              connectedButtonBgHover: "#b26e9c",
              separatorLine: "#E9C162",
              selectedTextBg: "#ffffff",
              secondaryIconHoverColor: "#E9C162",
              primaryText: "#E9C162",
              secondaryText: "#706f78",
              connectedButtonBg: "#d3b1c8",
              secondaryButtonHoverBg: "#b26e9c",
              secondaryButtonBg: "#b26e9c",
              primaryButtonBg: "#b26e9c",
              secondaryIconHoverBg: "#b26e9c",
              tooltipBg: "white",
              tooltipText: "blue",
            },
          })}
          showAllWallets={true}
          connectModal={{
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
                    client={client}
                    src="/Triumph.jpg"
                    height="100%"
                    width="100%"
                  />
                </div>
              );
            },
            showThirdwebBranding: false,
          }}
          detailsButton={{
            displayBalanceToken: {
              1: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
            },

            render: () => (
              <Button
                id="wallet-button"
                // style={{
                //   position: "absolute",
                //   width: "3rem",
                //   height: "3rem",
                //   top: "6.5rem",
                //   right: "5%",
                //   zindex: "911",
                //   // visibility: isMounted ? "visible" : "hidden",
                // }}
                onClick={handleSignOut}
              >
                <span
                  style={{
                    fontSize: "2.5rem",
                    objectFit: "cover",
                    layout: "fill",
                    right: "5%",
                  }}
                >
                  Sign Out
                </span>
              </Button>
            ),
          }}
        />
      </Flex>
    </Box>
  );
}
export default CustomConnectEmbed;
