import React, { useState, useEffect } from "react";
import { dbService } from "fBase";
import { collection, query, onSnapshot, orderBy } from "@firebase/firestore";
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
    <div className="container">
      <TalkFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {talks.map((talk) => (
          <Talk 
            key={talk.id}
            talkObj={talk}
            isOwner={userObj && talk.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;