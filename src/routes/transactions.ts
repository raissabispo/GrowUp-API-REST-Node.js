import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  // Rota GET para buscar todas as transações
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      try {
        const { sessionId } = request.cookies

        const transactions = await knex('transactions')
          .where('session_id', sessionId)
          .select()

        return reply.status(200).send({ transactions })
      } catch (error) {
        console.error('Erro ao buscar transações:', error)
        return reply.status(500).send({ error: 'Erro ao buscar transações.' })
      }
    },
  )

  // Rota GET para buscar uma transação por ID
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      try {
        const getTransactionsParamsSchema = z.object({
          id: z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(request.params)

        const { sessionId } = request.cookies

        const transaction = await knex('transactions')
          .where({
            session_id: sessionId,
            id,
          })
          .first()

        if (!transaction) {
          return reply.status(404).send({ error: 'Transação não encontrada.' })
        }

        return reply.status(200).send({ transaction })
      } catch (error) {
        console.error('Erro ao buscar transação:', error)
        return reply.status(500).send({ error: 'Erro ao buscar transação.' })
      }
    },
  )

  // Rota GET para buscar o resumo das transações
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      try {
        const { sessionId } = request.cookies

        const summary = await knex('transactions')
          .where('session_id', sessionId)
          .sum('amount', { as: 'amount' })
          .first()

        return reply.status(200).send({ summary: summary?.amount || 0 })
      } catch (error) {
        console.error('Erro ao buscar resumo das transações:', error)
        return reply.status(500).send({ error: 'Erro ao buscar resumo das transações.' })
      }
    },
  )

  // Rota POST para criar transações
  app.post('/', async (request, reply) => {
    try {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
      })

      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body,
      )

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }

      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })

      return reply.status(201).send({ message: 'Transação criada com sucesso!' })
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      return reply.status(500).send({ error: 'Erro ao criar transação.' })
    }
  })
}