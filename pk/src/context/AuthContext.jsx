
import React, { createContext, useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export const Auth = createContext();

function AuthContext({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [productsHome, setProductsHome] = useState([]);

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  const [wishOpen, setWishOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Check authentication on page refresh
  const isAuth = async () => {
    try {
      const response = await api.get("/api/user/isAuth");

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      console.log(
        "Auth Error:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  // Fetch home products
  useEffect(() => {
    const fetchproductsforhome = async () => {
      try {
        const response = await api.get(
          "/api/products/p1/ladies-rings-1-100"
        );

        const products = response.data.products || [];
        setProductsHome(products.slice(4, 8));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchproductsforhome();
  }, []);

  return (
    <Auth.Provider
      value={{
        user,
        setUser,
        loading,
        productsHome,
        setProductsHome,
        wishlist,
        setWishlist,
        wishOpen,
        setWishOpen,
        cartOpen,
        setCartOpen,
        navigate,
      }}
    >
      {children}
    </Auth.Provider>
  );
}

export { AuthContext };
