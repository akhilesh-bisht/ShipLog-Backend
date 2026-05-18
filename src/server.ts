// src/server.ts
// Entry point — starts the HTTP server
// Keep this file minimal. All app logic lives in app.ts

import './config/env'   // validate env vars first — crash early if missing
import app from './app'
import { env } from './config/env'
import { prisma } from './config/prisma'

const startServer = async () => {
  // Test DB connection before accepting traffic
  try {
    await prisma.$connect()
    console.log('✅ Database connected')
  } catch (err) {
    console.error('❌ Database connection failed:', err)
    process.exit(1)
  }

  app.listen(env.PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║        ShipLog Backend                   ║
║  🚀  http://localhost:${env.PORT}              ║
║  🌍  Environment: ${env.NODE_ENV.padEnd(14)} ║
╚══════════════════════════════════════════╝
    `)
  })
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  console.log('Server shut down gracefully')
  process.exit(0)
})

startServer()
