import React, { use, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // if (user) {
    //   setIsLoggedIn(true);
    // } else {
    //   setIsLoggedIn(false);
    // }
    setIsLoggedIn(!!user);
  }, [user]);

  const value = {
    user,setUser,isLoggedIn,setIsLoggedIn
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () =>  useContext(AuthContext);