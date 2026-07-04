import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    setUserData(JSON.parse(sessionStorage.getItem("UserData")));
  }, []);

  return (
    <>
    
    
      <div className="w-24 h-24 rounded-full overflow-hidden">
        <img
          src={userData.photo}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};

export default UserDashboard;