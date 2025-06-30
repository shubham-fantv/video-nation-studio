'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAccount, useDisconnect as useEvmDisconnect } from 'wagmi';
import { useCurrentAccount, useDisconnectWallet as useSuiDisconnect, useWallets, useSignPersonalMessage } from '@mysten/dapp-kit';
import CustomWalletModal from './CustomWalletModal';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setToken, setUserData } from "../redux/slices/user";
import loginData from "../utils/login";
import { API_BASE_URL } from "../constant/constants";
import fetcher from "../dataProvider";
import useGTM from "../hooks/useGTM";

const truncateAddress = (addr = '') =>
  addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;

function ConnectTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          onClick={() => setOpen(true)}
          variant="contained"
          sx={{
            background: 'linear-gradient(90deg, #4e44ce 0%, #7f52ff 100%)',
            color: '#fff',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '16px',
            px: 3,
            py: 1.5,
            boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
            '&:hover': {
              background: 'linear-gradient(90deg, #4433cc 0%, #6f42c1 100%)',
              boxShadow: '0 6px 24px rgba(79, 70, 229, 0.4)',
            },
          }}
        >
          🔗 Connect Wallet
        </Button>
      </Box>
      <CustomWalletModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default function CustomConnectButton() {
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount();
  const { disconnect: disconnectEvm } = useEvmDisconnect();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();

  const suiAccount = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: disconnectSui } = useSuiDisconnect();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const dispatch = useDispatch();
  const { sendEvent, sendGTM } = useGTM();

  const { mutate: loginWalletApi } = useMutation(
    (obj) => fetcher.post(`${API_BASE_URL}/api/v1/auth/login-wallet`, obj),
    {
      onSuccess: (res) => {
        loginData(res.data.token, res.data.user.name, res.data.user.email, res.data.user.id);
        dispatch(setUserData(res.data.user));
        dispatch(setToken({
          accessToken: res.data.token,
          refreshToken: res.data.token,
          isLoggedIn: true,
        }));
        sendEvent({
          event: "signup_successful",
          email: res.data.user.email,
          name: res.data.user.name,
          signup_method: "Wallet",
        });
        sendGTM({
          event: "signup_successful",
          email: res.data.user.email,
          name: res.data.user.name,
          signup_method: "Wallet",
        });
      },
      onError: (error) => {
        alert(error?.response?.data?.message || 'Login failed');
      },
    }
  );

  useEffect(() => {
    console.log('login-data', suiAccount?.address, isEvmConnected, evmAddress, wallets)
    const runSuiLogin = async () => {
      if (!suiAccount?.address) return;
  
      try {
        const message = `Sign in to VideoNation at ${new Date().toISOString()}`;
        const encoded = new TextEncoder().encode(message);
        const { signature, bytes } = await signPersonalMessage({ message: encoded });
        const messageBase64 = Buffer.from(encoded).toString('base64');
        console.log('signature', signature)
        console.log('bytes', bytes)
        loginWalletApi({
          address: suiAccount.address,
          chain: 'sui',
          signature: signature,
          message:messageBase64,
        });
      } catch (err) {
        console.error('❌ SUI login failed:', err);
      }
    };
  


    const runEvmLogin = async () => {
      if (!isEvmConnected || !evmAddress || !window.ethereum?.request) return;
      try {
        const message = `Sign in to VideoNation at ${new Date().toISOString()}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, evmAddress],
        });

        loginWalletApi({
          address: evmAddress,
          chain: 'eip155:1',
          signature: signature.replace(/^0x/, ''),
          message,
        });
      } catch (err) {
        console.error('❌ EVM login failed:', err);
      }
    };

    if (suiAccount?.address) runSuiLogin();
    if (isEvmConnected && evmAddress) runEvmLogin();
  }, [suiAccount?.address, isEvmConnected, evmAddress, wallets]);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDisconnect = () => {
    if (isEvmConnected) disconnectEvm();
    if (suiAccount) disconnectSui();
    handleClose();
  };

  const connectedAddress = isEvmConnected ? evmAddress : suiAccount?.address || null;

  if (!isEvmConnected && !suiAccount) {
    return <ConnectTrigger />;
  }

  return (
    <Box>
      <Button
        onClick={handleButtonClick}
        variant="contained"
        sx={{
          background: 'linear-gradient(90deg, #4e44ce 0%, #7f52ff 100%)',
          color: '#fff',
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '16px',
          px: 3,
          py: 1.5,
          boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #4433cc 0%, #6f42c1 100%)',
            boxShadow: '0 6px 24px rgba(79, 70, 229, 0.4)',
          },
        }}
      >
        ✔️ Connected
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { mt: 1, minWidth: 200 } }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography
              variant="body2"
              sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
            >
              {truncateAddress(connectedAddress)}
            </Typography>
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDisconnect} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Disconnect</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
