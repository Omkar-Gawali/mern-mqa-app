import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Load auth from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("auth");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setAuth(parsed);

      // 👉 Set token globally for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
    }
  }, []);

  // Update axios token whenever auth changes
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = auth?.token;
  }, [auth.token]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
