import {eth} from 'state/eth';
import {useState} from "react";
import {token} from "state/token";
import Layout from "components/Layout";
import {config} from "config";

export default function Claim() {
    const addressList = config.airdrop;
    const {address, unlock} = eth.useContainer();
    const {dataLoading, tokenId, alreadyClaimed, claimAirdrop} = token.useContainer();
    const [buttonLoading, setButtonLoading] = useState(false);

    const addLink = () => {
        if(typeof address === 'string') {
            let index = addressList[address];
            location.href = ''
        }
    }

    const claimWithLoading = async() => {
        setButtonLoading(true);
        await claimAirdrop();
        setButtonLoading(false);
    }

    return (
        <Layout>
            <div className={styles.container}>
                {!address ? (
                <div className={styles.card}>
                    <h1>You are not authenticated.</h1>
                    <p>Please connect your wallet to claim your certificate.</p>
                    <button onClick={() => unlock()}>Connect Wallet</button>
                </div>
                ) : dataLoading ? (
                <div className={styles.card}>
                    <h1>Loading details...</h1>
                    <p>Please hold while we collect details about your address.</p>
                </div>
                ) : tokenId === null ? (
                <div className={styles.card}>
                    <h1>Ineligible Address</h1>
                    <p>Sorry, your address is not eligible to claim a NFT Certificate.</p>
                </div>
                ) : alreadyClaimed ? (
                <div className={styles.card}>
                    <h1>Congratulations!</h1>
                    <p>Your address {} <br /> has successfully claimed a NFT Certificate.</p>
                    <button onClick={addLink}>View</button>
                </div>
                ) : (
                <div className={styles.card}>
                    <h1>Claim your certificates.</h1>
                    <p>Your address qualifies for a NFT Certificate.</p>
                    <button onClick={claimWithLoading} disabled={buttonLoading}>
                        {buttonLoading ? "Claiming Certificate" : "Claim Certificate"}
                    </button>
                </div>
                )}
            </div>
        </Layout>
    )
}