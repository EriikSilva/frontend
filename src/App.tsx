import './App.css'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './pages/home'
import Header from './components/Header'
import Products from './pages/products'
import Login from './pages/login'
import Productions from './pages/productions/productions'

function App() {
  return (
    <BrowserRouter>
       <Header/>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path='/productions' element={<Productions/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
