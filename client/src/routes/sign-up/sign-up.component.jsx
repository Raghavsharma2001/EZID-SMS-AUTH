import FormInput from "../../component/form-input/form-input.component";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.css";
import Alert from "react-bootstrap/Alert";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { useContext } from "react";
import { UserContext } from "../../context/user.context";
import { useNavigate } from "react-router-dom";

import PhoneInput from "react-phone-number-input";

import "./sign-up.styles.scss";
const signupEndpoint = "http://localhost:5002/api/signup";
const verifyEndpoint = "http://localhost:5002/api/signup-auth";

function BorderExample() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
const hasWhitespace = new RegExp(/\s/);

const defaultFormField = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  smsOTP: "",
};

const defaultErrorMessage = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  smsOTP: "",
};

const SignUpPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const toggleIsUserLoggedIn = () => setIsLoggedIn(!isLoggedIn);
  const navigate = useNavigate();

  const [formField, setFormField] = useState(defaultFormField);
  const [apiError, setApiError] = useState("");
  const [phoneNumberSubmitted, setPhoneNumberSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [value, setValue] = useState();
  const [smsOtp, setSmsOtp] = useState("");

  const [error, setError] = useState(defaultErrorMessage);
  const { firstName, lastName, phoneNumber, smsOTP } = formField;

  const isValidInput = (value, id, label) => {
    if (hasWhitespace.test(value)) {
      setError({
        ...error,
        [id]: `${label} must not contain any  whitespace`,
      });
      return false;
    } else if (value.length > 200) {
      setError({
        ...error,
        [id]: `${label} must be less than 200 character`,
      });
      return false;
    }
    setError({
      ...error,
      [id]: "",
    });
    return true;
  };
  const onSubmitOTPhandler = async (event) => {
    event.preventDefault();
    if (JSON.stringify(error) !== JSON.stringify(defaultErrorMessage)) {
      alert(`Please fix up the invalid input`);
    } else {
      setLoading(true);
      await axios({
        method: "post",
        url: verifyEndpoint,
        withCredentials: true,
        data: {
          phoneNumber: formField.phoneNumber,
          firstName: formField.firstName,
          lastName: formField.lastName,
          login_id: loginId,
          otp: formField.smsOTP,
        },
      })
        .then((response) => {
          console.log(response);
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
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(error);
    console.log(defaultErrorMessage);

    if (JSON.stringify(error) !== JSON.stringify(defaultErrorMessage)) {
      alert(`Please fix up the invalid input`);
    } else {
      setLoading(true);
      await axios({
        method: "post",
        url: signupEndpoint,
        data: {
          phoneNumber: formField.phoneNumber,
          firstName: formField.firstName,
          lastName: formField.lastName,
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
        });
    }

    return;
  };

  const handleChange = async (event) => {
    const { name, value, id } = event.target;
    const { innerText } = event.target.nextElementSibling;
    console.log(innerText);
    await isValidInput(value, id, innerText);
    setFormField({ ...formField, [name]: value });
  };
  const handlePhoneChange = async (event) => {
    if (!event || isValidPhoneNumber(event) === false) {
      setError({
        ...error,
        phoneNumber: `Enter a valid Phone Number`,
      });
      console.log(error);
      return;
    } else {
      setError({
        ...error,
        phoneNumber: "",
      });
      setFormField({ ...formField, phoneNumber: event });

      return;
    }
  };

  return (
    <div>
      {phoneNumberSubmitted ? (
        <div className="sign-up-container">
          {apiError ? (
            <Alert variant="danger">
              <Alert.Heading>{apiError}</Alert.Heading>
            </Alert>
          ) : null}{" "}
          <h1> SMS OTP is sent to {phoneNumber}</h1>
          <form onSubmit={onSubmitOTPhandler}>
            <div className="signup-form">
              <PhoneInput
                placeholder="Enter phone number"
                international
                countryCallingCodeEditable={false}
                defaultCountry="AU"
                value={formField.phoneNumber}
                onChange={handlePhoneChange}
                minValue={2}
                disabled
              />
            </div>

            <FormInput
              label="First Name"
              type="text"
              onChange={handleChange}
              name="firstName"
              id="firstName"
              value={firstName}
              required
              disabled
            />

            <FormInput
              label="Last Name"
              type="text"
              onChange={handleChange}
              name="lastName"
              id="lastName"
              value={lastName}
              required
              disabled
            />

            <FormInput
              label="SMS OTP"
              type="text"
              maxlength="4"
              onChange={handleChange}
              name="smsOTP"
              id="smsOTP"
              value={smsOTP}
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
        <div className="sign-up-container">
          {apiError ? (
            <Alert variant="danger">
              <Alert.Heading>{apiError}</Alert.Heading>
            </Alert>
          ) : null}
          <h2>Don't have an account?</h2>
          <span>Sign up with SMS OTP</span>

          <form onSubmit={onSubmitHandler}>
            <div className="signup-form">
              <PhoneInput
                placeholder="Enter phone number"
                international
                countryCallingCodeEditable={false}
                defaultCountry="AU"
                value={formField.phoneNumber}
                onChange={handlePhoneChange}
                minValue={2}
              />
            </div>
            {error.phoneNumber && (
              <h1 className="error-message">
                <span className="danger">&#9888;</span>
                {error.phoneNumber}
              </h1>
            )}
            <FormInput
              label="First Name"
              type="text"
              onChange={handleChange}
              name="firstName"
              id="firstName"
              value={firstName}
              required
            />
            {error.firstName && (
              <h1 className="error-message">
                <span className="danger">&#9888;</span> {error.firstName}
              </h1>
            )}
            <FormInput
              label="Last Name"
              type="text"
              onChange={handleChange}
              name="lastName"
              id="lastName"
              value={lastName}
              required
            />
            {error.lastName && (
              <h1 className="error-message">
                <span className="danger">&#9888;</span> {error.lastName}
              </h1>
            )}

            {loading ? (
              <div className="loading-component">
                <Spinner animation="border" variant="dark" />
              </div>
            ) : (
              <button className="submit-button">Submit</button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
