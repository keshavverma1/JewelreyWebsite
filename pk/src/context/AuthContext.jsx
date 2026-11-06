
import { createContext, useEffect, useState } from "react";

export const Auth = createContext();
import api from "../api/api"; // apne actual path se replace karo

function AuthContext({ children }) {
  const [user, setUser] = useState(null);
  const [productsHome, setProductsHome] = useState([]);

useEffect(() => {
  const fetchproductsforhome = async () => {
    try {
      const response = await api.get(
        `/api/products/p1/ladies-rings-1-100`
      );

      const products = response.data.products;

      setProductsHome(products.slice(4, 8));

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchproductsforhome();
}, []);

  

  return (
    <Auth.Provider value={{ user, setUser, productsHome, setProductsHome }}>
      {children}
    </Auth.Provider>
  );
}

export { AuthContext };
