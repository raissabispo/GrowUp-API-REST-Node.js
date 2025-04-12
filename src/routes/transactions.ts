import { knex } from '../database'
import { FastifyInstance } from 'fastify' 

export async function transactionsRoutes(app: FastifyInstance) {
 
  app.post('/', async () => {
    const transactions = await knex('transactions')
      .where('amount', 1000)
      .select('*') // Removido .returning('*')

    return transactions
  })
}