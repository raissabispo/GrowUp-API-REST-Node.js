import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'), // corrigido
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'), // corrigido
  PORT: z.string().transform((port) => parseInt(port, 10)).default('3333'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Deu errado :(', _env.error.format()) // corrigido com os parênteses
  throw new Error('Invalid environment variables')
}

export const env = _env.data
