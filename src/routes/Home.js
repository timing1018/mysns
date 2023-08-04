import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fBase";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from "@firebase/firestore";
import Talk from "components/Talk";
import { uploadString, ref, getDownloadURL } from '@firebase/storage';
import { v4 as uuidv4 } from 'uuid';


const Home = ({ userObj }) => {
  const [talk, setTalk] = useState("");
  const [talks, setTalks] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    // 실시간으로 데이터를 데이터베이스에서 가져오기
 
    const q = query(collection(dbService, "talks"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const nextTalks = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      })
      setTalks(nextTalks);
    })
 
    return () => {
      unsubscribe()
    }
  }, []);

  const onSubmit = async(e) => {
    e.preventDefault();

    let attachmentUrl  = "";

    if (attachment !== "") {
      const fileRef  = ref(storageService, `${userObj.uid}/${uuidv4()}`);

      const response = await uploadString(fileRef, attachment, "data_url");
      console.log(response);
      
      attachmentUrl  = await getDownloadURL(response.ref);
    }

    const talkPosting  = {
      talk,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
      attachmentUrl ,
    };
    
    await addDoc(collection(dbService, "talks"), talkPosting);

    setTalk("");
    setAttachment("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTalk(value);
  };
  // const onChange = (e) => {
  //   setNweet(e.target.value);
  // };
  // console.log(talks);

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

  // const onClearAttachment = () => setAttachment(null);
  const onClearAttachment = () => { setAttachment("") }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
          value={talk} 
          onChange={onChange} 
          type="text" 
          placeholder="Please enter your message." 
          maxLength={120} 
        />
        <input onChange={onFileChange} type="file" accept="image/*" />
        <input type="submit" value="talk" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
          
        )}
      </form>
      <div>
        {talks.map((talk) => (
          <Talk 
            key={talk.id}
            talkObj={talk}
            isOwner={talk.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;