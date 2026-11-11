import { createContext, useCallback, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))

  const signIn = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  // Full reload so no data from the old session stays in the store
  const signOut = () => {
    localStorage.removeItem('token')
    window.location.href = '/'
  }

  const getToken = useCallback(async () => token, [token])

  return (
    <AuthContext.Provider value={{ isSignedIn: !!token, getToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
