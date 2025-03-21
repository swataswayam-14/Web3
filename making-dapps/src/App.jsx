import React, { useMemo } from 'react'
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {UnsafeBurnerWalletAdapter} from '@solana/wallet-adapter-wallets';
import {WalletModalProvider, WalletConnectButton,WalletDisconnectButton,WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import fs from "fs";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import '@solana/wallet-adapter-react-ui/styles.css';
import { Airdrop } from './Airdrop';

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
//connection provider provides a connection to the blockchain
//end points : rpc urls (mainnet, devnet etc)

//for wallets that donot follow the rules for them we need to provide explicitly to the walletprovider otherwise an empty array would be good
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton/>
          <WalletDisconnectButton></WalletDisconnectButton>
          <div>
            Hi There
          </div>
          <Airdrop/>
        </WalletModalProvider>
      </WalletProvider>

    </ConnectionProvider>
  )
}

export default App
