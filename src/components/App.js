import AppRouter from "./Router";
import React, { useEffect, useState } from "react";
import { authService } from "../firebase";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        if (user.displayName === null) {
          await updateProfile(user, {
            displayName: "Not setted",
          });
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = getAuth().currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;
