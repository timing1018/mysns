import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "fBase";
import { collection, addDoc, serverTimestamp } from "@firebase/firestore";
import { uploadString, ref, getDownloadURL } from '@firebase/storage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TalkFactory = ({ userObj }) => {
  const [talk, setTalk] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async(e) => {
    if (talk === "") {
      return;
    }

    e.preventDefault();

    let attachmentUrl  = "";

    if (attachment !== "") {
      const fileRef  = ref(storageService, `${userObj.uid}/${uuidv4()}`);

      const response = await uploadString(fileRef, attachment, "data_url");
      console.log(response);
      
      attachmentUrl  = await getDownloadURL(response.ref);
    }

    const talkObj  = {
      text: talk,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    
    await addDoc(collection(dbService, "talks"), talkObj);

    setTalk("");
    setAttachment("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTalk(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0]
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => { setAttachment("") }

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input 
          className="factoryInput__input"
          value={talk} 
          onChange={onChange} 
          type="text" 
          placeholder="Please enter your message." 
          maxLength={120} 
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input 
        id="attach-file"
        onChange={onFileChange} 
        type="file" 
        accept="image/*"
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
  );
};

export default TalkFactory;