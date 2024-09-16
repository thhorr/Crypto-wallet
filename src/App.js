import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import CreateWallet from './components/CreateWallet';
import ImportWallet from './components/ImportWallet';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Zephyr</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ padding: 4 }}>
          <Routes>
            {!loggedIn ? (
              <>
                <Route path="/create-wallet" element={<CreateWallet />} />
                <Route path="/import-wallet" element={<ImportWallet />} />
                <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
                <Route path="*" element={<Navigate to="/create-wallet" />} />
              </>
            ) : (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Navigate to="/home" />} />
              </>
            )}
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
