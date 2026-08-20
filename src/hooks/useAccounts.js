import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'

export function useAccounts() {
  const [accounts, setAccounts] = useState([])
  const [status, setStatus] = useState('loading')

  const refetch = useCallback(() => {
    setStatus('loading')
    return api
      .get('/accounts')
      .then((res) => {
        setAccounts(res.data)
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { accounts, status, refetch }
}
