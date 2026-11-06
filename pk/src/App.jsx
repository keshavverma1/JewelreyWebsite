import { useState } from 'react'
import './App.css'
import PKLoader from './SmallComponents/PKLoader'
import Navbar from './components/Navbar'
import Hero from './Pages/Hero'
import Footer from './Pages/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import CategoryPage from './Pages/CategoryPages'
import ProductDetails from './Pages/ProductDetails'
import ScrollToTop from './SmallComponents/ScrollToTop'
function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  setTimeout(() => {
    setLoading(false)
  }, 3000)

  if (loading) {
    return <PKLoader />
  }
  return (
   <>
    <BrowserRouter>
   <ScrollToTop></ScrollToTop>
   <Navbar></Navbar>
   
      <Routes>
        <Route path="/" element={<Hero />} />

        {/* Main Categories */}
        <Route path="/all-jewellery" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:sku/:id" element={<ProductDetails />} />




      </Routes>

   <Footer></Footer>
       </BrowserRouter>

   </>
  )
}

export default App
