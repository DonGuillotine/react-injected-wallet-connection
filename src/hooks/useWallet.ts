import { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  provider: null,
  signer: null,
};

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();
        
        setWalletState({
          isConnected: true,
          address,
          balance: ethers.formatEther(balance),
          chainId: Number(network.chainId),
          provider,
          signer,
        });
      } else {
        throw new Error('MetaMask is not installed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setWalletState(initialState);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState(initialState);
  }, []);

  const updateBalance = useCallback(async () => {
    if (walletState.address && walletState.provider) {
      try {
        const balance = await walletState.provider.getBalance(walletState.address);
        setWalletState(prev => ({ ...prev, balance: ethers.formatEther(balance) }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      }
    }
  }, [walletState.address, walletState.provider]);

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== walletState.address) {
        connectWallet();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletState.address, connectWallet, disconnectWallet]);

  useEffect(() => {
    if (walletState.isConnected) {
      updateBalance();
    }
  }, [walletState.isConnected, walletState.chainId, updateBalance]);

  const isValidAddress = useMemo(() => {
    return (address: string) => {
      try {
        ethers.getAddress(address);
        return true;
      } catch {
        return false;
      }
    };
  }, []);

  const fetchBalance = useCallback(async (address: string): Promise<string | null> => {
    if (!isValidAddress(address)) {
      setError('Invalid Ethereum address');
      return null;
    }
  
    setIsLoading(true);
    setError(null);
    try {
      if (walletState.provider) {
        const balance = await walletState.provider.getBalance(address);
        return ethers.formatEther(balance);
      } else {
        throw new Error('Provider not available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletState.provider, isValidAddress]);

  return {
    ...walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    updateBalance,
    isValidAddress,
    fetchBalance,
  };
}