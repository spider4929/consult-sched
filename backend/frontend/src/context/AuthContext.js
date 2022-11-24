import { createContext, useReducer, useEffect, useState } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [ selectedChat, setSelectedChat] = useState();
  const [ username, setUsername ] = useState('');
  const [chats, setChats] = useState([]);
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({ type: 'LOGIN', payload: user})
    }
    
  }, [])
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch, selectedChat, setSelectedChat, chats, setChats, username, setUsername }}>
      { children }
    </AuthContext.Provider>
  )

}