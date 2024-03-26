import styled from 'styled-components'
import Timeline from '../components/Timeline'
import PostTweetForm from '../components/post-tweet-form'

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  scrollbar-width: 0px;
  grid-template-rows: 1fr 5fr;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  )
}
