import { useState } from "react";
import {
  ConnectWallet,
  MediaRenderer,
  useAddress,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { getUser } from "../../auth.config";
import { contractAddress } from "../../const/yourDetails";
import { Header } from "../components/Header";
import { Box, Flex, Input, Button, Heading } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import checkBalance from "../util/checkBalance";

export default function Login() {
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata, isLoading: contractLoading } =
    useContractMetadata(contract);
  const address = useAddress();
  const { data: nfts } = useOwnedNFTs(contract, address);
  const router = useRouter();

  const [mintAmount, setMintAmount] = useState(1);
  const nftCost = 16;
  const projectId = 'f210a480-faad-4f15-8d80-43b81134bf8e';
  const collectionId = '542bbf15-06cf-44b3-9607-27b683e33f48';

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  }

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  }


  useEffect(() => {
    if (nfts?.length) {
      router.push("/");
    }
  }, [nfts, router, address]);

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.heading}>Welcome G2 Gang</h2>
      <h2 className={styles.h2}>Your Exclusive Gateway to the Future of Entertainment.</h2>

      <p className={styles.explain}>
      Your All-Access Pass to G2&apos;s Sonic Universe from{" "}
        <a
          className={styles.link}
          href="https://iamg2.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          IamG2.com
        </a>
        .{" "}
      </p>
      <p style={{marginTop: "2%"}}><b>Steps:</b></p>
      <ol>
        <li><b>Cop an NFT:</b> Buy your unique <span className={styles.heading}><a href="#NFT">G2 NFT</a></span> to unlock the experience.</li>
        <li><b>Step Inside:</b> Dive into a catalog of exclusive tracks, videos, and live events.</li>
        <li><b>Join the Beat Revolution:</b> Be part of a new era in music, fueled by NFTs.</li>
      </ol>

      <div className={styles.card}>
        <h3>&#128274; Holder Exclusive</h3>
        <p>To unlock this product, you need:</p>

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
      <Flex id={"NFT"} flexDirection="column" alignItems="center" p={6}>
        <Heading>Get the &quot;Monster&quot; Lyric Video </Heading>
        <Box w="500px" h="500px" boxShadow="lg" rounded="md" mt={5}>
        <MediaRenderer
          src={"https://bafybeieqa2tzwz2xoe3fomhq5heosleymxixmfdrcfo5dlifymjpqsntza.ipfs.nftstorage.link/Monster%20Lyric%20Video.png"}
          alt={"Monster Lyric Video Cover"}
          width="500px"
          height="500px"
        />
        </Box>
        <Flex mt={4}>
          <Box mr={3}>
          <Button size={"md"} onClick={handleDecrement} > - </Button>
          </Box>
            <Input
              size={"md"}
              width={12}
              readOnly
              type="number"
              value={mintAmount} 
            />
          <Box ml={3}>
            <Button size={"md"} onClick={handleIncrement}> + </Button>
          </Box>
        </Flex>

        <Box mt={4}>
          <CrossmintPayButton
              collectionId={collectionId}
              projectId={projectId}
              mintConfig={{type: "erc-721","totalPrice":(nftCost * mintAmount).toString(),"to": address,"numberOfTokens":"100"}}
          />
        </Box>
      </Flex>
    </div>
  );
}

export async function getServerSideProps(context) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      props: {},
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

  // If they have an NFT, redirect them to the home page
  if (hasNft) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: {},
  };
}
