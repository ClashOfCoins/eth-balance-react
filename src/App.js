import React from 'react';
import useEthBalance from './useEthBalance';
import './App.css';

export default function App() {
  const balance = useEthBalance();

  return (
    <div className="app">
      <p className="caption">Your balance is</p>
      <h1 className="balance">{balance} ETH</h1>
      {/* srcSet attribute is optional. We use it to make image quality better on Apple Retina displays */}
      <img
        alt="coc"
        className="logo"
        src="https://clashofcoins.co/images/logo.png"
        srcSet="https://clashofcoins.co/images/logo.png,
          https://clashofcoins.co/images/logo@2x.png 2x"
      />
    </div>
  );
}
