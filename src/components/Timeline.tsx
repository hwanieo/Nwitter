import { Unsubscribe } from 'firebase/auth'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { db } from '../firebase'
import Tweet from './tweet'

export interface ITweet {
  id: string
  photo?: string
  tweet: string
  userId: string
  username: string
  createdAt: number
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, 'tweets'),
        orderBy('createdAt', 'desc'),
        limit(25)
      )
      /*const tweetsQuery = query(
      collection(db, 'tweets'),
      orderBy('createdAt', 'desc')
      )

      const spanshot = await getDocs(tweetsQuery)
      const tweets = spanshot.docs.map((doc) => {
        const { tweet, username, userId, createdAt, photo } = doc.data()
        return { tweet, username, userId, createdAt, photo, id: doc.id }
      })*/

      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, username, userId, createdAt, photo } = doc.data()
          return { tweet, username, userId, createdAt, photo, id: doc.id }
        })
        setTweets(tweets)
      })
    }

    fetchTweets()

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  )
}
