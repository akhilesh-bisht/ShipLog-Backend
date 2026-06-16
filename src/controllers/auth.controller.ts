// src/controllers/auth.controller.ts
// DAY 4 — GitHub OAuth flow
//
// Flow:
//   1. User clicks "Login with GitHub" on frontend
//   2. Frontend calls GET /api/auth/github
//   3. We redirect them to GitHub's OAuth page
//   4. User approves → GitHub redirects to /api/auth/github/callback
//   5. We get their profile, save to DB, generate JWT
//   6. We redirect to frontend with JWT in URL param
//   7. Frontend stores JWT and uses it for all future requests

import { Request, Response } from 'express'
import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma'
import { env } from '../config/env'
import { asyncHandler } from '../utils/asyncHandler'
import { GithubProfile } from '../types'

// ── Configure Passport GitHub Strategy ────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: env.GITHUB_CALLBACK_URL,
      scope: ['user:email', 'repo'],
    },
    async (_accessToken: string, _refreshToken: string, profile: GithubProfile, done: Function) => {
      try {
        const githubId = profile._json.id.toString()
        const email = profile._json.email
        const name = profile._json.name || profile._json.login
        const avatarUrl = profile._json.avatar_url

        // Upsert user — create if first login, update token if returning
        const user = await prisma.user.upsert({
          where: { githubId },
          update: {
            githubToken: _accessToken, // always update token (can expire)
            name,
            avatarUrl,
            ...(email && { email }),
          },
          create: {
            githubId,
            githubToken: _accessToken,
            name,
            avatarUrl,
            ...(email && { email }),
          },
        })

        done(null, user)
      } catch (err) {
        done(err, null)
      }
    }
  )
)

// ── Helper: generate JWT token ────────────────────────────────────────────
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

// ── Controllers ───────────────────────────────────────────────────────────

// GET /api/auth/github
// Redirect user to GitHub OAuth page
export const githubLogin = passport.authenticate('github', {
  scope: ['user:email', 'repo'],
  session: false,
})

// GET /api/auth/github/callback
// GitHub redirects here after user approves
export const githubCallback = [
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const user = req.user as { id: string }
    const token = generateToken(user.id)

    // Redirect to frontend with token
    // Frontend reads it from URL and stores in memory/cookie
    res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`)
  },
]

// GET /api/auth/me  [PROTECTED]
// Returns current logged-in user profile
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by auth.middleware.ts
  const user = req.user!

  res.json({
    status: 'success',
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      plan: user.plan,
      createdAt: user.createdAt,
    },
  })
})

// POST /api/auth/logout  [PROTECTED]
// JWT is stateless — we just tell the frontend to delete the token
// For full invalidation, implement a token blacklist with Redis later
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully',
  })
})
