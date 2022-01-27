import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRequest } from '../../hooks/useRequest'

export default function Signout() {
  const router = useRouter()
  const { doRequest } = useRequest({
    method: 'post',
    url: '/api/users/signout',
    body: {},
    onSuccess: () => router.push('/'),
  })
  useEffect(() => {
    doRequest()
  }, [])
  return <p>Signing You out ...</p>
}
