import { http, HttpResponse } from 'msw'
import { accounts, transactions } from './data'

let accountsState = [...accounts]
let transactionsState = [...transactions]
let nextId = transactionsState.length + 1

export const handlers = [
  http.get('/accounts', () => HttpResponse.json(accountsState)),

  http.get('/transactions', ({ request }) => {
    const url = new URL(request.url)
    const sort = url.searchParams.get('_sort')
    const sorted = [...transactionsState]
    if (sort === '-date') {
      sorted.sort((a, b) => b.date.localeCompare(a.date))
    }
    return HttpResponse.json(sorted)
  }),

  http.post('/transactions', async ({ request }) => {
    const body = await request.json()
    const transaction = { id: String(nextId++), ...body }
    transactionsState = [transaction, ...transactionsState]
    return HttpResponse.json(transaction, { status: 201 })
  }),

  http.patch('/accounts/:id', async ({ request, params }) => {
    const body = await request.json()
    accountsState = accountsState.map((account) =>
      account.id === params.id ? { ...account, ...body } : account,
    )
    return HttpResponse.json(accountsState.find((account) => account.id === params.id))
  }),
]
