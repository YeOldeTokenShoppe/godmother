import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preload" href="/RL80_LOGO.webp" as="image" />
          <link rel="preload" href="/mary_wide.jpg" as="image" />

          <link
            rel="preload"
            href="/UnifrakturCook-Bold.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          ></link>
          <link
            rel="preload"
            href="/OleoScriptSwashCaps-Bold.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Beth+Ellen&family=Bowlby+One&family=Inter:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=UnifrakturCook:wght@700&family=UnifrakturMaguntia&display=swap"
            rel="stylesheet"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
