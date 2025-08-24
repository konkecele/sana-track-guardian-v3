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
      setState(prev => ({ ...prev, error: 'MetaMask not installed. Please install MetaMask to continue.' }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Always request account access to ensure user signs in
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        // Verify user is connected to correct network or prompt to switch
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setState(prev => ({
          ...prev,
          account: accounts[0],
          isConnecting: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: 'Please connect your MetaMask wallet',
          isConnecting: false
        }));
      }
    } catch (error: any) {
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Please check MetaMask - connection request pending';
      }
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
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

  // Check if wallet is already connected (but don't auto-connect)
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          // Only check existing permissions, don't request new ones
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          // Only auto-connect if user previously gave permission
          if (accounts.length > 0) {
            setState(prev => ({ ...prev, account: accounts[0] }));
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
          // Don't auto-connect on error
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