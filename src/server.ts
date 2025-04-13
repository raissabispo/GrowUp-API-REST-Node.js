import fastify from 'fastify'
import { env } from './env'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions' // Certifique-se de que o caminho está correto

const app = fastify()

app.register(cookie)
// Registra as rotas de transações
app.register(transactionsRoutes, { prefix: '/transactions' }) // Adicione o prefixo

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })