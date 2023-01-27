import { useReducer } from "react";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = { isLoggedIn, setIsLoggedIn };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
