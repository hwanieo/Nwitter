import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { auth, db, storage } from '../firebase'
import { ITweet } from './Timeline'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`

const EditPayload = styled.textarea`
  display: block;
  background-color: black;
  border: none;
  outline: none;
  color: white;
  resize: none;
  font-size: 18px;
`

const EditButton = styled.button`
  background-color: cornflowerblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
`

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [isLoading, setIsLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editText, setEditText] = useState(tweet)

  const user = auth.currentUser

  const handleRemoteTweet = async () => {
    if (!user || user.uid !== userId) return

    try {
      setIsLoading(true)
      await deleteDoc(doc(db, 'tweets', id))

      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`)
        await deleteObject(photoRef)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value)
  }

  const handleEditSubmitButton = async () => {
    if (!user || user.uid !== userId) return

    try {
      setIsLoading(true)
      await updateDoc(doc(db, 'tweets', id), { tweet: editText })
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
    setIsEdit(false)
  }
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>

        {isEdit ? (
          <EditPayload
            rows={1}
            cols={50}
            value={editText}
            defaultValue={editText}
            onChange={handleChange}
            required
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}

        {user?.uid === userId ? (
          <>
            {isEdit ? (
              <EditButton onClick={handleEditSubmitButton}>Submit</EditButton>
            ) : (
              <EditButton onClick={() => setIsEdit(true)}>Edit</EditButton>
            )}

            <DeleteButton onClick={handleRemoteTweet}>
              {isLoading ? 'Loading...' : 'Delete'}
            </DeleteButton>
          </>
        ) : null}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  )
}
