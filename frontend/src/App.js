import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages and components
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import ViewConsul from './pages/ViewConsul'
import CreateConsulStudent from './pages/CreateConsulStudent'
import CreateConsulProf from './pages/CreateConsulProf'
import Inbox from './pages/Inbox'
import Layout from './components/Layout'

function App() {
  return (
    <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Dashboard />}/>
            <Route path="/view-consultations" element={<ViewConsul />}/>
            <Route path="/create-consultation-student" element={<CreateConsulStudent />} />
            <Route path="/create-consultation-professor" element={<CreateConsulProf />}/>
            <Route path="/inbox" element={<Inbox />}/>
          </Routes>
        </Layout>
    </BrowserRouter>
  );
}

export default App;
