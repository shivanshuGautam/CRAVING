import React, { useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = () => {
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
};
