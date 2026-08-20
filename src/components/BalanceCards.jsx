import { accountTypeLabel, formatCurrency } from '../utils/format'

const typeStyles = {
  checking: 'from-emerald-500/20 to-emerald-500/0 border-emerald-500/30',
  savings: 'from-sky-500/20 to-sky-500/0 border-sky-500/30',
  credit: 'from-rose-500/20 to-rose-500/0 border-rose-500/30',
}

export function BalanceCards({ accounts, status }) {
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
          />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
        Couldn't load your accounts. Is the mock API running?
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className={`rounded-2xl border bg-gradient-to-br p-5 ${typeStyles[account.type] ?? 'from-slate-800/40 to-slate-800/0 border-slate-700'}`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {accountTypeLabel(account.type)}
          </p>
          <h2 className="mt-1 text-sm font-semibold text-slate-200">{account.name}</h2>
          <p className="mt-4 text-2xl font-semibold text-slate-50">
            {formatCurrency(account.balance)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{account.accountNumber}</p>
        </div>
      ))}
    </div>
  )
}
