'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog, DialogTitle, DialogContent, TextField, InputAdornment,
  IconButton, List, ListItem, ListItemAvatar,
  Avatar, ListItemText, CircularProgress, Box
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'
import {modal} from '../context/WalletContext'

const WALLET_OPTIONS = [
  { id: 'walletConnect', name: 'WalletConnect', icon: '/images/icons/wallet-connect.png' },
  { id: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',   name: 'MetaMask',      icon: '/images/icons/metamask.png' },
]

export default function CustomWalletModal({ open, onClose }) {
  const [filter, setFilter] = useState('')
  const { isReady, isPending, connect } = useAppKitWallet({
    onSuccess: onClose,
    onError: err => {
      if (err.message === 'Modal closed') {
        console.log('User cancelled wallet connect')
      } else {
        console.error('Wallet connect error', err)
      }
    }
  })

  const filtered = useMemo(
    () => WALLET_OPTIONS.filter(w =>
      w.name.toLowerCase().includes(filter.toLowerCase())
    ),
    [filter]
  )

  const handleClick = id => {
    console.log('Connecting wallet id:', id)
    onClose()
    // 
    modal.open({ view: 'Connect', namespace: 'eip155' })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs"
      BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.3)' } }}
      PaperProps={{ sx: { position: 'fixed', top: '10%', right: '2%', width: 300 } }}
    >
      <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        Connect Wallet
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px:2, pb:3 }}>
        <TextField
          fullWidth size="small"
          placeholder="Search wallets..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
          sx={{ mb:2 }}
        />

        {!isReady ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map(({ id, name, icon }) => (
              <ListItem key={id} button disabled={isPending}
                onClick={() => handleClick(id)}
                sx={{ borderRadius:1, mb:1, '&:hover': { bgcolor: 'grey.100' } }}
              >
                <ListItemAvatar>
                  <Avatar src={icon} sx={{ width:32, height:32 }} />
                </ListItemAvatar>
                <ListItemText primary={name} primaryTypographyProps={{ fontWeight:500 }} />
                {isPending && <CircularProgress size={20} />}
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}
