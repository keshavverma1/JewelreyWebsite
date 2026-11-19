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
import TermsAndConditions from "./Pages/TermsAndConditions";
import CartDrawer from "./components/CartDrawer"
import Disclaimer from "./Pages/Disclaimer";
import OtpVerification from "./Pages/OtpVerification";
import toast, { Toaster } from 'react-hot-toast';
import ForgetPasswordOne from "./ForgetPages/ForgetPasswordOne";
import ForgetPasswordTwo from "./ForgetPages/ForgetPasswordTwo";
import ResetPassowrd from "./ForgetPages/ResetPassowrd";
function App() {
  const [loading, setLoading] = useState(true);
  const { wishOpen, setWishOpen , cartOpen, setCartOpen } = React.useContext(Auth);

  const path = useLocation().pathname;
  setTimeout(() => {
    setLoading(false);
  }, 3000);

  if (loading) {
    return <PKLoader />;
  }
  return (
    <>
    <Toaster />
    
      <ScrollToTop></ScrollToTop>
      {path !== "/Signup" && path !== "/Login"  && path !== "/ForgetPasswordOne" && path !== "/ForgetPasswordTwo" && path !== "/reset-password" &&  path !== "/otp-verification" && (
        <Navbar setWishOpen={setWishOpen} />
      )}

      <WishlistDrawer open={wishOpen} onClose={() => setWishOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Routes>
        <Route path="/" element={<Hero />} />
        {/* Main Categories */}
        <Route path="/all-jewellery" element={<CategoryPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:sku/:id" element={<ProductDetails />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/ForgetPasswordOne" element={<ForgetPasswordOne />} />
        <Route path="/ForgetPasswordTwo" element={<ForgetPasswordTwo />} />
        <Route path="/reset-password" element={<ResetPassowrd></ResetPassowrd>} />
       
      </Routes>
      {path !== "/Signup" && path !== "/Login"  && path !== "/ForgetPasswordOne" && path !== "/ForgetPasswordTwo" && path !== "/reset-password" && path !== "/otp-verification" && <Footer />}
    </>
  );
}

export default App;
