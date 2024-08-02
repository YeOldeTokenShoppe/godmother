// pages/gallery.js
import BurnGallery from "../app/components/BurnGallery";
import Header from "../app/components/Header.client";
import NavBar from "../app/components/NavBar.client";
import BurnModal from "../app/components/BurnModal";
import Layout from "../app/components/Layout";
import Communion from "../app/components/Communion";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "../styles/candle.css";

export default function gallery() {
  return (
    <>
      <Layout>
        <div
          style={{
            width: "100%",
            height: "18rem",
            margin: "0",
            display: "block",
          }}
        >
          <Header>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              {" "}
              <SignInButton />
            </SignedOut>
          </Header>
        </div>
        <BurnGallery />
        <BurnModal />

        <div style={{ marginTop: "2rem" }}>
          <NavBar />
        </div>
      </Layout>
      <div style={{ marginTop: "3rem" }}>
        <Communion />
      </div>
    </>
  );
}
