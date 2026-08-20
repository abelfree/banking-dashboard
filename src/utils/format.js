const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

export function formatCurrency(amount) {
  return currencyFormatter.format(amount)
}

export function formatDate(isoDate) {
  return dateFormatter.format(new Date(isoDate))
}

export function accountTypeLabel(type) {
  switch (type) {
    case 'checking':
      return 'Checking'
    case 'savings':
      return 'Savings'
    case 'credit':
      return 'Credit Card'
    default:
      return type
  }
}
