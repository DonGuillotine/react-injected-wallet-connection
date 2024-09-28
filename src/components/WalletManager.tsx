import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletManager: React.FC = () => {
  const {
    isConnected,
    address,
    balance,
    chainId,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isValidAddress,
    fetchBalance,
  } = useWallet();

  const [customAddress, setCustomAddress] = useState('');
  const [customBalance, setCustomBalance] = useState<string | null>(null);
  const [customAddressError, setCustomAddressError] = useState<string | null>(null);

  const handleConnect = () => {
    connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const handleCustomAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAddress(e.target.value);
    setCustomAddressError(null);
    setCustomBalance(null);
  };

  const handleFetchBalance = async () => {
    if (!isValidAddress(customAddress)) {
      setCustomAddressError('Invalid Ethereum address');
      return;
    }
    const fetchedBalance = await fetchBalance(customAddress);
    if (fetchedBalance !== null && fetchedBalance !== undefined) {
      setCustomBalance(fetchedBalance);
    } else {
      setCustomBalance(null);
      setCustomAddressError('Failed to fetch balance');
    }
  };

  return (
    <div>
      <h1>Wallet Manager</h1>
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : isConnected ? (
        <div>
          <p>Connected Address: {address}</p>
          <p>Balance: {balance} ETH</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}

      <div>
        <h2>Check Balance of Custom Address</h2>
        <input
          type="text"
          value={customAddress}
          onChange={handleCustomAddressChange}
          placeholder="Enter Ethereum address"
        />
        <button onClick={handleFetchBalance} disabled={!isConnected}>
          Fetch Balance
        </button>
        {customAddressError && <p className="error">{customAddressError}</p>}
        {customBalance !== null && <p>Balance: {customBalance} ETH</p>}
      </div>
    </div>
  );
};

export default WalletManager;