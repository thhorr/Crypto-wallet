import React, { useState } from "react";
import { ethers } from "ethers";
import { Circles } from "react-loader-spinner";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [network, setNetwork] = useState("sepolia"); // Default to Sepolia testnet

  // Create a new wallet
  const createWallet = () => {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);
  };

  // Fetch the wallet balance
  const getBalance = async () => {
    if (wallet) {
      setLoading(true);
      try {
        // Provider creation syntax has slightly changed
        const provider = new ethers.JsonRpcProvider(`https://shape-sepolia.g.alchemy.com/v2/iYhqAD_7pxcsW26LIHssiJhKgbrfQdDT`);
        const walletBalance = await provider.getBalance(wallet.address);
        setBalance(ethers.formatEther(walletBalance)); // Format balance as ETH
      } finally {
        setLoading(false);
      }
    }
  };

  // Send a transaction
  const sendTransaction = async () => {
    if (!ethers.isAddress(recipient) || isNaN(amount) || Number(amount) <= 0) {
      alert("Invalid recipient address or amount");
      return;
    }

    if (wallet) {
      setSending(true);
      try {
        const provider = new ethers.JsonRpcProvider(`https://shape-sepolia.g.alchemy.com/v2/iYhqAD_7pxcsW26LIHssiJhKgbrfQdDT`);
        const signer = wallet.connect(provider);
        const tx = await signer.sendTransaction({
          to: recipient,
          value: ethers.parseEther(amount), // Parse the amount into wei
        });
        await tx.wait(); // Wait for transaction to be mined
        alert("Transaction Successful");
      } catch (error) {
        alert(`Transaction Failed: ${error.message}`);
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div>
      <select onChange={(e) => setNetwork(e.target.value)} value={network}>
        <option value="mainnet">Mainnet</option>
        <option value="zksync">Zksync</option>
        <option value="optimism">Optimism</option>
        <option value="sepolia">Sepolia</option>
        <option value="polygon">Polygon</option>
      </select>
      <button data-tip="Generate a new Ethereum wallet" onClick={createWallet}>
        Create Wallet
      </button>
      <ReactTooltip place="top" type="dark" effect="float" />
      {wallet && (
        <div>
          <p>Address: {wallet.address}</p>
          <button data-tip="Fetch the wallet balance" onClick={getBalance}>
            Get Balance
          </button>
          {loading ? (
            <Circles height="80" width="80" color="#61dafb" />
          ) : (
            balance && <p>Balance: {balance} ETH</p>
          )}
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            data-tip="Enter the recipient's Ethereum address"
          />
          <input
            type="text"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            data-tip="Enter the amount of ETH to send"
          />
          <button data-tip="Send ETH to the recipient" onClick={sendTransaction} disabled={sending}>
            {sending ? "Sending..." : "Send Transaction"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Wallet;
