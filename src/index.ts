// server.ts

// If using TypeScript, install these packages first:
// npm install express cors morgan helmet
//
// And install types:
// npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/morgan
//
// Optional tsconfig:
// npx tsc --init

import express, { Request, Response } from 'express'
// import cors from 'cors'
// import morgan from 'morgan'
import helmet from 'helmet'

const app = express()
const PORT: number = 5000

app.use(helmet())
// app.use(cors())
// app.use(morgan('dev'))
app.use(express.json())

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'ShipLog backend is running',
  })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
