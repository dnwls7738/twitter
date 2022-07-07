import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import AuthForm from "../components/AuthForm";

const Auth = () => {
  const onSocialClick = (event) => {
    const {
      target: { name },
    } = event;

    const auth = getAuth();
    const provider1 = new GoogleAuthProvider();
    const provider2 = new GithubAuthProvider();
    if (name === "google") {
      signInWithPopup(auth, provider1)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (name === "github") {
      signInWithPopup(auth, provider2)
        .then((result) => {
          const credential = GithubAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};
export default Auth;
