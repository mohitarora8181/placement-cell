import { useState, useEffect } from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../images/logo-pc.png'
import ChecklistIcon from '@mui/icons-material/Checklist'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${theme.palette.grey[400]}`,
  backgroundColor: alpha(theme.palette.common.white, 0.25),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.35),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(3),
  width: '50%',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

const LogoutButton = styled('button')(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#D32F2F',
  border: '1px solid #D32F2F',
  padding: '8px 16px',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'semibold',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    borderColor: '#B71C1C',
    color: '#B71C1C',
  },
}))

const NotifyButton = styled('button')(({ theme }) => ({
  backgroundColor: 'transparent',
  color: '#1976d2',
  border: '1px solid #1976d2',
  borderRadius: '5px',
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'semibold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    borderColor: '#1565c0',
    color: '#1565c0',
  },
}))

const AdminNav = ({ currentVal }) => {
  const navigate = useNavigate()

  const logOut = () => {
    const resp = confirm('Do you want to logout ?');
    if (resp) {
      localStorage.clear()
      navigate('/sign-in')
    }
  }

  const handleNotifyClick = () => {
    navigate('/admin/notify')
  }

  return (
    <Box sx={{ flexGrow: 1, zIndex: 500 }} className="sticky top-0 left-0 w-full bg-white border-b border-b-gray-50">
      <AppBar position='static' sx={{
        backgroundColor: '#FFF',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}>
        <Toolbar>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
          >
            <Link to='/admin'>
              <img className='h-20 mx-2' src={logo} alt='logo' />
            </Link>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
            <NotifyButton onClick={handleNotifyClick}>
              <NotificationsIcon sx={{ fontSize: 20, mr: 1 }} />
              Notify
            </NotifyButton>
            <LogoutButton onClick={logOut}>
              <LogoutIcon sx={{ fontSize: 20 }} />
              Log Out
            </LogoutButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default AdminNav