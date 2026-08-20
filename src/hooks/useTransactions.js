import { useCallback, useEffect, useState } from 'react'
import { api } from '../api/client'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [status, setStatus] = useState('loading')

  const refetch = useCallback(() => {
    setStatus('loading')
    return api
      .get('/transactions', { params: { _sort: 'date', _order: 'desc' } })
      .then((res) => {
        setTransactions(res.data)
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { transactions, status, refetch }
}
