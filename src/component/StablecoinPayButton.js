'use client';

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { modal } from '../context/WalletContext';
import { Transaction } from '@mysten/sui/transactions';
import { useSelector, useDispatch } from 'react-redux';
import { setUserData } from "../../src/redux/slices/user";
import { useQuery, useMutation } from 'react-query';
import { FANTV_API_URL } from "../constant/constants";
import fetcher from "../dataProvider";

// Setup SUI client
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

const STABLECOIN_CONFIG = {
  USDC: {
    sui: {
      coinType: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
      decimals: 6,
      pay_recipient: '0xc2bb2fb23effeff61b34230849f17d5a53bb12f480f9850b6b64dee3dbbd5dc8'
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const { mutate: verifyCryptoPayment } = useMutation(
    (obj) => fetcher.post(`${FANTV_API_URL}/verify-crypto-payment`, obj),
    {
      onSuccess: async (response) => {
        console.log('✅ Verified on backend:', response);
        refetch();
        setIsLoading(false);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);

      },
      onError: (error) => {
        console.log('❌ Error in verifyCryptoPayment:', error);
        alert(`Something went wrong. ${error}`);
        setIsLoading(false);
      },
    }
  );

  // const handlePayment = async () => {
  //   const tokenConfig = STABLECOIN_CONFIG[tokenType];
  //   if (!tokenConfig) {
  //     alert(`Unsupported token: ${tokenType}`);
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);

  //     if (suiAccount?.address) {
  //       const { coinType, decimals, pay_recipient } = tokenConfig.sui;
  //       const { data: coins } = await client.getCoins({
  //         owner: suiAccount.address,
  //         coinType,
  //       });

  //       if (!coins.length) {
  //         alert(`No ${tokenType} in SUI wallet`);
  //         setIsLoading(false);
  //         return;
  //       }

  //       const tx = new Transaction();
  //       const smallestAmount = BigInt(amount * 10 ** decimals);
  //       const [coin] = tx.splitCoins(coins[0].coinObjectId, [smallestAmount]);
  //       tx.transferObjects([coin], pay_recipient);

  //       try {
  //          signAndExecuteTransaction(
  //           {
  //             transaction: tx,
  //             chain: 'sui:mainnet',
  //           },
  //           {
  //             onSuccess: async (res) => {
  //               try {
  //                 const txDigest = res.digest;
  //                 await client.waitForTransactionBlock({
  //                   digest: txDigest,
  //                   timeout: 45000,
  //                 });

  //                 verifyCryptoPayment({
  //                   tx_digest: txDigest,
  //                   chain: 'sui',
  //                   plan_id: plan_id,
  //                 });
  //               } catch (err) {
  //                 console.error('⛔️ Error waiting for tx confirmation:', err);
  //                 alert('Tip sent but confirmation failed.');
  //                 setIsLoading(false);
  //               }
  //             },
  //             onError: (err) => {
  //               const message = err?.message || '';
  //               const isRejected =
  //                 message.includes('-4005') ||
  //                 message.includes('UserRejectionError') ||
  //                 message.toLowerCase().includes('user rejection');

  //               if (isRejected) {
  //                 console.log('🛑 User rejected the transaction.');
  //               } else {
  //                 console.error('❌ Transaction failed:', err);
  //                 alert('Transaction failed. Please try again.');
  //               }
  //               setIsLoading(false);
  //             },
  //           }
  //         );
  //       } catch (err) {
  //         const message = err?.message || '';
  //         if (
  //           message.includes('-4005') ||
  //           message.includes('UserRejectionError') ||
  //           message.toLowerCase().includes('user rejection')
  //         ) {
  //           console.log('🛑 User rejected transaction before confirmation modal.');
  //           setIsLoading(false);
  //           return;
  //         }

  //         console.error('❌ Unexpected error submitting transaction:', err);
  //         alert('Something went wrong. Please try again.');
  //         setIsLoading(false);
  //       }

  //       return;
  //     }

  //     if (evmAddress && window.ethereum) {
  //       const { address, decimals } = tokenConfig.ethereum;
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       const signer = provider.getSigner();
  //       const erc20 = new ethers.Contract(
  //         address,
  //         ['function transfer(address to, uint256 amount) public returns (bool)'],
  //         signer
  //       );

  //       const smallest = ethers.utils.parseUnits(amount.toString(), decimals);
  //       const tx = await erc20.transfer(recipient, smallest);
  //       await tx.wait();

  //       setIsLoading(false);
  //       setIsSuccess(true);

  //       setTimeout(() => {
  //         setIsSuccess(false);
  //       }, 3000);

  //       onSuccess?.(tx);
  //       return;
  //     }

  //     if (solanaAddress && window.solana) {
  //       console.warn('Solana transfer not yet implemented');
  //       onFailure?.(new Error('Solana stablecoin transfer not implemented'));
  //       setIsLoading(false);
  //       return;
  //     }

  //     modal.open({ view: 'Connect' });
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error('❌ Payment error:', err);
  //     alert(err?.message || 'Unexpected payment error');
  //     setIsLoading(false);
  //     onFailure?.(err);
  //   }
  // };

  const handlePayment = async () => {
    const tokenConfig = STABLECOIN_CONFIG[tokenType];
    if (!tokenConfig) {
      alert(`Unsupported token: ${tokenType}`);
      return;
    }
  
    try {
      setIsLoading(true);
  
      // 1. Handle SUI payment
      if (suiAccount?.address) {
        const { coinType, decimals, pay_recipient } = tokenConfig.sui;
        const { data: coins } = await client.getCoins({
          owner: suiAccount.address,
          coinType,
        });
  
        if (!coins.length) {
          alert(`No ${tokenType} in SUI wallet`);
          setIsLoading(false);
          return;
        }
  
        const tx = new Transaction();
        const smallestAmount = BigInt(amount * 10 ** decimals);
        const [coin] = tx.splitCoins(coins[0].coinObjectId, [smallestAmount]);
        tx.transferObjects([coin], pay_recipient);
  
        // 🔒 Wrap in try/catch to handle TRPCClientError thrown immediately
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
                    tx_digest: txDigest,
                    chain: 'sui',
                    plan_id: plan_id,
                  });
                } catch (err) {
                  console.error('⛔️ Error waiting for tx confirmation:', err);
                  alert('Tip sent but confirmation failed.');
                  setIsLoading(false);
                }
              },
              onError: (err) => {
                const message = err?.message || '';
                const isRejected =
                  message.includes('-4005') ||
                  message.includes('UserRejectionError') ||
                  message.toLowerCase().includes('user rejection') ||
                  message.toLowerCase().includes('user rejected');
  
                if (isRejected) {
                  console.log('🛑 User rejected the transaction.');
                } else {
                  console.error('❌ Transaction failed:', err);
                  alert('Transaction failed. Please try again.');
                }
                setIsLoading(false);
              },
            }
          );
        } catch (err) {
          const message = err?.message || '';
          const isRejected =
            message.includes('-4005') ||
            message.includes('UserRejectionError') ||
            message.toLowerCase().includes('user rejection') ||
            message.toLowerCase().includes('user rejected') ||
            message.toLowerCase().includes('trpcclienterror');
  
          if (isRejected) {
            console.log('🛑 User rejected transaction before confirmation modal.');
          } else {
            console.error('❌ Immediate transaction throw:', err);
            alert('Something went wrong. Please try again.');
          }
          setIsLoading(false);
        }
  
        return;
      }
  
      // 2. Handle Ethereum payment
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
  
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
  
        onSuccess?.(tx);
        return;
      }
  
      // 3. Solana placeholder
      if (solanaAddress && window.solana) {
        console.warn('Solana transfer not yet implemented');
        onFailure?.(new Error('Solana stablecoin transfer not implemented'));
        setIsLoading(false);
        return;
      }
  
      // 4. No wallet connected
      modal.open({ view: 'Connect' });
      setIsLoading(false);
    } catch (err) {
      console.error('❌ Payment error:', err);
      alert(err?.message || 'Unexpected payment error');
      setIsLoading(false);
      onFailure?.(err);
    }
  };
  
  return (
    <>
      <button
        onClick={handlePayment}
        className={`py-2 px-2 rounded-md mb-4 font-medium bg-blue-600 text-white hover:brightness-110`}
      >
        {children}
      </button>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white p-6 rounded-xl flex flex-col items-center shadow-lg">
            <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-700">Payment in progress...</p>
          </div>
        </div>
      )}

    {isSuccess && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white p-6 rounded-xl text-center shadow-lg relative">
          <button
            onClick={() => setIsSuccess(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
          <p className="text-green-600 text-xl font-semibold">✅ Payment Successful!</p>
        </div>
      </div>
    )}
    
    </>
  );
}
