import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://placement-cell-iczn.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance