export function Header({ onNewTransfer }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 pb-6">
      <div>
        <p className="text-sm font-medium text-emerald-400">Meridian Bank</p>
        <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
          Good to see you, Abel
        </h1>
      </div>
      <button
        type="button"
        onClick={onNewTransfer}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        New Transfer
      </button>
    </header>
  )
}
