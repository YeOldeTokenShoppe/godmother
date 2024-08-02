// pages/numerology.js
import Numerology from "../app/components/Numerology";
import Header2 from "../app/components/Header2.client";
import NavBar from "../app/components/NavBar.client";
import Layout from "../app/components/Layout";
import Communion from "../app/components/Communion";

export default function numerology() {
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
          <Header2 />
        </div>
        <Numerology />
        <div style={{ marginTop: "3rem" }}>
          <NavBar />
        </div>
      </Layout>
      <div style={{ marginTop: "3rem" }}>
        <Communion />
      </div>
    </>
  );
}
