import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Box, Button, TextField, Typography } from '@mui/material';

const Home = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const sendTransaction = async () => {
    const encryptedWallet = localStorage.getItem('encryptedWallet');
    if (!encryptedWallet) {
      setStatus('No wallet found');
      return;
    }

    try {
      const password = prompt('Please enter your password to unlock the wallet');
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
      const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID');
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
      <TextField
        label="Recipient Address"
        fullWidth
        margin="normal"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <TextField
        label="Amount in ETH"
        fullWidth
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={sendTransaction}>
        Send
      </Button>
      {status && (
        <Typography variant="body1" mt={2}>
          {status}
        </Typography>
      )}
    </Box>
  );
};

export default Home;
