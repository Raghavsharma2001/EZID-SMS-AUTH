import { useState, useEffect } from "react";
import axios from "axios";
import "./profile.styles.scss";
import { useContext } from "react";

import { UserContext } from "../../context/user.context";
import { useNavigate } from "react-router-dom";
const getDataEndpoint = "http://localhost:5002/api/get-data";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const toggleIsUserLoggedIn = () => setIsLoggedIn(!isLoggedIn);

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios
          .get(getDataEndpoint, {
            withCredentials: true,
          })
          .then((res) => {
            setData(res.data);
            setLoading(false);
          })
          .catch((error) => {
            const message = error.response.data.error_msg;
            console.log(message);
            throw new Error(message);
          });
      } catch (err) {
        const error = err.message;

        await setErrorMessage(error);
        if (isLoggedIn === true) {
          setIsLoggedIn(false);
        }
        navigate("/", {
          state: { color: "danger", message: "Unauthorized" },
        });
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <div className="loading">Loading...</div>
  ) : (
    <div className="data-wrapper">
      <div className="data-item">
        <label>First Name:</label>
        <span>{data.firstName}</span>
      </div>
      <div className="data-item">
        <label>Last Name:</label>
        <span>{data.lastName}</span>
      </div>
      <div className="data-item">
        <label>Phone Number:</label>
        <span>{data.phoneNumber}</span>
      </div>
    </div>
  );
};
