import axios from 'axios'
import { FormEvent, useState } from 'react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await axios.post('/api/users/signup', { email, password })
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
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
