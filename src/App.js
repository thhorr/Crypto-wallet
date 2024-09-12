import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import CreateWallet from './components/createWallet';
import Login from './components/login';
import ImportWallet from './components/importWallet';

function App() {
  const [hasWallet, setHasWallet] = useState(
    !!localStorage.getItem('encryptedWallet')
  );
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">MetaMask Clone</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 4 }}>
        {loggedIn ? (
          <Typography variant="h4">Welcome to your wallet!</Typography>
        ) : (
          <>
            {!hasWallet && <CreateWallet />}
            {hasWallet && <Login setLoggedIn={setLoggedIn} />}
            <ImportWallet />
          </>
        )}
      </Box>
    </Box>
  );
}

export default App;
