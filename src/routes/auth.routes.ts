// src/routes/auth.routes.ts
import { Router } from 'express'
import passport from 'passport'
import * as authController from '../controllers/auth.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

// GET /api/auth/github → redirect to GitHub OAuth
router.get('/github', authController.githubLogin)

// GET /api/auth/github/callback → GitHub redirects here
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  authController.githubCallback as any
)

// GET /api/auth/me → get logged-in user (protected)
router.get('/me', protect, authController.getMe)

// POST /api/auth/logout
router.post('/logout', protect, authController.logout)

export default router
