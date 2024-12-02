import { Route, Routes, HashRouter, Navigate } from 'react-router-dom'

import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Home } from './pages/Home'

import { Layout } from '@/layouts/Layout'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  )
}

export default App