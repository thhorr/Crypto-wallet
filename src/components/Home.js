import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  useEffect(() => {
    const loadWallet = async () => {
      const encryptedWallet = localStorage.getItem('encryptedWallet');
      if (!encryptedWallet) {
        setStatus('No wallet found');
        return;
      }

      try {
        const password = prompt('Please enter your password to unlock the wallet');
        const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
        const provider = new ethers.JsonRpcProvider('https://shape-sepolia.g.alchemy.com/v2/AaMJ06DSbztKTl1InGn1TS3VVzJkNxBh');

        // Set wallet address
        setWalletAddress(wallet.address);

        // Get balance in Wei, then convert to Ether
        const balanceInWei = await provider.getBalance(wallet.address);
        const balanceInEth = ethers.formatEther(balanceInWei);
        setBalance(balanceInEth);

        // Check if the balance is insufficient for transaction
        if (parseFloat(balanceInEth) <= 0) {
          setInsufficientBalance(true);
        } else {
          setInsufficientBalance(false);
        }

        // Fetch transaction history initially
        fetchTransactionHistory(wallet.address);

        // Periodically refresh transaction history every 30 seconds
        const interval = setInterval(() => {
          fetchTransactionHistory(wallet.address);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
      } catch (error) {
        setStatus('Failed to load wallet or balance');
        console.error(error);
      }
    };

    loadWallet();
  }, []);

  const fetchTransactionHistory = async (address) => {
    const apiKey = '8IIT6JQYGGWT51ZV4JRBFY1W2JRFBZEPBK'; // Replace with your Etherscan API key
    try {
      const response = await axios.get(
        `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
      );
      setTransactions(response.data.result); // Store the transaction history in state
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  const sendTransaction = async () => {
    const encryptedWallet = localStorage.getItem('encryptedWallet');
    if (!encryptedWallet) {
      setStatus('No wallet found');
      return;
    }

    try {
      const password = prompt('Please enter your password to unlock the wallet');
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
      const provider = new ethers.JsonRpcProvider('https://shape-sepolia.g.alchemy.com/v2/AaMJ06DSbztKTl1InGn1TS3VVzJkNxBh');
      const signer = wallet.connect(provider);

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount)
      });

      setStatus(`Transaction sent! Tx Hash: ${tx.hash}`);
    } catch (error) {
      setStatus('Transaction failed');
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Send Transaction</Typography>

      {walletAddress && (
        <>
          <Typography variant="body1">Connected Wallet Address: {walletAddress}</Typography>
          <Typography variant="body2">Balance: {balance} ETH</Typography>
        </>
      )}

      <TextField
        label="Recipient Address"
        fullWidth
        margin="normal"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        disabled={insufficientBalance} // Disable input if balance is insufficient
      />
      <TextField
        label="Amount in ETH"
        fullWidth
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={insufficientBalance} // Disable input if balance is insufficient
      />
      <Button
        variant="contained"
        color="primary"
        onClick={sendTransaction}
        disabled={insufficientBalance} // Disable the send button if balance is insufficient
      >
        Send
      </Button>

      {status && (
        <Typography variant="body1" mt={2}>
          {status}
        </Typography>
      )}

      {insufficientBalance && (
        <Typography variant="body2" color="error" mt={2}>
          Insufficient balance to send a transaction. Please fund your wallet.
        </Typography>
      )}

      <Box mt={4}>
        <Typography variant="h5">Transaction History</Typography>
        {transactions.length > 0 ? (
          <List>
            {transactions.map((tx) => (
              <ListItem key={tx.hash}>
                <ListItemText
                  primary={`Tx Hash: ${tx.hash}`}
                  secondary={`From: ${tx.from} To: ${tx.to} | Amount: ${ethers.formatEther(tx.value)} ETH | Block: ${tx.blockNumber}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">No transactions found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;
