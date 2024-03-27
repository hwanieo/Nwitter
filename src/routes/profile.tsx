import { updateProfile } from 'firebase/auth'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ITweet } from '../components/Timeline'
import Tweet from '../components/Tweet'
import { auth, db, storage } from '../firebase'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  overflow-y: hidden;
  scrollbar-width: none;
`

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`
const AvatarInput = styled.input`
  display: none;
`
const Name = styled.span`
  font-size: 22px;
`

const EditNameButton = styled.button`
  border: none;
  outline: none;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: cornflowerblue;
  color: white;
  cursor: pointer;
`

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

export default function Profile() {
  const user = auth.currentUser

  const [avatar, setAvatar] = useState(user?.photoURL)
  const [tweets, setTweets] = useState<ITweet[]>([])
  const [nickname, setNickname] = useState(user?.displayName)
  const [isEdit, setIsEdit] = useState(false)

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (!user) return
    if (files && files.length === 1) {
      const file = files[0]
      const locationRef = ref(storage, `avatars/${user?.uid}`)
      const result = await uploadBytes(locationRef, file)
      const avatarUrl = await getDownloadURL(result.ref)
      setAvatar(avatarUrl)
      await updateProfile(user, { photoURL: avatarUrl })
    }
  }

  const handleClickEditButton = async () => {
    if (!user) return

    try {
      await updateProfile(user, { displayName: nickname })
    } catch (e) {
      console.log(e)
    } finally {
      //
    }
    setNickname('')
    setIsEdit(false)
  }

  const fetchTWeets = async () => {
    const tweetsQuery = query(
      collection(db, 'tweets'),
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc'),
      limit(25)
    )
    const snapshot = await getDocs(tweetsQuery)

    const userTweets = snapshot.docs.map((doc) => {
      const { tweet, username, userId, createdAt, photo } = doc.data()
      return { tweet, username, userId, createdAt, photo, id: doc.id }
    })
    setTweets(userTweets)
  }

  useEffect(() => {
    fetchTWeets()
  }, [])

  return (
    <Wrapper>
      <ProfileWrapper>
        <AvatarUpload htmlFor='avatar'>
          {avatar ? (
            <AvatarImg src={avatar} />
          ) : (
            <svg
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path d='M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z' />
            </svg>
          )}
        </AvatarUpload>
        <AvatarInput
          onChange={handleAvatarChange}
          id='avatar'
          type='file'
          accept='image/*'
        />

        {!isEdit ? (
          <>
            <Name>{user?.displayName ? nickname : 'Anonymouse'}</Name>
            <EditNameButton onClick={() => setIsEdit(true)}>
              변경
            </EditNameButton>
          </>
        ) : (
          <>
            <input onChange={(e) => setNickname(e.target.value)} />
            <EditNameButton onClick={handleClickEditButton}>
              수정
            </EditNameButton>
          </>
        )}
      </ProfileWrapper>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  )
}
