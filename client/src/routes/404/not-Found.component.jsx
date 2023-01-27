import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./not-found.styles.scss";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //   const history = useHistory();
  let message = location.state ? location.state.error : "Page not found";
  let back = location.state ? 3 : 1;

  const handleGoBack = () => {
    navigate(-back);
  };

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>{message}</h2>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
};

export default NotFound;
