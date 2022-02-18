import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { buildClient } from '../../api/buildClient'
import { Header } from '../../components/Header'
import { useRequest } from '../../hooks/useRequest'
import { IUserPayload } from './signup'

export default function SignIn({
  currentUser,
}: {
  currentUser: IUserPayload | null
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { doRequest, errors } = useRequest<any, any>({
    method: 'post',
    url: '/api/users/signin',
    body: { email, password },
    onSuccess: () => router.push('/'),
  })
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    doRequest()
  }
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <form onSubmit={onSubmit}>
          <h2 className="my-2 text-lg font-semibold text-blue-700">Sign In</h2>
          <div className="mb-4">
            <label className="mb-2 text-sm text-gray-900" htmlFor="email">
              Email
            </label>
            <input
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
              type="email"
              className="w-full rounded-md border border-gray-400 px-4 py-2"
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 text-sm text-gray-900" htmlFor="password">
              Password
            </label>
            <input
              value={password}
              onChange={({ target: { value } }) => setPassword(value)}
              type="password"
              className="w-full rounded-md border border-gray-400 px-4 py-2"
              placeholder="Password"
            />
          </div>
          {errors}
          <button
            type="submit"
            className="rounded-md border-0 bg-blue-600 p-2 text-white outline-none"
          >
            Sign In
          </button>
        </form>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')
  if (data.currentUser) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }
  }
  return {
    props: data,
  }
}
