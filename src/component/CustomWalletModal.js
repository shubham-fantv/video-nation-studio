'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  IconButton, List, ListItem, ListItemAvatar,
  Avatar, ListItemText, CircularProgress, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAppKitWallet } from '@reown/appkit-wallet-button/react';
import { useConnectWallet, useWallets } from '@mysten/dapp-kit';

const WALLET_OPTIONS = [
  { id: 'sui', name: 'SUI', icon: '/images/icons/sui-new.svg' },
  { id: 'walletConnect', name: 'WalletConnect', icon: '/images/icons/walletconnect.svg' },
  { id: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', name: 'MetaMask', icon: '/images/icons/metamask.svg' },
  { id: 'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393', name: 'Phantom', icon: '/images/icons/phantom.png' },
  { id: '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', name: 'Trust', icon: '/images/icons/trust.svg' },
  { id: '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709', name: 'OKX', icon: '/images/icons/okx.png' },
];

const SUI_SUPPORTED = ['Slush', 'Suiet', 'Martian', 'Surf', 'Ethos'];

export default function CustomWalletModal({ open, onClose }) {
  const [filter, setFilter] = useState('');
  const [connectingSui, setConnectingSui] = useState(false);
  const [suiWalletSelectorOpen, setSuiWalletSelectorOpen] = useState(false);

  const { isReady, isPending } = useAppKitWallet({
    onSuccess: onClose,
    onError: (err) => {
      if (err.message === 'Modal closed') {
        console.log('User cancelled wallet connect');
      } else {
        console.error('Wallet connect error', err);
      }
    }
  });

  const { mutate: connectWallet } = useConnectWallet();
  const wallets = useWallets();
  const suiWallets = wallets.filter(w => SUI_SUPPORTED.includes(w.name));

  const filtered = useMemo(
    () => WALLET_OPTIONS.filter(w => w.name.toLowerCase().includes(filter.toLowerCase())),
    [filter]
  );

  const handleClick = (id) => {
    if (id === 'sui') {
      if (suiWallets.length > 0) {
        setSuiWalletSelectorOpen(true);
      } else {
        alert('No supported SUI wallet found. Please install Suiet or Martian.');
      }
      return;
    }
    // fallback for EVM
    onClose();
    import('../context/WalletContext').then(({ modal }) => {
      modal.open({ view: 'Connect', namespace: 'eip155' });
    });
  };

  const handleSuiWalletSelect = (wallet) => {
    setConnectingSui(true);
    connectWallet(
      { wallet },
      {
        onSuccess: () => {
          setConnectingSui(false);
          setSuiWalletSelectorOpen(false);
          onClose();
        },
        onError: (err) => {
          if (err?.message?.toLowerCase().includes('user rejection')) {
            console.log('🛑 User rejected SUI wallet connection');
          } else {
            console.error(`❌ Failed to connect to ${wallet.name}`, err);
          }
          setConnectingSui(false);
          setSuiWalletSelectorOpen(false);
        },
      }
    );
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs"
        BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.3)' } }}
        PaperProps={{ sx: { position: 'fixed', top: '10%', right: '2%', width: 300 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Connect Wallet
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 2, pb: 3 }}>
          {!isReady ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <List disablePadding>
              {filtered.map(({ id, name, icon }) => (
                <ListItem key={id} button disabled={isPending || (id === 'sui' && connectingSui)}
                  onClick={() => handleClick(id)}
                  sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <ListItemAvatar>
                    <Box component="img" src={icon} alt={name} sx={{ width: 32, height: 32, objectFit: 'contain', bgcolor: 'transparent' }} />
                  </ListItemAvatar>
                  <ListItemText primary={name} primaryTypographyProps={{ fontWeight: 500 }} />
                  {(isPending || (id === 'sui' && connectingSui)) && <CircularProgress size={20} />}
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={suiWalletSelectorOpen} onClose={() => setSuiWalletSelectorOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Select a SUI Wallet</DialogTitle>
        <DialogContent>
          {suiWallets.length === 0 ? (
            <Box textAlign="center" py={3}>No supported wallets found.</Box>
          ) : (
            <List>
              {suiWallets.map((wallet) => (
                <ListItem
                  key={wallet.name}
                  button
                  onClick={() => handleSuiWalletSelect(wallet)}
                  disabled={connectingSui}
                  sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'grey.100' } }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={wallet.icon}
                      alt={wallet.name}
                      sx={{ width: 32, height: 32, objectFit: 'contain', bgcolor: 'transparent' }}
                      variant="square"
                    />
                  </ListItemAvatar>
                  <ListItemText primary={wallet.name} primaryTypographyProps={{ fontWeight: 500 }} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
