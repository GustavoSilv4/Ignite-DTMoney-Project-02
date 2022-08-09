import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from './styles'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { TransactionsContext } from '../../contexts/TrasactionsContext'

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']), // Com o enum nós falamos que ele so vai poder escolher algumas opcoes pre-definida
})

type newTransactionFormType = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  const { createTransaction } = useContext(TransactionsContext)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<newTransactionFormType>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      description: '',
      category: '',
      type: 'income',
    },
  })

  async function handleCreateNewTransaction(data: newTransactionFormType) {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const { category, description, price, type } = data

    await createTransaction({
      description,
      type,
      price,
      category,
    })

    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova transacao</Dialog.Title>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input type="text" placeholder="Descricao" required {...register('description')} />
          <input type="number" placeholder="Preco" min={0} step="0.01" required {...register('price', { valueAsNumber: true })} />
          {/* valueAsNumber: true - Transaforma o tipo do value para number */}
          <input type="text" placeholder="Categoria" required {...register('category')} />

          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <TransactionType onValueChange={field.onChange} value={field.value}>
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>
                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>

        <CloseButton>
          <X size={24} />
        </CloseButton>
      </Content>
    </Dialog.Portal>
  )
}
