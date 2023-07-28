import React, { useState, useEffect } from "react";
import { dbService } from "fBase";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from "@firebase/firestore";
import Talk from "components/Talk";

const Home = ({ userObj }) => {
  const [talk, setTalk] = useState("");
  const [talks, setTalks] = useState([]);
  const [attachment, setAttachment] = useState();

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
    
      const docRef = await addDoc(collection(dbService, "talks"),{
      text: talk,
      createdAt: serverTimestamp(),
      creatorId: userObj.uid,
    });
    console.log('Document written with ID: ', docRef.id)
    setTalk("");
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

  const onClearAttachment = () => setAttachment(null);

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