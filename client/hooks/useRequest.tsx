import axios, { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { IResponseErrors } from '../pages/auth/signup'

interface UseRequestProps<T, U> {
  method: 'get' | 'post' | 'delete' | 'put' | 'patch'
  url: string
  body?: U
  onSuccess?: (data: T) => void
}

export const useRequest = <T, U>({
  method,
  url,
  body,
  onSuccess,
}: UseRequestProps<T, U>) => {
  const [errors, setErrors] = useState<null | React.ReactChild>(null)
  const doRequest = async () => {
    setErrors(null)
    try {
      const { data } = await axios[method]<
        any,
        AxiosResponse<T, IResponseErrors[]>
      >(url, body)
      if (onSuccess) onSuccess(data)
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errs = err.response?.data.errors as IResponseErrors[]
        setErrors(
          <div className="mb-4 flex flex-col rounded-md bg-red-300 p-3">
            <h3 className="font-semibold">Ooops</h3>
            <ul className="my-0">
              {errs.map((err) => (
                <li className="text-sm" key={err.message}>
                  {err.message}
                </li>
              ))}
            </ul>
          </div>
        )
      }
      console.log(err)
    }
  }
  return { doRequest, errors }
}
