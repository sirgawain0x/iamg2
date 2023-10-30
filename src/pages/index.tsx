import {
  ConnectWallet,
  MediaRenderer,
  useContract,
  useNFT,
  useContractMetadata,
  useUser,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUser } from "../../auth.config";
import { contractAddress } from "../../const/yourDetails";
import { Header } from "../components/Header";
import styles from "../styles/Home.module.css";
import checkBalance from "../util/checkBalance";

export default function Home() {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata, isLoading: contractLoading } =
    useContractMetadata(contract);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>Welcome G2 Gang</h2>
      <h2 className={styles.h2}>Your Exclusive Gateway to the Future of Entertainment.</h2>

      <p className={styles.explain}>
      Your All-Access Pass to G2&apos;s Sonic Universe{" "}
        <a
          className={styles.link}
          href="iamg2.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Iamg2.com
        </a>
        .{" "}
      </p>
      <div className={styles.card}>
        <h3>&#128275; Exclusive Unlocked</h3>
        <p>Your NFT unlocked access to this product.</p>

        {contractMetadata && (
          <div className={styles.nft}>
            <MediaRenderer
              src={"https://bafybeieqa2tzwz2xoe3fomhq5heosleymxixmfdrcfo5dlifymjpqsntza.ipfs.nftstorage.link/Monster%20Lyric%20Video.png"}
              alt={contractMetadata.name}
              width="70px"
              height="70px"
            />
            <div className={styles.nftDetails}>
              <h4>{contractMetadata.name}</h4>
            </div>
            
          </div>
        )}
        {contractLoading && <p>Loading...</p>}

        <ConnectWallet theme="dark" className={styles.connect} />
      </div>
      <div className={styles.nft}>
        <iframe src="https://lvpr.tv?v=9477p8y4da3knfr5"  width={500} height={400} allowFullScreen allow="autoplay; encrypted-media; picture-in-picture" sandbox="allow-same-origin allow-scripts"></iframe>
      </div>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps(context) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const secretKey = process.env.TW_SECRET_KEY;

  if (!secretKey) {
    console.log("Missing env var: TW_SECRET_KEY");
    throw new Error("Missing env var: TW_SECRET_KEY");
  }

  // Ensure we are able to generate an auth token using our private key instantiated SDK
  const PRIVATE_KEY = process.env.THIRDWEB_AUTH_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error("You need to add an PRIVATE_KEY environment variable.");
  }

  // Instantiate our SDK
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.THIRDWEB_AUTH_PRIVATE_KEY,
    "polygon",
    { secretKey }
  );

  // Check to see if the user has an NFT
  const hasNft = await checkBalance(sdk, user.address);

  // If they don't have an NFT, redirect them to the login page
  if (!hasNft) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: {},
  };
}
