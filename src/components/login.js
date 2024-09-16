import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

const Login = ({ setLoggedIn }) => {
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState(null);
  const navigate = useNavigate();

  const unlockWallet = async () => {
    const encryptedWallet = localStorage.getItem('encryptedWallet');
    if (!encryptedWallet) {
      alert('No wallet found. Please create one.');
      return;
    }
    try {
      const decryptedWallet = await ethers.Wallet.fromEncryptedJson(
        encryptedWallet,
        password
      );
      setWallet(decryptedWallet);
      setLoggedIn(true);
      navigate('/home');
    } catch (error) {
      alert('Incorrect password');
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <TextField
        label="Enter Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={unlockWallet}>
        Login
      </Button>
      {wallet && (
        <Typography variant="body1" mt={2}>
          Wallet Address: {wallet.address}
        </Typography>
      )}
    </Box>
  );
};

export default Login;
