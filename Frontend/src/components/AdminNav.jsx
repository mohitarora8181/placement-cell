import { useState, useEffect } from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios' // Ensure axios is imported
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
  backgroundColor: '#D32F2F', // Red background
  color: '#FFF', // White text
  border: 'none',
  padding: theme.spacing(1, 3),
  borderRadius: theme.shape.borderRadius,
  fontSize: '16px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#B71C1C', // Darker red on hover
  },
}))
const NotifyButton = styled('button')(({ theme }) => ({
  backgroundColor: '#f50057', // Same color as the Log Out button (adjust as needed)
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#c51162', // Darker shade on hover
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
      <AppBar position='static' sx={{ backgroundColor: '#FFF' }}>
        <Toolbar>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ flexGrow: 1, display: {} }}
          >
            <Link to='/admin'>
              <img className='h-24 mx-2' src={logo} alt='logo' />
            </Link>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotifyButton onClick={handleNotifyClick}>
              🔔
            </NotifyButton>
            <LogoutButton onClick={logOut}>Log Out</LogoutButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default AdminNav
