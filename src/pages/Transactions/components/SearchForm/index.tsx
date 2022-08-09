import { MagnifyingGlass } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { SearchFormContainer } from './styles'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { TransactionsContext } from '../../../../contexts/TrasactionsContext'

const searchFormSchema = z.object({
  query: z.string(),
})

type SearchFormType = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const { fetchTransactions } = useContext(TransactionsContext)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormType>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: '',
    },
  })

  async function handleSearchTransaction(data: SearchFormType) {
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransaction)}>
      <input
        type="text"
        placeholder="Busque por transacoes"
        {...register('query')}
      />
      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
}
