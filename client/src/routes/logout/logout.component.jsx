import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useContext } from "react";

import { UserContext } from "../../context/user.context";

import axios from "axios";
const logout = "http://localhost:5002/api/logout";

export const Logout = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const toggleIsUserLoggedIn = () => setIsLoggedIn(!isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    const getAuth = async () => {
      await axios
        .get(logout, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          console.log("success");
          toggleIsUserLoggedIn();
          navigate("/", {
            state: { color: "warning", message: "Logged out" },
          });
        })
        .catch((err) => {
          if (err.response) {
          }
        });
    };
    getAuth();
  }, []);
  return <div> hello</div>;
};
