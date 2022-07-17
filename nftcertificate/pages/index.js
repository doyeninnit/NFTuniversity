import React, {useState, useRef, useEffect} from "react";
import abi from "../Utils/NFTCertificate.json";
import {ethers, providers} from "ethers";
import Head from "next/head";
import Image from "next/image";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";

export default function Home() {
  const contractABI = abi.abi;
  const contractAddress = "0x8A8366994237b8bBfBB65D721091331803392DF9";
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

  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open

  const web3ModalRef = useRef();

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

  const addAddressTOWhitelist = async () => {
    try {
      await getOwner();
      console.log("add address to whitelist");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(contractAddress, contractABI, signer);
      // call the issueDegree from the contract to issue a degree
      const tx = await nftContract.addAddressToWhitelist(
        newAddress ? newAddress : "Add address ",
        name ? name : "Add name "
      );
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);

      window.alert("You successfully added the address to whitelist");
    } catch (err) {
      console.error(err);
    }
  };

  // issue degree
  const issueDegree = async () => {
    try {
      await getOwner();
      console.log("issueDegree");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(contractAddress, contractABI, signer);
      // call the issueDegree from the contract to issue a degree
      const tx = await nftContract.issueDegree(
        issueTo ? issueTo : "studentname"
      );
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("You successfully issued a degree");
    } catch (err) {
      console.error(err);
    }
  };

  // claim degree function
  const claimDegree = async () => {
    try {
      console.log("claimDegree");
      // We need a Signer here since this is a 'write' transaction.
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const nftContract = new Contract(contractAddress, contractABI, signer);
      // call the issueDegree from the contract to issue a degree
      const tx = await nftContract.claimDegree(
        tokenURI ? tokenURI : "TokenURI"
      );
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("You successfully claimed your degree");
    } catch (err) {
      console.error(err);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  // gets the tokenId that has been minted
  const getTokenId = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const nftContract = new Contract(contractAddress, contractABI, provider);
      // call the tokenIds from the contract
      const _tokenId = await nftContract.getTokenId();
      console.log("tokenId", _tokenId);
      //_tokenIds is a `Big Number`. We need to convert the Big Number to a string
      setTokenId(_tokenId.toString());
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * getOwner: calls the contract to retrieve the owner
   */
  const getOwner = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const nftContract = new Contract(contractAddress, contractABI, provider);
      // call the owner function from the contract
      const _owner = await nftContract.owner();
      // We will get the signer now to extract the address of the currently connected MetaMask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const {chainId} = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();

      getTokenId();

      // set an interval to get the number of token Ids minted every 5 seconds
      setInterval(async function () {
        await getTokenId();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  /*
    renderButton: Returns a button based on the state of the dapp
  */
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

    // If connected user is the owner, allow them issue Degree and add address to whitelist
    /*if (isOwner) {
  return (
    <div>
      <div>
        <form>
      <div class="formgroup">
       <label>Add Address</label>
        
         <input id="address" type="text" placeholder="Add Address" onChange={onAddressChange}/>
         <input id="name" type="text" placeholder="Add name" onChange={onNameChange}/>
          </div>
        </form>
          <button className={styles.button} onClick={addAddressTOWhitelist}> Add Address To Whitelist</button>
     
    </div>
  <div>
    <form>
      <label>Issue Degree</label>
      <input id="issue" type="text" placeholder="Issue Degree" onChange={onIssueToChange}/>
    </form>
   <button className={styles.button} onClick={issueDegree}>
     Issue Degree
   </button>
   </div>
   </div>
  );
}*/

    return (
      <div>
        <div>
          <form>
            <label className={styles.spaces}>Claim Degree</label>
            <input
              id='claim'
              type='text'
              placeholder='claim Degree'
              onChange={onTokenUriChange}
            />
          </form>

          <button className={styles.button} onClick={claimDegree}>
            Claim Degree
          </button>
        </div>
        <div>
          <div>
            <form>
              <div class='formgroup'>
                <label>Add Address</label>

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
            <button className={styles.button} onClick={addAddressTOWhitelist}>
              {" "}
              Add Address To Whitelist
            </button>
          </div>

          <div>
            <form>
              <label>Issue Degree</label>
              <input
                id='issue'
                type='text'
                placeholder='Issue Degree'
                onChange={onIssueToChange}
              />
            </form>
            <button className={styles.button} onClick={issueDegree}>
              Issue Degree
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>NFTuniversity</title>
        <meta name='description' content='NFTuniversityDapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to NFTuniversity!</h1>
          <div className={styles.description}>NFT issuing Dapp</div>
          <div className={styles.description}>
            {tokenId}/10 have been issued
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src='./public/uni.jpg' />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Sharon & Nashons
      </footer>
    </div>
  );
}
