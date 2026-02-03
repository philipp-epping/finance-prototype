import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ExplorationsPage from './pages/ExplorationsPage'
import FinancePrototype from './pages/FinancePrototype'
import ClientPortal from './pages/ClientPortal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ExplorationsPage />} />
        <Route path="/finance-prototype/*" element={<FinancePrototype />} />
        <Route path="/client-portal/*" element={<ClientPortal />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
