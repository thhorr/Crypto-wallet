import { ethers } from 'ethers';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const ImportWallet = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState(null);

  const importWallet = async () => {
    try {
      // Using fromPhrase instead of fromMnemonic
      const wallet = ethers.Wallet.fromPhrase(seedPhrase);
      const encryptedJson = await wallet.encrypt(password);
      setWallet(wallet);
      localStorage.setItem('encryptedWallet', encryptedJson);
    } catch (error) {
      alert('Invalid Seed Phrase');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
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
      {wallet && (
        <Typography variant="body1" mt={2}>
          Wallet Address: {wallet.address}
        </Typography>
      )}
    </Box>
  );
};

export default ImportWallet;
