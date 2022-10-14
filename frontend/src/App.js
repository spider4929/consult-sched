import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuthContext } from './hooks/useAuthContext';

// pages and components
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import ViewConsul from './pages/ViewConsul'
import CreateConsulStudent from './pages/CreateConsulStudent'
import CreateConsulProf from './pages/CreateConsulProf'
import Inbox from './pages/Inbox'
import Layout from './components/Layout'
import Register from './pages/Register'
import Login from './pages/Login'

const theme = createTheme({
  palette: {
    primary: {
      main: "#81c784",
    },
    secondary: {
      main: "#A020F0"
    }
  },
  typography: {
    fontFamily: "Poppins"
  }
});

function App() {
  const { user } = useAuthContext()

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <Layout>
            <Routes>
              <Route 
                path="/profile" 
                element={ user ? <Profile /> : <Navigate to="/login"/> } 
              />
              <Route 
                path="/" 
                element={ user ? <Dashboard /> : <Navigate to="/login"/> }
              />
              <Route 
                path="/view-consultations" 
                element={ user ? <ViewConsul /> : <Navigate to="/login"/> }
              />
              <Route 
                path="/create-consultation-student" 
                element={ user && user.role === 1 ? <CreateConsulStudent /> : <Navigate to="/login"/> } 
              />
              <Route 
                path="/create-consultation-professor" 
                element={ user && user.role === 2 ? <CreateConsulProf /> : <Navigate to="/login"/> }
              />
              <Route 
                path="/inbox" 
                element={ user ? <Inbox /> : <Navigate to="/login"/> }
              />
              <Route 
                path="/register" 
                element={ !user ? <Register /> : <Navigate to="/"/> }
              />
                <Route 
                path="/login" 
                element={ !user ? <Login /> : <Navigate to="/"/> }
              />
            </Routes>
          </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
