import React, {useState, useEffect} from "react";
//import abi from "../Utils/NFTCertificate.json";
import { abi } from "../constants";
import {ethers, Contract, providers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  const contractABI = abi.abi;
  const contractAddress = "0xfe7144176ff519d48028C71E9AFC11b17349C531";
  const [walletConnected, setWalletConnected] = useState(false);

  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);

  //returns the tokenId of the claimed NFT
  const [tokenId, setTokenId] = useState("0");

  //sets Name of the student
  const [name, setName] = useState("");

  //sets address of the student to add to whitelist
  const [newAddress, setNewAddress] = useState("");

  //takes address to be issued a cert
  const [issueTo, setIssueTo] = useState("");

  //takes tokenURI to claim the cert
  const [tokenURI, setTokenuri] = useState("");

  // checks if the currently connected MetaMask wallet is the owner of the contract
  const [isOwner, setIsOwner] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onAddressChange = (event) => {
    setNewAddress(event.target.value);
  };

  const onTokenUriChange = (event) => {
    setTokenuri(event.target.value);
  };

  const onIssueToChange = (event) => {
    setIssueTo(event.target.value);
  };

  const isWalletConnected = async () => {
    try {
      const {ethereum} = window;
      const accounts = await ethereum.request({method: "eth_accounts"});
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        setWalletConnected(true);
        console.log("wallet is connected! ", account);
      } else {
        setWalletConnected(false);
        console.log("make sure MetaMask is connected");
      }
    } catch (e) {
      console.log("e: ", e);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]); 
    } catch (err) {
      console.log(err);
    }
  };

  const addAddressTOWhitelist = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const nftContract = new Contract(contractAddress, contractABI, signer);
        await getOwner();
        console.log("add address to whitelist");
        const tx = await nftContract.addAddressToWhitelist(
          newAddress ? newAddress : "Add address ",
          name ? name : "Add name "
        );
        setLoading(true);
        // wait for the transaction to get mined
        await tx.wait();
        setLoading(false);

        window.alert("You successfully added the address to whitelist");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // issue degree
  const issueNFT = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const nftContract = new Contract(contractAddress, contractABI, signer);
        await getOwner();
        console.log("issueDegree");
        const tx = await nftContract.issueNFT(
          issueTo ? issueTo : "studentname"
        );
        setLoading(true);
        // wait for the transaction to get mined
        await tx.wait();
        setLoading(false);
        window.alert("You successfully issued an NFT");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // claim degree function
  const claimNFT = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const nftContract = new Contract(contractAddress, contractABI, signer);
        console.log("claimDegree");
        const tx = await nftContract.claimNFT(
          tokenURI ? tokenURI : "TokenURI"
        );
        setLoading(true);
        await tx.wait();
        setLoading(false);
        window.alert("You successfully claimed your ABC NFT");
      }
    } catch (err) {
      console.error(err);
    }
  };

  

  /**
   * getOwner: calls the contract to retrieve the owner
   */
  const getOwner = async () => {
    try {
      const {ethereum} = window();

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const nftContract = new Contract(contractAddress, contractABI, signer);
        const _owner = await nftContract.owner();
        // We will get the signer now to extract the address of the currently connected MetaMask account
        // Get the address associated to the signer which is connected to  MetaMask
        const address = await signer.getAddress();
        if (address.toLowerCase() === _owner.toLowerCase()) {
          setIsOwner(true);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    let addAddressTOWhitelist;
    let issueDegree;
    let claimDegree;
    isWalletConnected();
    // getTokenId();
    try {
    // set an interval to get the number of token Ids minted every 5 seconds

    const {ethereum} = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      nftContract = new ethers.Contract(signer, contractAddress, contractABI);
    }
  } catch(err) {
    console.log(err);
  }
  //   setInterval(async function () {
  //     await getTokenId();
  //   }, 5 * 1000);
  }, [walletConnected]);

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <div>
        <div>
          <form>
            <label className={styles.spaces}>Claim ABC NFT</label> <br />
            <input
              id='claim'
              type='text'
              placeholder='claim Degree'
              onChange={onTokenUriChange}
            />
          </form>
          <br />

          <button className={styles.button} onClick={claimNFT}>
            Claim NFT
          </button>
        </div>
        <div>
          <div>
            <form>
              <div className='formgroup'>
                <label>Add Address</label> <br />

                <input
                  id='address'
                  type='text'
                  placeholder='Add Address'
                  onChange={onAddressChange}
                />
              
                <input
                  id='name'
                  type='text'
                  placeholder='Add name'
                  onChange={onNameChange}
                />
              </div>
            </form>
            <br />
            <button className={styles.button} onClick={addAddressTOWhitelist}>
              {" "}
              Add Address To Whitelist
            </button>
          </div>

          <div>
            <form>
              <label>Issue NFT</label> <br />
              <input
                id='issue'
                type='text'
                placeholder='Issue Degree'
                onChange={onIssueToChange}
              />
            </form>
            <br />
            <button className={styles.button} onClick={issueNFT}>
              Issue NFT
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>AFRICA BLOCKCHAIN CENTER</title>
        <meta name='description' content='ABC Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>WELCOME TO AFRICA BLOCKCHAIN CENTER!</h1>
          <div className={styles.description}>NFT issuing Dapp</div>
          
          {renderButton()}
        </div>
        <div>
        <img className={styles.image} src='/0.svg' />
        </div>
     </div>

      <footer className={styles.footer}>
        Made with &#10084; by Sharon & Nashons
      </footer>
    </div>
  );
}
