import { db, getScope } from './database.js'

const definitions = {
  clients: { table: 'clients', required: ['name'], fields: ['name', 'email', 'phone', 'location', 'preferred_language', 'tags', 'notes'], json: ['tags'], search: ['name', 'email', 'phone', 'location', 'notes'] },
  jobs: { table: 'service_jobs', required: ['reference', 'title', 'service'], fields: ['client_id', 'reference', 'title', 'service', 'status', 'progress', 'budget', 'location', 'start_date', 'end_date', 'notes'], search: ['reference', 'title', 'service', 'location', 'notes'] },
  job_tasks: { table: 'service_job_tasks', required: ['job_id', 'title'], fields: ['job_id', 'title', 'status', 'position', 'due_date', 'notes'], search: ['title', 'status', 'notes'] },
  appointments: { table: 'appointments', required: ['title', 'starts_at', 'ends_at'], fields: ['client_id', 'job_id', 'title', 'starts_at', 'ends_at', 'location', 'status', 'google_event_id', 'notes'], search: ['title', 'location', 'notes'] },
  materials: { table: 'material_items', required: ['job_id', 'name'], fields: ['job_id', 'name', 'quantity', 'unit', 'unit_cost', 'status', 'supplier', 'url', 'purchased_at'], search: ['name', 'supplier', 'status'] },
  messages: { table: 'customer_messages', required: ['body'], fields: ['client_id', 'quote_request_id', 'channel', 'subject', 'body', 'status', 'priority'], search: ['subject', 'body', 'channel', 'status', 'priority'] },
  quote_requests: { table: 'quote_requests', required: ['name', 'phone', 'email', 'location', 'service', 'description', 'preferred_language', 'contact_method', 'consent_at'], fields: ['name', 'phone', 'email', 'location', 'service', 'description', 'preferred_language', 'contact_method', 'preferred_date', 'attachments', 'consent_at'], json: ['attachments'], search: ['name', 'phone', 'email', 'location', 'service', 'description'] },
  service_catalog: { table: 'service_catalog', required: ['code', 'name'], fields: ['code', 'name', 'description', 'hourly_rate', 'default_hours', 'active'], search: ['code', 'name', 'description'] },
  purchase_lists: { table: 'purchase_lists', required: ['service_catalog_id', 'name'], fields: ['service_catalog_id', 'name', 'notes'], search: ['name', 'notes'] },
  purchase_list_items: { table: 'purchase_list_items', required: ['purchase_list_id', 'name'], fields: ['purchase_list_id', 'name', 'description', 'supplier', 'url', 'quantity', 'unit', 'unit_price'], search: ['name', 'description', 'supplier'] },
  orders: { table: 'orders', required: ['reference'], fields: ['reference', 'job_id', 'purchase_list_id', 'supplier', 'status', 'ordered_at', 'expected_at', 'received_at', 'notes'], search: ['reference', 'supplier', 'status', 'notes'] },
  order_items: { table: 'order_items', required: ['order_id', 'name'], fields: ['order_id', 'name', 'quantity', 'unit', 'unit_price', 'supplier', 'status'], search: ['name', 'supplier', 'status'] },
  quotes: { table: 'quotes', required: ['reference', 'title'], fields: ['reference', 'client_id', 'job_id', 'service_catalog_id', 'title', 'status', 'labor_hours', 'hourly_rate', 'materials_total', 'margin_percent', 'total', 'valid_until', 'description'], search: ['reference', 'title', 'status', 'description'] },
  settings: { table: 'backoffice_settings', required: ['setting_key'], fields: ['setting_key', 'setting_value', 'setting_group', 'description'], json: ['setting_value'], search: ['setting_key', 'setting_group', 'description'], global: true },
}

const aliases = { key: 'setting_key', value: 'setting_value', group: 'setting_group' }

export function entityDefinition(name) {
  const definition = definitions[name]
  if (!definition) throw Object.assign(new Error(`Entidade não autorizada: ${name}`), { status: 404 })
  return definition
}

function normalizeInput(definition, input) {
  const normalized = {}
  for (const [originalKey, value] of Object.entries(input || {})) {
    const key = definition.table === 'backoffice_settings' ? (aliases[originalKey] || originalKey) : originalKey
    if (!definition.fields.includes(key)) throw Object.assign(new Error(`Campo não autorizado: ${originalKey}`), { status: 422 })
    normalized[key] = definition.json?.includes(key) && value !== null ? JSON.stringify(value) : value
  }
  return normalized
}

function validateRequired(definition, input) {
  const missing = definition.required.filter((field) => input[field] === undefined || input[field] === null || input[field] === '')
  if (missing.length) throw Object.assign(new Error(`Campos obrigatórios: ${missing.join(', ')}`), { status: 422 })
}

function decodeRow(definition, row) {
  if (!row) return row
  const result = { ...row }
  for (const field of definition.json || []) {
    if (typeof result[field] === 'string') {
      try { result[field] = JSON.parse(result[field]) } catch { /* keep original */ }
    }
  }
  if (definition.table === 'backoffice_settings') {
    result.key = result.setting_key
    result.value = result.setting_value
    result.group = result.setting_group
  }
  return result
}

export async function listEntity(name, { filters = {}, search = '', limit = 100, offset = 0 } = {}) {
  const definition = entityDefinition(name)
  const scope = definition.global ? null : await getScope()
  const where = []
  const params = []
  if (scope) { where.push('data_scope = ?'); params.push(scope) }
  for (const [field, value] of Object.entries(filters || {})) {
    if (field !== 'id' && !definition.fields.includes(field)) throw Object.assign(new Error(`Filtro não autorizado: ${field}`), { status: 422 })
    where.push(`\`${field}\` = ?`); params.push(value)
  }
  if (search.trim() && definition.search.length) {
    where.push(`(${definition.search.map((field) => `\`${field}\` LIKE ?`).join(' OR ')})`)
    params.push(...definition.search.map(() => `%${search.trim()}%`))
  }
  const safeLimit = Math.min(200, Math.max(1, Number(limit) || 100))
  const safeOffset = Math.max(0, Number(offset) || 0)
  const [rows] = await db.query(`SELECT * FROM \`${definition.table}\`${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, safeLimit, safeOffset])
  return rows.map((row) => decodeRow(definition, row))
}

export async function getEntity(name, id) {
  const definition = entityDefinition(name)
  const scope = definition.global ? null : await getScope()
  const [rows] = await db.query(`SELECT * FROM \`${definition.table}\` WHERE id = ?${scope ? ' AND data_scope = ?' : ''} LIMIT 1`, scope ? [id, scope] : [id])
  if (!rows[0]) throw Object.assign(new Error('Registo não encontrado neste modo de dados.'), { status: 404 })
  return decodeRow(definition, rows[0])
}

export async function createEntity(name, input) {
  const definition = entityDefinition(name)
  const data = normalizeInput(definition, input)
  validateRequired(definition, data)
  if (!definition.global) data.data_scope = await getScope()
  if (name === 'quotes') calculateQuote(data)
  const fields = Object.keys(data)
  const [result] = await db.query(`INSERT INTO \`${definition.table}\` (${fields.map((field) => `\`${field}\``).join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, Object.values(data))
  await audit('create', name, result.insertId, data, data.data_scope)
  return getEntity(name, result.insertId)
}

export async function updateEntity(name, id, input) {
  const definition = entityDefinition(name)
  const existing = await getEntity(name, id)
  const data = normalizeInput(definition, input)
  if (!Object.keys(data).length) throw Object.assign(new Error('Nenhum campo válido foi enviado.'), { status: 422 })
  if (name === 'quotes') calculateQuote(data, existing)
  const scope = definition.global ? null : await getScope()
  const fields = Object.keys(data)
  await db.query(`UPDATE \`${definition.table}\` SET ${fields.map((field) => `\`${field}\` = ?`).join(', ')} WHERE id = ?${scope ? ' AND data_scope = ?' : ''}`, [...Object.values(data), id, ...(scope ? [scope] : [])])
  await audit('update', name, id, data, scope)
  return getEntity(name, id)
}

export async function deleteEntity(name, id) {
  const definition = entityDefinition(name)
  const existing = await getEntity(name, id)
  const scope = definition.global ? null : await getScope()
  await db.query(`DELETE FROM \`${definition.table}\` WHERE id = ?${scope ? ' AND data_scope = ?' : ''}`, scope ? [id, scope] : [id])
  await audit('delete', name, id, existing, scope)
}

function calculateQuote(data, existing = {}) {
  const values = { ...existing, ...data }
  const base = Number(values.labor_hours || 0) * Number(values.hourly_rate || 0) + Number(values.materials_total || 0)
  data.total = Math.round(base * (1 + Number(values.margin_percent || 0) / 100) * 100) / 100
}

async function audit(action, entity, entityId, changes, scope) {
  if (!scope) return
  await db.query('INSERT INTO backoffice_audit_logs (data_scope, action, entity, entity_id, changes) VALUES (?, ?, ?, ?, ?)', [scope, action, entity, entityId, JSON.stringify(changes)])
}
