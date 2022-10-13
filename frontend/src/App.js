import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Dashboard />}/>
              <Route path="/view-consultations" element={<ViewConsul />}/>
              <Route path="/create-consultation-student" element={<CreateConsulStudent />} />
              <Route path="/create-consultation-professor" element={<CreateConsulProf />}/>
              <Route path="/inbox" element={<Inbox />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/login" element={<Login />}/>
            </Routes>
          </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
