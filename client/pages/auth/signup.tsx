import { FormEvent, useState } from 'react'
import { useRequest } from '../../hooks/useRequest'

export type IResponseErrors = {
  message: string
  field?: string
}

export interface IPayload {
  id: string
  email: string
}

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest<any, any>({
    method: 'post',
    url: '/api/users/signup',
    body: { email, password },
  })
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    doRequest()
  }
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h2 className="my-2 text-lg font-semibold text-blue-700">Sign Up</h2>
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
          Submit
        </button>
      </form>
    </div>
  )
}
