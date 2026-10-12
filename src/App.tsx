import './App.css'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import Header from './components/Header'
import Products from './pages/products'

function App() {
  return (
    <BrowserRouter>
       <Header/>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
