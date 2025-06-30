'use client';

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { modal } from '../context/WalletContext';
import { Transaction } from '@mysten/sui/transactions';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from "../../src/redux/slices/user";
import { useQuery } from 'react-query';
import { FANTV_API_URL } from "../constant/constants";
import fetcher from "../dataProvider";

// Setup SUI client
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

const STABLECOIN_CONFIG = {
  USDC: {
    sui: {
      coinType: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
      decimals: 6,
      pay_recipient: '0x71c2ee4d0ad15c7375049f1e1cd220f8e75955ffda8f2112ae1f08d5731682fb'
    },
    ethereum: {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
    },
    solana: {
      mint: 'EPjFWdd5AufqSSqeM2qN1xzybKZm7dtJZ5uNjL3YjvDp',
      decimals: 6,
    },
  },
  USDT: {
    sui: {
      coinType: '0x...', // Add actual USDT CoinType
      decimals: 6,
    },
    ethereum: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
    },
    solana: {
      mint: 'Es9vMFrzaCERnWYWWkTnP4bMQNCmL3kz3KfCikUcGqQp',
      decimals: 6,
    },
  },
};

export default function StablecoinPayButton({
  amount,
  tokenType = 'USDC',
  plan_id,
  recipient,
  onSuccess,
  onFailure,
  children,
}) {
  const suiAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [evmAddress, setEvmAddress] = useState(null);
  const [solanaAddress, setSolanaAddress] = useState(null);

  // Detect EVM wallet
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) setEvmAddress(accounts[0]);
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        setEvmAddress(accounts[0] || null);
      });
    }
  }, []);

  // Detect Solana wallet
  useEffect(() => {
    if (typeof window !== 'undefined' && window.solana?.isPhantom) {
      window.solana.connect({ onlyIfTrusted: true }).then(({ publicKey }) => {
        setSolanaAddress(publicKey.toString());
      });

      window.solana.on('connect', () => {
        setSolanaAddress(window.solana.publicKey.toString());
      });

      window.solana.on('disconnect', () => {
        setSolanaAddress(null);
      });
    }
  }, []);



  const { refetch } = useQuery(
    `${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`,
    () => fetcher.get(`${FANTV_API_URL}/api/v1/users/${userData?._id || userData?.id}`),
    {
      enabled: !!(userData?._id || userData?.id),
      refetchOnMount: "always",
      onSuccess: ({ data }) => {
        dispatch(setUserData(data));
      },
    }
  );


  async function verifyCryptoPayment({ txDigest, planId, chain='sui' }) {
    try {
      const response = await fetch('http://127.0.0.1:3001/verify-crypto-payment', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NWJiNWJlMTRjZDhlMGU2YTc2OTEyMiIsIm5hbWUiOiJHdWVzdCBVc2VyIiwiaWF0IjoxNzUwODQ0OTYwfQ.TKuFEACdygh-c34gE8_gEg_dT-WpcnABDLqQDPAKRoo`,
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Origin': 'https://app.videonation.ai',
          'Referer': 'https://app.videonation.ai/',
          'User-Agent': navigator.userAgent,
          'platform': 'web',
        },
        body: JSON.stringify({
          tx_digest: txDigest,
          chain: chain,
          plan_id: planId,
        }),
      });
  
      console.log(verifyCryptoPayment, response)
      if (!response?.ok) {
        alert(`Something went wrong.`);

      }
  
      const data = await response.json();
      console.log('✅ Verified on backend:', data);
      refetch()
      return data;
    } catch (error) {
      console.error('❌ Error in verifyCryptoPayment:', error);
      alert(`Something went wrong. ${error}`);
    }
  }

  

  const handlePayment = async () => {
    const tokenConfig = STABLECOIN_CONFIG[tokenType];
    if (!tokenConfig) {
      alert(`Unsupported token: ${tokenType}`);
      return;
    }
  
    try {
  
      // 1. SUI chain
      if (suiAccount?.address) {
        const { coinType, decimals, pay_recipient } = tokenConfig.sui;
        const { data: coins } = await client.getCoins({
          owner: suiAccount.address,
          coinType,
        });
  
        if (!coins.length) {
          alert(`No ${tokenType} in SUI wallet`);
          return;
        }
  
        const tx = new Transaction();
        const smallestAmount = BigInt(amount * 10 ** decimals);
        const [coin] = tx.splitCoins(coins[0].coinObjectId, [smallestAmount]);
        tx.transferObjects([coin], pay_recipient);
  
        try {
          signAndExecuteTransaction(
            {
              transaction: tx,
              chain: 'sui:mainnet',
            },
            {
              onSuccess: async (res) => {
                try {
                  const txDigest = res.digest;
                  await client.waitForTransactionBlock({
                    digest: txDigest,
                    timeout: 45000,
                  });
        
                  verifyCryptoPayment({
                    txDigest,
                    planId: plan_id,
                    chain: 'sui',
                  });
                } catch (err) {
                  console.error('⛔️ Error waiting for tx confirmation:', err);
                  alert('Tip sent but confirmation failed.');
                }
              },
              onError: (err) => {
                const message = err?.message || '';
                const isRejected =
                  message.includes('-4005') ||
                  message.includes('UserRejectionError') ||
                  message.toLowerCase().includes('user rejection');
        
                if (isRejected) {
                  console.log('🛑 User rejected the transaction.');
                  return;
                }
        
                console.error('❌ Transaction failed:', err);
                alert('Transaction failed. Please try again.');
              },
            }
          );
        } catch (err) {
          // catches any uncaught promise rejections in the call itself
          const message = err?.message || '';
          if (
            message.includes('-4005') ||
            message.includes('UserRejectionError') ||
            message.toLowerCase().includes('user rejection')
          ) {
            console.log('🛑 User rejected transaction before confirmation modal.');
            return;
          }
        
          console.error('❌ Unexpected error submitting transaction:', err);
          alert('Something went wrong. Please try again.');
        }
  
        return;
      }
  
      // 2. Ethereum
      if (evmAddress && window.ethereum) {
        const { address, decimals } = tokenConfig.ethereum;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const erc20 = new ethers.Contract(
          address,
          ['function transfer(address to, uint256 amount) public returns (bool)'],
          signer
        );
  
        const smallest = ethers.utils.parseUnits(amount.toString(), decimals);
        const tx = await erc20.transfer(recipient, smallest);
        await tx.wait();
  
        onSuccess?.(tx);
        return;
      }
  
      // 3. Solana - Not implemented
      if (solanaAddress && window.solana) {
        console.warn('Solana transfer not yet implemented');
        onFailure?.(new Error('Solana stablecoin transfer not implemented'));
        return;
      }
  
      // 4. No wallet connected
      modal.open({ view: 'Connect' });
    } catch (err) {
      console.error('❌ Payment error:', err);
      alert(err?.message || 'Unexpected payment error');
      onFailure?.(err);
    }
  };
  
  
  return (
    <button
      onClick={handlePayment}
      className={`py-2 px-2 rounded-md mb-4 font-medium bg-blue-600 text-white hover:brightness-110`}
    >
      {children}
    </button>
  );
}
