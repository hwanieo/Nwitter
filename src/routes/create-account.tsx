import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from '../components/auth-components'
import GithubButton from '../components/github-button'
import { auth } from '../firebase'

export default function CreateAccount() {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
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

    if (
      isLoading ||
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    )
      return

    try {
      setIsLoading(true)
      const credentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      await updateProfile(credentials.user, { displayName: formData.name })
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
      <Title>Join 𝕏</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          onChange={handleChange}
          name='name'
          value={formData.name}
          placeholder='Name'
          type='text'
          required
        />
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
        <Input
          type='submit'
          value={isLoading ? 'Loading...' : 'Create Account'}
        />
      </Form>
      {error && <Error>{error}</Error>}
      <Switcher>
        Already have an account? <Link to='/login'>Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  )
}
