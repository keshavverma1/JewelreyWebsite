import React, { useState } from "react";
import "./App.css";
import PKLoader from "./SmallComponents/PKLoader";
import Navbar from "./components/Navbar";
import Hero from "./Pages/Hero";
import Footer from "./Pages/Footer";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import CategoryPage from "./Pages/CategoryPages";
import ProductDetails from "./Pages/ProductDetails";
import ScrollToTop from "./SmallComponents/ScrollToTop";
import WishlistDrawer from "./components/WishlistDrawer";
import { Auth } from "./context/AuthContext";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
function App() {
  const [loading, setLoading] = useState(true);
  const { wishOpen, setWishOpen } = React.useContext(Auth);
  const path = useLocation().pathname;
  setTimeout(() => {
    setLoading(false);
  }, 3000);

  if (loading) {
    return <PKLoader />;
  }
  return (
    <>
   
        <ScrollToTop></ScrollToTop>
        {path !== "/Signup" && path !== "/Login" && <Navbar setWishOpen={setWishOpen} />}
        <WishlistDrawer open={wishOpen} onClose={() => setWishOpen(false)} />
        <Routes>
          <Route path="/" element={<Hero />} />
          {/* Main Categories */}
          <Route path="/all-jewellery" element={<CategoryPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:sku/:id" element={<ProductDetails />} />
          <Route path="/Signup" element={<Signup />} />
           <Route path="/Login" element={<Login />} />
        </Routes>
      {path !== "/Signup" && path !== "/Login" && <Footer />}

    
    </>
  );
}

export default App;
