import React, { useState } from 'react';
import { updateDoc, deleteDoc, doc} from '@firebase/firestore';
import { deleteObject, ref } from '@firebase/storage';
import { dbService, storageService } from 'fBase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
 
const Talk = ({ talkObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTalk, setNewTalk] = useState(talkObj.text);
 
  const onClickDelete = async () => {
    const ok = window.confirm('Are you sure you want to delete this talk?')
    if (ok) {
      await deleteDoc(doc(dbService, `talks/${talkObj.id}`));
      await deleteObject(ref(storageService, talkObj.attachmentUrl));
    }
  };
 
  const toggleEditing = () => {
    setEditing((prevEditing) => !prevEditing)
  };
 
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, `talks/${talkObj.id}`), {
      text: newTalk,
    });
    setEditing(false);
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewTalk(value);
  }
 
  return (
    <div className="talk">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container talkEdit">
            <input
              type="text" 
              placeholder="Edit your talk" 
              value={newTalk} 
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input 
              type="submit" 
              value="Update Talk" 
              className="formBtn" 
            />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{talkObj.text}</h4>
          {talkObj.attachmentUrl && <img src={talkObj.attachmentUrl} />}
          {isOwner && (
            <div className="talk__actions">
              <span onClick={onClickDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
 
export default Talk;