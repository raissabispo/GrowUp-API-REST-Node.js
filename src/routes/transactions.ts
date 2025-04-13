import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'

export async function transactionsRoutes(app: FastifyInstance) {
  // Rota GET para buscar todas as transações
  app.get('/', async (request, reply) => {
    const transactions = await knex('transactions').select('*')
    return reply.status(200).send(transactions)
  })

  // Rota GET para buscar uma transação por ID
  app.get('/:id', async (request, reply) => {
    const getTransactionsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionsParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where({ id }).first()

    if (!transaction) {
      return reply.status(404).send({ message: 'Transação não encontrada' })
    }

    return reply.status(200).send(transaction)
  })

  // Rota GET para buscar o resumo das transações
  app.get('/summary', async (request, reply) => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return reply.status(200).send({ summary })
  })

  // Rota POST para criar transações
  app.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send({ message: 'Transação criada com sucesso!' })
  })
}