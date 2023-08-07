import React, { useEffect, useState } from "react";
import { authService, dbService } from "fBase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
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
    if(userObj.displayName !== newDisplayName){
      await updateProfile(authService.currentUser, { displayName: newDisplayName });
      refreshUser();
    }
  };

  const getMyTalks = async() => {
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
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName} 
          className="formInput"
        />
        <input 
          type="submit" 
          placeholder="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;