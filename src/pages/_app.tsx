import { ThirdwebProvider } from "@thirdweb-dev/react";
import Head from "next/head";
import { domainName } from "../../const/yourDetails";
import "../styles/globals.css";

// This is the chain your dApp will work on.
const activeChain = "polygon";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      authConfig={{
        domain: domainName,
        authUrl: "/api/auth",
      }}
    >
      <Head>
        <title>IamG2 Gated Content</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Access the musical world of G2 with your NFT"
        />
      </Head>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
