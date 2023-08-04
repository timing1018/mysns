import React, { useEffect } from "react";
import { authService, dbService } from "fBase";
import { useHistory } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
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
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
};

export default Profile;