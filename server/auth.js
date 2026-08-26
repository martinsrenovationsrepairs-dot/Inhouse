import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { db } from './database.js'

const cookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'lax',
  maxAge: 8 * 60 * 60 * 1000,
  path: '/',
}

export async function login(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  const [rows] = await db.query('SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1', [email])
  const user = rows[0]
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(422).json({ message: 'Credenciais inválidas.' })
  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, config.jwtSecret, { expiresIn: '8h', issuer: 'martins-backoffice' })
  res.cookie(config.cookieName, token, cookieOptions)
  return res.json({ user: { id: user.id, name: user.name, email: user.email } })
}

export function logout(_req, res) {
  res.clearCookie(config.cookieName, { ...cookieOptions, maxAge: undefined })
  res.status(204).end()
}

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[config.cookieName]
    if (!token) return res.status(401).json({ message: 'Autenticação necessária.' })
    req.user = jwt.verify(token, config.jwtSecret, { issuer: 'martins-backoffice' })
    next()
  } catch {
    res.status(401).json({ message: 'Sessão inválida ou expirada.' })
  }
}

export async function ensureInitialAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_INITIAL_PASSWORD
  if (!email || !password) return
  if (password.length < 12) throw new Error('ADMIN_INITIAL_PASSWORD must contain at least 12 characters.')
  const [rows] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  if (rows[0]) return
  await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [process.env.ADMIN_NAME || 'Martins', email, await bcrypt.hash(password, 12)])
}
