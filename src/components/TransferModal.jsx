import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../api/client'
import { formatCurrency } from '../utils/format'

const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Choose a source account'),
  toAccountId: z.string().min(1, 'Choose a destination account'),
  amount: z.coerce
    .number({ invalid_type_error: 'Enter an amount' })
    .positive('Amount must be greater than zero'),
  note: z.string().max(140, 'Keep the note under 140 characters').optional(),
})

export function TransferModal({ accounts, onClose, onTransferComplete }) {
  const [submitStatus, setSubmitStatus] = useState('idle')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: { fromAccountId: '', toAccountId: '', amount: '', note: '' },
  })

  const fromAccountId = watch('fromAccountId')
  const fromAccount = accounts.find((a) => a.id === fromAccountId)

  async function onSubmit(values) {
    if (values.fromAccountId === values.toAccountId) {
      setSubmitStatus('same-account')
      return
    }

    setSubmitStatus('idle')
    const toAccount = accounts.find((a) => a.id === values.toAccountId)
    const amount = Math.abs(values.amount)

    try {
      await api.post('/transactions', {
        accountId: values.fromAccountId,
        date: new Date().toISOString().slice(0, 10),
        merchant: `Transfer to ${toAccount?.name ?? 'account'}`,
        category: 'Transfer',
        amount: -amount,
      })
      await Promise.all([
        api.patch(`/accounts/${values.fromAccountId}`, {
          balance: fromAccount.balance - amount,
        }),
        api.patch(`/accounts/${values.toAccountId}`, {
          balance: toAccount.balance + amount,
        }),
      ])
      onTransferComplete?.()
      onClose()
    } catch {
      setSubmitStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-50">New transfer</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400">From</label>
            <select
              {...register('fromAccountId')}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} &middot; {formatCurrency(a.balance)}
                </option>
              ))}
            </select>
            {errors.fromAccountId && (
              <p className="mt-1 text-xs text-rose-400">{errors.fromAccountId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400">To</label>
            <select
              {...register('toAccountId')}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {errors.toAccountId && (
              <p className="mt-1 text-xs text-rose-400">{errors.toAccountId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount')}
              placeholder="0.00"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            {errors.amount && <p className="mt-1 text-xs text-rose-400">{errors.amount.message}</p>}
            {fromAccount && !errors.amount && (
              <p className="mt-1 text-xs text-slate-500">
                Available: {formatCurrency(fromAccount.balance)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400">Note (optional)</label>
            <input
              type="text"
              {...register('note')}
              placeholder="What's this for?"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            />
            {errors.note && <p className="mt-1 text-xs text-rose-400">{errors.note.message}</p>}
          </div>

          {submitStatus === 'same-account' && (
            <p className="text-xs text-rose-400">Source and destination accounts must differ.</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-xs text-rose-400">Transfer failed. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Sending...' : 'Send transfer'}
          </button>
        </form>
      </div>
    </div>
  )
}
