import { useState } from 'react'
import { BalanceCards } from './components/BalanceCards'
import { Header } from './components/Header'
import { SpendingChart } from './components/SpendingChart'
import { TransactionList } from './components/TransactionList'
import { TransferModal } from './components/TransferModal'
import { useAccounts } from './hooks/useAccounts'
import { useTransactions } from './hooks/useTransactions'

function App() {
  const { accounts, status: accountsStatus, refetch: refetchAccounts } = useAccounts()
  const { transactions, status: transactionsStatus, refetch: refetchTransactions } = useTransactions()
  const [transferOpen, setTransferOpen] = useState(false)

  function handleTransferComplete() {
    refetchAccounts()
    refetchTransactions()
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <Header onNewTransfer={() => setTransferOpen(true)} />
        <BalanceCards accounts={accounts} status={accountsStatus} />
        <SpendingChart transactions={transactions} />
        <TransactionList transactions={transactions} status={transactionsStatus} />
      </div>

      {transferOpen && (
        <TransferModal
          accounts={accounts}
          onClose={() => setTransferOpen(false)}
          onTransferComplete={handleTransferComplete}
        />
      )}
    </div>
  )
}

export default App
