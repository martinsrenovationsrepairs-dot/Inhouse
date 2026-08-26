import bcrypt from 'bcryptjs'
import { closeDatabase, db, migrate } from './database.js'
import { seedDemo } from './seed-demo.js'

const [, , command, ...args] = process.argv

try {
  if (command === 'migrate') await migrate()
  else if (command === 'seed-demo') { await migrate(); await seedDemo() }
  else if (command === 'admin-create') {
    await migrate()
    const email = String(args[0] || process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const password = String(process.env.ADMIN_INITIAL_PASSWORD || '')
    if (!email || password.length < 12) throw new Error('Defina email e ADMIN_INITIAL_PASSWORD com pelo menos 12 caracteres.')
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password)', [process.env.ADMIN_NAME || 'Martins', email, await bcrypt.hash(password, 12)])
  } else throw new Error('Comando: migrate | seed-demo | admin-create')
  console.log(`Comando ${command} concluído.`)
} finally {
  await closeDatabase()
}
