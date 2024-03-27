import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from '../components/AuthComponents'
import GithubButton from '../components/GithubButton'
import { auth } from '../firebase'

export default function Login() {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (isLoading || !formData.email.trim() || !formData.password.trim()) return

    try {
      setIsLoading(true)
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
      navigate('/')
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Title>Log into 𝕏</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          onChange={handleChange}
          name='email'
          value={formData.email}
          placeholder='Email'
          type='email'
          required
        />
        <Input
          onChange={handleChange}
          name='password'
          value={formData.password}
          placeholder='Password'
          type='password'
          required
        />
        <Input type='submit' value={isLoading ? 'Loading...' : 'Log in'} />
      </Form>
      {error && <Error>{error}</Error>}
      <Switcher>
        Don't have an account?{' '}
        <Link to='/create-account'>Create one &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  )
}
