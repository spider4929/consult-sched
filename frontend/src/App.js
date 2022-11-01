import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuthContext } from './hooks/useAuthContext';
import { PrivateRoutes } from './components/PrivateRoutes';

// pages and components
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import ViewConsul from './pages/ViewConsul'
import CreateConsulStudent from './pages/CreateConsulStudent'
import ApproveConsulInstructor from './pages/ApproveConsulInstructor'
import Inbox from './pages/Inbox'
import Layout from './components/Layout'
import Register from './pages/Register'
import Login from './pages/Login'
import PrivateStudent from './components/PrivateStudent';
import PrivateTeacher from './components/PrivateTeacher';
// import Test from './pages/Test'

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
              <Route element={<PrivateRoutes/>}>
                <Route 
                  path="/profile" 
                  element ={<Profile/>}
                />
                <Route 
                  path="/" 
                  element ={<Dashboard />}
                />
                <Route 
                  path="/view-consultations"
                  element ={<ViewConsul />}
                /> 
                  <Route element={<PrivateStudent/>}>
                    <Route 
                      path="/create-consultation-student"
                      element ={<CreateConsulStudent />}
                    />
                  </Route>
                  <Route element={<PrivateTeacher/>}>
                    <Route 
                      path="/approve-consultation"
                      element ={<ApproveConsulInstructor />}
                    />
                  </Route>
                <Route 
                path="/inbox" 
                element={<Inbox />}
                />
              </Route>
              <Route 
                path="/register" 
                element={ !user ? <Register /> : <Navigate to=    "/"/> }
              />
              <Route 
                  path="/login" 
                  element={ !user ? <Login /> : <Navigate to="/"/> }
              />
              {/* <Route 
                  path="/test" 
                  element= {<Test />}
              /> */}
            </Routes>
          </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
