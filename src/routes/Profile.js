import { React, useEffect, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { dbService } from "../firebase";

function Profile({ refreshUser, userObj }) {
  const auth = getAuth();
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayname);
  const onLogOutClick = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error.message);
      });
    history.push("/");
  };

  const getMyTweets = async () => {
    //3. 트윗 불러오기
    //3-1. dbService의 컬렉션 중 "nweets" Docs에서 userObj의 uid와 동일한 creatorID를 가진 모든 문서를 내림차순으로 가져오는 쿼리(요청) 생성
    const tweet = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
    );

    //3-2. getDocs()메서드로 쿼리 결과 값 가져오기
    const querySnapshot = await getDocs(tweet);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(getAuth().currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <>
        <form onSubmit={onSubmit} className="profileForm">
          <input
            type="text"
            autoFocus
            placeholder="Display name"
            onChange={onChange}
            value={newDisplayName}
            className="formInput"
          />
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
      </>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;
