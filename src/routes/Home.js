import React, { useState, useEffect } from "react";
import { dbService } from "fBase";
import { collection, addDoc, getDocs, query } from "firebase/firestore";

const Home = () => {
  const [talk, setTalk] = useState("");
  const [talks, setTalks] = useState([]);
  const getTalks =  async () => {
    const q = query(collection(dbService, "talks"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    const talkObj = {
    ...doc.data(),
    id: doc.id,
    }
    setTalks(prev => [talkObj, ...prev]);
    });
  };

  useEffect(() => {
    getTalks();
  }, []);

  const onSubmit = async(e) => {
    e.preventDefault();

    await addDoc(collection(dbService, "talks"),{
      talk,
      createAt: Date.now(),
    });
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
  console.log(talks);

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
        <input type="submit" value="talk" />
      </form>
      <div>
        {talks.map((talk) => (
          <div key={talk.id}>
            <h4>{talk.talk}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;