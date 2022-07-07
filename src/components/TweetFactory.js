import React, { useState } from "react";
import { storageService, dbService } from "../firebase";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function TweetFactory({ userObj }) {
  const [attachment, setAttachment] = useState("");
  const [tweet, setTweet] = useState("");
  const onSubmit = async (event) => {
    if (tweet === "") {
      return;
    }
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      await uploadString(attachmentRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef));
    }
    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "tweets"), tweetObj);
    setTweet("");
    setAttachment("");
  };

  function onChange(event) {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setTweet(value);
  }
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => setAttachment("");
  return (
    <div>
      <>
        <form onSubmit={onSubmit} className="factoryForm">
          <div className="factoryInput__container">
            <input
              className="factoryInput__input"
              value={tweet}
              onChange={onChange}
              type="text"
              placeholder="What's on your mind?"
              maxLength={120}
            />
            <input
              type="submit"
              value="&rarr;"
              className="factoryInput__arrow"
            />
          </div>
          <label htmlFor="attach-file" className="factoryInput__label">
            <span>Add photos</span>
            <FontAwesomeIcon icon={faPlus} />
          </label>
          <input
            id="attach-file"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{
              opacity: 0,
            }}
          />

          {attachment && (
            <div className="factoryForm__attachment">
              <img
                src={attachment}
                style={{
                  backgroundImage: attachment,
                }}
              />
              <div className="factoryForm__clear" onClick={onClearAttachment}>
                <span>Remove</span>
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
          )}
        </form>
      </>
    </div>
  );
}

export default TweetFactory;
