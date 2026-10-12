import './App.css'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
