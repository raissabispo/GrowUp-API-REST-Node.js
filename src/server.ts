import fastify from 'fastify'
import { env } from './env'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

// Registra o plugin de cookies
app.register(cookie)

// Adiciona um hook global para logar as requisições
app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}`)
})

// Registra as rotas de transações com o prefixo '/transactions'
app.register(transactionsRoutes, { prefix: '/transactions' })

// Rota de teste
app.get('/hello', async (request, reply) => {
  return reply.send('hello world')
})

// Inicia o servidor
app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
  .catch((err) => {
    console.error('Erro ao iniciar o servidor:', err)
    process.exit(1)
  })
