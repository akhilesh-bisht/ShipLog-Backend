// src/config/env.ts
import dotenv from 'dotenv'
dotenv.config()

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required env var: ${key}`)
  return value
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] || fallback
}

export const env = {
  PORT: parseInt(optionalEnv('PORT', '5000'), 10),
  NODE_ENV: optionalEnv('NODE_ENV', 'development'),
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '7d'),
  GITHUB_CLIENT_ID: requireEnv('GITHUB_CLIENT_ID'),
  GITHUB_CLIENT_SECRET: requireEnv('GITHUB_CLIENT_SECRET'),
  GITHUB_CALLBACK_URL: requireEnv('GITHUB_CALLBACK_URL'),
  FRONTEND_URL: optionalEnv('FRONTEND_URL', 'http://localhost:3000'),
  API_URL: optionalEnv('API_URL', 'http://localhost:5000'),
  RESEND_API_KEY: optionalEnv('RESEND_API_KEY', ''),
  EMAIL_FROM: optionalEnv('EMAIL_FROM', 'ShipLog <noreply@shiplog.io>'),
  STRIPE_SECRET_KEY: optionalEnv('STRIPE_SECRET_KEY', ''),
  STRIPE_WEBHOOK_SECRET: optionalEnv('STRIPE_WEBHOOK_SECRET', ''),
  STRIPE_PRO_PRICE_ID: optionalEnv('STRIPE_PRO_PRICE_ID', ''),
  STRIPE_TEAM_PRICE_ID: optionalEnv('STRIPE_TEAM_PRICE_ID', ''),
} as const

export default env
