require('dotenv').config()
export const authUsers = [
  {
    user: process.env.REACT_AUTH_USERNAME,
    password: process.env.REACT_AUTH_PASSWORD
  }
]