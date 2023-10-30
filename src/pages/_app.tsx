import * as React from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from '@chakra-ui/react';
import Head from "next/head";
import { domainName } from "../../const/yourDetails";
import "../styles/globals.css";

// This is the chain your dApp will work on.
const activeChain = "polygon";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ThirdwebProvider
        activeChain={activeChain}
        clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
        authConfig={{
          domain: domainName,
          authUrl: "/api/auth",
        }}
      >
        <Head>
          <title>G2 Gated Content</title>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            name="description"
            content="Access the musical world of G2 with your NFT"
          />
        </Head>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </ChakraProvider>
  );
}

export default MyApp;
