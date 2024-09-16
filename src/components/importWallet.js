import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

const ImportWallet = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const importWallet = async () => {
    try {
      const wallet = ethers.Wallet.fromPhrase(seedPhrase);
      const encryptedJson = await wallet.encrypt(password);
      localStorage.setItem('encryptedWallet', encryptedJson);

      navigate('/login');
    } catch (error) {
      alert('Invalid Seed Phrase');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5">Import Wallet</Typography>
      <TextField
        label="Enter Seed Phrase"
        fullWidth
        margin="normal"
        value={seedPhrase}
        onChange={(e) => setSeedPhrase(e.target.value)}
      />
      <TextField
        label="Enter Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={importWallet}>
        Import Wallet
      </Button>
    </Box>
  );
};

export default ImportWallet;
