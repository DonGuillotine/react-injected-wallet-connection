import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';

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
    updateBalance,
  } = useWalletContext();

  const [customAddress, setCustomAddress] = useState('');
  const [customBalance, setCustomBalance] = useState<string | null>(null);
  const [customAddressError, setCustomAddressError] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('');

  useEffect(() => {
    const getNetworkName = () => {
      switch (chainId) {
        case 1: return 'Ethereum Mainnet';
        case 3: return 'Ropsten Testnet';
        case 4: return 'Rinkeby Testnet';
        case 5: return 'Goerli Testnet';
        case 42: return 'Kovan Testnet';
        default: return 'Unknown Network';
      }
    };
    setNetworkName(getNetworkName());
  }, [chainId]);

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
    if (fetchedBalance !== null) {
      setCustomBalance(fetchedBalance);
    }
  };

  const handleRefreshBalance = () => {
    updateBalance();
  };

  return (
    <div className="wallet-manager">
      <h1>Ethereum Wallet Manager</h1>
      {error && <p className="error">{error}</p>}
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : isConnected ? (
        <div className="wallet-info">
          <h2>Wallet Connected</h2>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
          <p><strong>Network:</strong> {networkName} (Chain ID: {chainId})</p>
          <button onClick={handleRefreshBalance} className="refresh-button">Refresh Balance</button>
          <button onClick={handleDisconnect} className="disconnect-button">Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect} className="connect-button">Connect Wallet</button>
      )}

      <div className="custom-address-checker">
        <h2>Check Balance of Custom Address</h2>
        <input
          type="text"
          value={customAddress}
          onChange={handleCustomAddressChange}
          placeholder="Enter Ethereum address"
          className="address-input"
        />
        <button onClick={handleFetchBalance} disabled={!isConnected} className="fetch-button">
          Fetch Balance
        </button>
        {customAddressError && <p className="error">{customAddressError}</p>}
        {customBalance !== null && <p className="custom-balance">Balance: {customBalance} ETH</p>}
      </div>
    </div>
  );
};

export default WalletManager;