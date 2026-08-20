import { useMemo, useState } from 'react'
import { formatCurrency, formatDate } from '../utils/format'
import { TransactionFilters } from './TransactionFilters'

export function TransactionList({ transactions, status }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((tx) => tx.category))).sort(),
    [transactions],
  )

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.merchant.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || tx.category === category
      return matchesSearch && matchesCategory
    })
  }, [transactions, search, category])

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-slate-200">Recent transactions</h2>
        <TransactionFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          categories={categories}
        />
      </div>

      <div className="mt-4 divide-y divide-slate-800">
        {status === 'loading' &&
          [0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse py-3">
              <div className="h-full rounded-lg bg-slate-800/60" />
            </div>
          ))}

        {status === 'error' && (
          <p className="py-6 text-sm text-rose-300">
            Couldn't load transactions. Is the mock API running?
          </p>
        )}

        {status === 'success' && filtered.length === 0 && (
          <p className="py-6 text-sm text-slate-500">No transactions match your filters.</p>
        )}

        {status === 'success' &&
          filtered.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-100">{tx.merchant}</p>
                <p className="text-xs text-slate-500">
                  {formatDate(tx.date)} &middot; {tx.category}
                </p>
              </div>
              <p
                className={`text-sm font-semibold ${tx.amount < 0 ? 'text-slate-200' : 'text-emerald-400'}`}
              >
                {tx.amount < 0 ? '-' : '+'}
                {formatCurrency(Math.abs(tx.amount))}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}
