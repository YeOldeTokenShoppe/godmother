// pages/thesis.js
import Thesis from "../app/components/Thesis";
import Header from "../app/components/Header.client";
import NavBar from "../app/components/NavBar.client";
import Layout from "../app/components/Layout";
import Communion from "../app/components/Communion";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function thesis() {
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
        <Thesis />

        <div style={{ paddingTop: "5rem" }}>
          <NavBar />
        </div>
      </Layout>
      <div>
        <Communion />
      </div>
    </>
  );
}
