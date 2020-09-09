import { useCallback, useEffect, useRef, useState } from 'react';
import Fortmatic from 'fortmatic';
import { ethers } from 'ethers';

// Replace `YOUR_API_KEY` with API key you get from Fortmatic dashboard
const fm = new Fortmatic('YOUR_API_KEY', 'rinkeby');

// Ethers.js provides functionality to query data from ethereum blockchain.
// We can use `Web3Provider` class to construct a wrapper for
// web3-compatible provider which we receive from Fortmatic.
const provider = new ethers.providers.Web3Provider(fm.getProvider());

// Signer represents ethereum wallet in ethers.js. You cannot just send
// transactions with only provider, you will need signer (wallet) for this.
// In our demo we use signer to query user ethereum address.
const signer = provider.getSigner();

export default function useEthBalance() {
  const [balance, setBalance] = useState(0);
  // Using React ref here to prevent component re-rendering when changing
  // previous balance value
  const prevBalanceRef = useRef(0);

  const fetchBalance = useCallback(async () => {
    const address = await signer.getAddress();
    console.log(address);

    const rawBalance = await provider.getBalance(address);
    // Format ETH balance and parse it to JS number
    const value = parseFloat(ethers.utils.formatEther(rawBalance));

    // Optimization: check that user balance has actually changed before
    // updating state and triggering the consuming component re-render
    if (value !== prevBalanceRef.current) {
      prevBalanceRef.current = value;
      setBalance(value);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    // Fetch user balance on each block
    provider.on('block', fetchBalance);

    // Cleanup function is used to unsubscribe from 'block' event and prevent
    // a possible memory leak in your application.
    return () => {
      provider.off('block', fetchBalance);
    };
  }, [fetchBalance]);

  return balance;
}
