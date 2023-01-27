import FormInput from "../../component/form-input/form-input.component";
import { useState } from "react";
import { Spinner, Button } from "react-bootstrap";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import "./sign-in.styles.scss";
import "./phoneInputStyles.css";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";

import PhoneInput from "react-phone-number-input";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import { useNavigate } from "react-router-dom";
const loginEndpoint = "http://localhost:5002/api/login";

const verifyEndpoint = "http://localhost:5002/api/login-auth";

const SignInPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const toggleIsUserLoggedIn = () => setIsLoggedIn(!isLoggedIn);
  const navigate = useNavigate();

  const [phoneNumberSubmitted, setPhoneNumberSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [smsOtp, setSmsOtp] = useState("");

  const [phoneNumber, setPhoneNumber] = useState();

  const onSubmitOTPhandler = async (event) => {
    event.preventDefault();
    if (JSON.stringify(error) !== JSON.stringify("")) {
      alert(`Please fix up the invalid input`);
    } else {
      setLoading(true);
      await axios({
        method: "post",
        url: verifyEndpoint,
        withCredentials: true,
        data: {
          phoneNumber: phoneNumber,
          login_id: loginId,
          otp: smsOtp,
        },
      })
        .then((response) => {
          console.log("success");
          setPhoneNumberSubmitted(true);
          setLoading(false);
          toggleIsUserLoggedIn();
          navigate("/", {
            state: { color: "success", message: "Logged in" },
          });
        })
        .catch((err) => {
          if (err.response) {
            setApiError(err.response.data.error_msg);
            console.log(apiError);
            setLoading(false);
          } else {
            setLoading(false);
          }
          // console.log(error.response);
        });
    }

    return;
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(phoneNumber);

    if (JSON.stringify(error) !== JSON.stringify("")) {
      alert(`Please fix up the invalid input`);
    } else {
      setLoading(true);
      await axios({
        method: "post",
        url: loginEndpoint,
        data: {
          phoneNumber: phoneNumber,
        },
      })
        .then((response) => {
          setLoginId(response.data.login_id);
          setApiError("");
          setPhoneNumberSubmitted(true);
          setLoading(false);
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response.data);
            setApiError(err.response.data.error_msg);
            setLoading(false);
          } else {
            setLoading(false);
          }
          // console.log(error.response);
        });
    }

    return;
  };
  const handlePhoneChange = async (event) => {
    if (!event || isValidPhoneNumber(event) === false) {
      setError(`Enter a valid Phone Number`);
      // console.log(error);
      return;
    } else {
      setError("");
      setPhoneNumber(event);
      return;
    }
  };
  const handleChange = async (event) => {
    const { name, value, id } = event.target;
    const { innerText } = event.target.nextElementSibling;

    setSmsOtp(value);
  };
  return (
    <div>
      {phoneNumberSubmitted ? (
        <div className="sign-in-container">
          {apiError ? (
            <Alert variant="danger">
              <Alert.Heading>{apiError}</Alert.Heading>
            </Alert>
          ) : null}
          <h2>OTP Code has been sent to {phoneNumber}</h2>
          <form onSubmit={onSubmitOTPhandler}>
            <PhoneInput
              placeholder="Enter phone number"
              international
              countryCallingCodeEditable={false}
              defaultCountry="AU"
              value={phoneNumber}
              onChange={handlePhoneChange}
              minValue={2}
              disabled
            />
            <FormInput
              label="SMS OTP"
              type="text"
              maxlength="4"
              name="smsOTP"
              id="smsOTP"
              onChange={handleChange}
              value={smsOtp}
              required
            />
            {loading ? (
              <div className="loading-component">
                <Spinner animation="border" variant="dark" />
              </div>
            ) : (
              <button className="submit-button">Submit</button>
            )}
          </form>
        </div>
      ) : (
        <div className="sign-in-container">
          {apiError ? (
            <Alert variant="danger">
              <Alert.Heading>{apiError}</Alert.Heading>
            </Alert>
          ) : null}
          <h2>Sign in with SMS OTP</h2>

          <form onSubmit={onSubmitHandler}>
            <PhoneInput
              placeholder="Enter phone number"
              international
              countryCallingCodeEditable={false}
              defaultCountry="AU"
              value={phoneNumber}
              onChange={handlePhoneChange}
              minValue={2}
            />

            {error && (
              <h1 className="error-message">
                <span className="danger">&#9888;</span>
                {error}
              </h1>
            )}
            {loading ? (
              <div className="loading-component">
                <Spinner animation="border" variant="dark" />
              </div>
            ) : (
              <button className="submit-button"> submit</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
