import './App.css'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
       <Header/>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
