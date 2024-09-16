import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Box, Button, Typography, TextField } from '@mui/material';

const CreateWallet = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const generateWallet = async () => {
    const wallet = ethers.Wallet.createRandom();
    setSeedPhrase(wallet.mnemonic.phrase);
  };

  const encryptWallet = async () => {
    const wallet = ethers.Wallet.fromPhrase(seedPhrase);
    const encryptedJson = await wallet.encrypt(password);
    localStorage.setItem('encryptedWallet', encryptedJson);
    
    navigate('/login');
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Button variant="contained" color="primary" onClick={generateWallet}>
        Create Wallet
      </Button>
      {seedPhrase && (
        <Box mt={2}>
          <Typography variant="body1">Your Seed Phrase:</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {seedPhrase}
          </Typography>
          <TextField
            label="Enter Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={encryptWallet}>
            Save Wallet
          </Button>
        </Box>
      )}
      <Box mt={2}>
        <Typography variant="body2">
          Already have a wallet? <Link to="/import-wallet">Import Wallet</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateWallet;
