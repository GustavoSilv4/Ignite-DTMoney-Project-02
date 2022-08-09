import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react'
import { api } from '../lib/axios'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionProps {
  description: string
  type: 'income' | 'outcome'
  category: string
  price: number
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (
    data: CreateTransactionProps
  ) => Promise<void>
}

export const TransactionsContext = createContext(
  {} as TransactionContextType
)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionProvider({
  children,
}: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<
    Transaction[]
  >([])

  async function fetchTransactions(query?: string) {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(response.data)
  }

  async function createTransaction(
    data: CreateTransactionProps
  ) {
    const { category, description, price, type } = data

    const response = await api.post('/transactions', {
      description,
      type,
      category,
      price,
      createdAt: new Date(),
    })

    setTransactions((state) => [response.data, ...state])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}>
      {children}
    </TransactionsContext.Provider>
  )
}
