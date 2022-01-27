import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { buildClient } from '../api/buildClient'
import { Header } from '../components/Header'
import { IUserPayload } from './auth/signup'

interface HomeProps {
  currentUser: IUserPayload | null
}

export default function Home({ currentUser }: HomeProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Ticketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header currentUser={currentUser} />
      <div className="container">
        <h1 className="my-4 text-2xl font-bold">
          You are {currentUser ? 'Signed In' : 'NOT Signed In'}
        </h1>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get('/api/users/currentuser')
  return {
    props: data,
  }
}
