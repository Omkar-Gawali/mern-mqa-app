import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";
import { useAuth } from "../context/authContext";

const API_URL = process.env.REACT_APP_API_URL;

const UserRoute = () => {
  const [ok, setOk] = useState(false);
  const { auth } = useAuth(); // ✅ FIXED

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/verify-user`);
        setOk(res.data.ok);
      } catch (error) {
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="/" />;
};

export default UserRoute;
