// components/CustomConnectButton.jsx
'use client'

import React, { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CustomWalletModal from './CustomWalletModal'

// helper to truncate long hex addresses
const truncateAddress = (addr = '') =>
  addr.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr

// Separate component for the initial Connect button and modal

function ConnectTrigger() {
    const [open, setOpen] = useState(false)
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
    )
  }
  
export default function CustomConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleDisconnect = () => {
    disconnect()
    handleClose()
  }

  // Not connected: show the connect button + modal trigger
  if (!isConnected) {
    return <ConnectTrigger />
  }

  // Connected: show "Connected" button that opens the menu
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
              {truncateAddress(address)}
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
  )
}


