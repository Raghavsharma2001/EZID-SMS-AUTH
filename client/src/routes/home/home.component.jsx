import { useLocation } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import "./home.styles.scss";
import { useEffect } from "react";

import { useContext } from "react";

import { UserContext } from "../../context/user.context";

export const Home = () => {
  const location = useLocation();
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const toggleIsUserLoggedIn = () => setIsLoggedIn(!isLoggedIn);

  const checkState = "http://localhost:5002/api/checkstate";
  useEffect(() => {
    const getAuth = async () => {
      console.log("run");
      await axios
        .get(checkState, {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          setIsLoggedIn(false);
          console.log(err);
          if (err.response) {
            console.log(err.response.data);
          }
        });
    };

    getAuth();
  }, []);
  return (
    <div className="home-container">
      {location.state ? (
        <>
          <div className="alert-message">
            <Alert variant={location.state.color}>
              <Alert.Heading>{location.state.message}</Alert.Heading>
            </Alert>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="test">
        <h1 className="title">Welcome to my App!</h1>
        <p className="description">
          This app was made using SMS Authentication with EZID.io API.
        </p>
      </div>
    </div>
  );
};
