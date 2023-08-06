import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fBase";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from "@firebase/firestore";
import Talk from "components/Talk";
import TalkFactory from "components/TalkFactory";

const Home = ({ userObj }) => {
  const [talks, setTalks] = useState([]);

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

  return (
    <div>
      <TalkFactory userObj={userObj} />
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