import { useState, useEffect } from 'react';

interface WalletState {
  account: string | null;
  isConnecting: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    account: null,
    isConnecting: false,
    error: null
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      setState(prev => ({ ...prev, error: 'MetaMask not installed' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setState(prev => ({
          ...prev,
          account: accounts[0],
          isConnecting: false
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to connect wallet',
        isConnecting: false
      }));
    }
  };

  const disconnectWallet = () => {
    setState({
      account: null,
      isConnecting: false,
      error: null
    });
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            setState(prev => ({ ...prev, account: accounts[0] }));
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setState(prev => ({ ...prev, account: accounts[0], error: null }));
        } else {
          setState(prev => ({ ...prev, account: null, error: null }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return {
    account: state.account,
    isConnecting: state.isConnecting,
    error: state.error,
    connectWallet,
    disconnectWallet
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}