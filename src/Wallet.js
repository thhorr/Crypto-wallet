import React, { useState } from 'react';
import { ethers } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const createWallet = () => {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);
    setBalance(null);
  };

  const getBalance = async () => {
    if (!wallet) {
      alert('Create a wallet first!');
      return;
    }

    const provider = new ethers.JsonRpcProvider(`https://shape-sepolia.g.alchemy.com/v2/iYhqAD_7pxcsW26LIHssiJhKgbrfQdDT`);
    const balance = await provider.getBalance(wallet.address);
    setBalance(ethers.formatEther(balance));
  };

  const addEthToWallet = async () => {
    if (!wallet) {
      alert('Create a wallet first!');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.JsonRpcProvider(`https://shape-sepolia.g.alchemy.com/v2/iYhqAD_7pxcsW26LIHssiJhKgbrfQdDT`);
      const senderPrivateKey = 'afa0c7df601156a575aaa1750fbd7cfcb0b45d9a3f2b96d583355054d0761a4b';
      const senderWallet = new ethers.Wallet(senderPrivateKey, provider);

      const tx = await senderWallet.sendTransaction({
        to: wallet.address,
        value: ethers.parseEther('0.01'),
      });

      await tx.wait();
      getBalance();
      alert('0.01 ETH added to the wallet');
    } catch (error) {
      alert(`Failed to add ETH: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransaction = async () => {
    if (!wallet) {
      alert('Create a wallet first!');
      return;
    }

    if (!recipient || !amount) {
      alert('Please enter both recipient address and amount.');
      return;
    }

    setIsLoading(true);

    try {
      const provider = new ethers.JsonRpcProvider(`https://shape-sepolia.g.alchemy.com/v2/iYhqAD_7pxcsW26LIHssiJhKgbrfQdDT`);
      const signer = wallet.connect(provider);

      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      });

      await tx.wait();
      getBalance();
      alert(`Sent ${amount} ETH to ${recipient}`);
    } catch (error) {
      alert(`Failed to send transaction: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Crypto Wallet
          </a>
        </div>
      </nav>

      <div className="container mt-5">
        <h1 className="text-center mb-4">Manage Your Crypto Wallet</h1>

        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Wallet Details</h5>

            <div className="mb-3">
              <button className="btn btn-primary" onClick={createWallet}>
                Create Wallet
              </button>
            </div>

            {wallet && (
              <>
                <div className="mb-3">
                  <label htmlFor="walletAddress" className="form-label">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="walletAddress"
                    value={wallet.address}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="walletBalance" className="form-label">
                    Wallet Balance (ETH)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="walletBalance"
                    value={balance || 'N/A'}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <button className="btn btn-success" onClick={getBalance}>
                    Get Balance
                  </button>
                  <button
                    className="btn btn-warning ms-2"
                    onClick={addEthToWallet}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Add ETH'}
                  </button>
                </div>

                <hr />

                <div className="mb-3">
                  <h5>Send ETH</h5>
                  <div className="mb-3">
                    <label htmlFor="recipient" className="form-label">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount (ETH)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={sendTransaction}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send ETH'}
                  </button>
                </div>
              </>
            )}

            {!wallet && (
              <div className="alert alert-info">
                Please create a wallet to see details and perform actions.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
