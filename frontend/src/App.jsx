import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from './signin.jsx'
import Dashboard from './dashboard.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App