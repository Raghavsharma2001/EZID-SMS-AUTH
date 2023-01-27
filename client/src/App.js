import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./App.css";
import axios from "axios";

import SignUpPage from "./routes/sign-up/sign-up.component";
import Navigation from "./component/navbar/navbar.component";
import SignInPage from "./routes/sign-in/sign-in.component";

import { ProfilePage } from "./routes/profile/profile.component";
import NotFound from "./routes/404/not-Found.component";
import { Logout } from "./routes/logout/logout.component";
import { Home } from "./routes/home/home.component";
function App() {
  // return <SignUpPage />;
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
