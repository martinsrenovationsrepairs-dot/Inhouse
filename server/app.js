import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import multer from 'multer'
import { config } from './config.js'
import { db, getDemoMode, migrate, setDemoMode } from './database.js'
import { seedDemo } from './seed-demo.js'
import { dashboard } from './dashboard.js'
import { ensureInitialAdmin, login, logout, requireAuth } from './auth.js'
import { createEntity, deleteEntity, getEntity, listEntity, updateEntity } from './entities.js'
import { validateQuoteRequest } from './validation.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const uploadDir = path.resolve(rootDir, config.uploadDir)
fs.mkdirSync(uploadDir, { recursive: true })

let databaseState = 'initializing'

const app = express()
if (config.trustProxy) app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'same-site' } }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '100kb' }))
app.use(cookieParser())

app.use((req, res, next) => {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next()
  const origin = req.get('origin')
  if (!origin) return next()
  try {
    const originUrl = new URL(origin)
    const allowed = origin === config.appUrl || (config.nodeEnv !== 'production' && ['localhost', '127.0.0.1'].includes(originUrl.hostname))
    if (!allowed) return res.status(403).json({ message: 'Origem não autorizada.' })
    next()
  } catch {
    res.status(403).json({ message: 'Origem inválida.' })
  }
})

const loginLimiter = rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: true, legacyHeaders: false })
const quoteLimiter = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: true, legacyHeaders: false })

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => callback(null, `${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
})
const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
const upload = multer({ storage, limits: { files: 5, fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, callback) => callback(allowedMime.has(file.mimetype) ? null : new Error('Tipo de ficheiro não permitido.'), allowedMime.has(file.mimetype)) })

app.get('/api/status', async (_req, res, next) => {
  if (databaseState !== 'ready') {
    return res.status(503).json({
      status: databaseState,
      service: 'Martins In House Services',
      runtime: 'Node.js',
      database: 'unavailable',
    })
  }
  try {
    await db.query('SELECT 1')
    res.json({ status: 'online', service: 'Martins In House Services', runtime: 'Node.js', database: 'MySQL' })
  } catch (error) { next(error) }
})

app.use('/api', (_req, res, next) => {
  if (databaseState === 'ready') return next()
  return res.status(503).json({ message: 'Base de dados temporariamente indisponível.' })
})

app.post('/api/quote-requests', quoteLimiter, upload.array('attachments[]', 5), async (req, res, next) => {
  try {
    const errors = validateQuoteRequest(req.body)
    if (Object.keys(errors).length) return res.status(422).json({ message: 'Dados inválidos.', errors })
    const attachments = (req.files || []).map((file) => ({ name: file.originalname, path: path.relative(rootDir, file.path).replaceAll('\\', '/'), mime: file.mimetype, size: file.size }))
    const [result] = await db.query(
      `INSERT INTO quote_requests (data_scope, name, phone, email, location, service, description, preferred_language, contact_method, preferred_date, attachments, consent_at, ip_address)
       VALUES ('real', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [req.body.name, req.body.phone, req.body.email, req.body.location, req.body.service, req.body.description, req.body.preferred_language, req.body.contact_method, req.body.preferred_date || null, JSON.stringify(attachments), req.ip],
    )
    res.status(201).json({ message: 'Pedido de orçamento recebido.', reference: result.insertId })
  } catch (error) { next(error) }
})

app.post('/api/admin/login', loginLimiter, login)
app.post('/api/admin/logout', requireAuth, logout)
app.get('/api/admin/me', requireAuth, (req, res) => res.json({ user: { id: req.user.sub, name: req.user.name, email: req.user.email } }))
app.get('/api/admin/dashboard', requireAuth, async (_req, res, next) => {
  try { res.json(await dashboard()) } catch (error) { next(error) }
})
app.get('/api/admin/data-mode', requireAuth, async (_req, res, next) => {
  try { const demoMode = await getDemoMode(); res.json({ demo_mode: demoMode, data_mode: demoMode ? 'demo' : 'real' }) } catch (error) { next(error) }
})
app.put('/api/admin/data-mode', requireAuth, async (req, res, next) => {
  try { const demoMode = await setDemoMode(req.body?.demo_mode); res.json({ demo_mode: demoMode, data_mode: demoMode ? 'demo' : 'real' }) } catch (error) { next(error) }
})

app.get('/api/admin/entities/:entity', requireAuth, async (req, res, next) => {
  try { res.json({ items: await listEntity(req.params.entity, { filters: req.query.filters, search: req.query.search, limit: req.query.limit, offset: req.query.offset }) }) } catch (error) { next(error) }
})
app.post('/api/admin/entities/:entity', requireAuth, async (req, res, next) => {
  try { res.status(201).json(await createEntity(req.params.entity, req.body)) } catch (error) { next(error) }
})
app.get('/api/admin/entities/:entity/:id', requireAuth, async (req, res, next) => {
  try { res.json(await getEntity(req.params.entity, Number(req.params.id))) } catch (error) { next(error) }
})
app.patch('/api/admin/entities/:entity/:id', requireAuth, async (req, res, next) => {
  try { res.json(await updateEntity(req.params.entity, Number(req.params.id), req.body)) } catch (error) { next(error) }
})
app.delete('/api/admin/entities/:entity/:id', requireAuth, async (req, res, next) => {
  try { await deleteEntity(req.params.entity, Number(req.params.id)); res.status(204).end() } catch (error) { next(error) }
})

app.use(express.static(distDir, { index: false, maxAge: config.nodeEnv === 'production' ? '1d' : 0 }))
app.get('/admin', (_req, res) => { res.set('X-Robots-Tag', 'noindex, nofollow'); res.sendFile(path.join(distDir, 'index.html')) })
app.get('/admin/*splat', (_req, res) => { res.set('X-Robots-Tag', 'noindex, nofollow'); res.sendFile(path.join(distDir, 'index.html')) })
app.get('/*splat', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
app.get('/', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))

app.use((error, _req, res, _next) => {
  console.error(error)
  const status = error.status || (error instanceof multer.MulterError ? 422 : 500)
  res.status(status).json({ message: status === 500 ? 'Ocorreu um erro interno.' : error.message })
})

async function initializeDatabase() {
  if (config.autoMigrate) await migrate()
  if (config.autoSeedDemo) await seedDemo()
  await ensureInitialAdmin()
  databaseState = 'ready'
  console.log('Database initialization completed.')
}

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`Martins web app listening on port ${config.port}`)
  initializeDatabase().catch((error) => {
    databaseState = 'error'
    console.error('Database initialization failed:', error)
  })
})

export { app, server }
export default app
