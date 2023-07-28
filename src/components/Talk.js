import React, { useState } from 'react'
import { updateDoc, deleteDoc, doc } from '@firebase/firestore'
import { dbService } from 'fBase'
 
const Talk = ({ talkObj: { id, text }, isOwner }) => {
  const [editing, setEditing] = useState(false)
  const [newTalk, setNewTalk] = useState(text)
 
  const OnClickDelete = async () => {
    const ok = window.confirm('Are you sure you want to delete this talk?')
    if (ok) {
      await deleteDoc(doc(dbService, `talks/${id}`))
    }
  }
 
  const toggleEditing = () => {
    setEditing((prevEditing) => !prevEditing)
  }
 
  const OnChange = (e) => {
    const {
      target: { value },
    } = e
    setNewTalk(value)
  }
 
  const OnSubmit = async (e) => {
    e.preventDefault()
    await updateDoc(doc(dbService, `talks/${id}`), {
      text: newTalk,
    })
    setEditing(false)
  }
 
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={OnSubmit}>
            <input type="text" placeholder="Edit your talk" value={newTalk} required onChange={OnChange} />
            <input type="submit" value="Update Talk" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <h4>{text}</h4>
      )}
      {isOwner && (
        <>
          <button onClick={OnClickDelete}>Delete Talk</button>
          <button onClick={toggleEditing}>Edit Talk</button>
        </>
      )}
    </div>
  )
}
 
export default Talk;