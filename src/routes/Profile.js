import React, { useEffect, useState } from "react";
import { authService, dbService } from "fBase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if(userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
    }
  };

  const getMyTalks = async() => {
  //   const talks = await dbService
  //     .collection("talks")
  //     .where("creatorId", "==", `${userObj.uid}`)
  //     .orderBy("createdAt")
  //     .get();
  //     console.log(talks.docs.map((doc) => doc.data()));
  // };
    const q = query(
      collection(dbService, "talks"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
      );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  useEffect(() => {
    getMyTalks();
  }, []);
  
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text" 
          placeholder="Display name"
          value={newDisplayName} 
        />
        <input type="submit" placeholder="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
};

export default Profile;