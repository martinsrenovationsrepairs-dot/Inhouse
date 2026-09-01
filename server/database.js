import mysql from 'mysql2/promise'
import { config } from './config.js'

export const db = mysql.createPool({
  ...config.database,
  waitForConnections: true,
  charset: 'utf8mb4',
  timezone: 'Z',
  decimalNumbers: true,
  enableKeepAlive: true,
})

const schema = [
  `CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS app_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value JSON NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS clients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(80) NULL,
    location VARCHAR(255) NULL,
    preferred_language VARCHAR(2) DEFAULT 'pt',
    tags JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clients_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS quote_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(40) NOT NULL,
    email VARCHAR(160) NOT NULL,
    location VARCHAR(180) NOT NULL,
    service VARCHAR(40) NOT NULL,
    description TEXT NOT NULL,
    preferred_language VARCHAR(2) NOT NULL,
    contact_method VARCHAR(20) NOT NULL,
    preferred_date DATE NULL,
    attachments JSON NULL,
    consent_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_quote_requests_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS service_jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    client_id BIGINT UNSIGNED NULL,
    reference VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'planned',
    progress TINYINT UNSIGNED DEFAULT 0,
    budget DECIMAL(12,2) NULL,
    location VARCHAR(255) NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_jobs_scope_reference (data_scope, reference),
    CONSTRAINT fk_jobs_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS service_job_tasks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    job_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    position INT DEFAULT 0,
    due_date DATE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_job FOREIGN KEY (job_id) REFERENCES service_jobs(id) ON DELETE CASCADE,
    INDEX idx_tasks_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    client_id BIGINT UNSIGNED NULL,
    job_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    location VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    google_event_id VARCHAR(255) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    CONSTRAINT fk_appointments_job FOREIGN KEY (job_id) REFERENCES service_jobs(id) ON DELETE SET NULL,
    INDEX idx_appointments_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS customer_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    client_id BIGINT UNSIGNED NULL,
    quote_request_id BIGINT UNSIGNED NULL,
    channel VARCHAR(50) DEFAULT 'website',
    subject VARCHAR(255) NULL,
    body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    priority VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    CONSTRAINT fk_messages_quote_request FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE SET NULL,
    INDEX idx_messages_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS service_catalog (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    hourly_rate DECIMAL(10,2) NULL,
    default_hours DECIMAL(8,2) NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_catalog_scope_code (data_scope, code)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS purchase_lists (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    service_catalog_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_purchase_lists_catalog FOREIGN KEY (service_catalog_id) REFERENCES service_catalog(id) ON DELETE CASCADE,
    INDEX idx_purchase_lists_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS purchase_list_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    purchase_list_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    supplier VARCHAR(255) NULL,
    url VARCHAR(2048) NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'un.',
    unit_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_purchase_items_list FOREIGN KEY (purchase_list_id) REFERENCES purchase_lists(id) ON DELETE CASCADE,
    INDEX idx_purchase_items_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS material_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    job_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'un.',
    unit_cost DECIMAL(10,2) NULL,
    status VARCHAR(50) DEFAULT 'needed',
    supplier VARCHAR(255) NULL,
    url VARCHAR(2048) NULL,
    purchased_at DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_materials_job FOREIGN KEY (job_id) REFERENCES service_jobs(id) ON DELETE CASCADE,
    INDEX idx_materials_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    reference VARCHAR(255) NOT NULL,
    job_id BIGINT UNSIGNED NULL,
    purchase_list_id BIGINT UNSIGNED NULL,
    supplier VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'draft',
    ordered_at DATE NULL,
    expected_at DATE NULL,
    received_at DATE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_orders_scope_reference (data_scope, reference),
    CONSTRAINT fk_orders_job FOREIGN KEY (job_id) REFERENCES service_jobs(id) ON DELETE SET NULL,
    CONSTRAINT fk_orders_list FOREIGN KEY (purchase_list_id) REFERENCES purchase_lists(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    order_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'un.',
    unit_price DECIMAL(10,2) DEFAULT 0,
    supplier VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_items_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS quotes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    reference VARCHAR(255) NOT NULL,
    client_id BIGINT UNSIGNED NULL,
    job_id BIGINT UNSIGNED NULL,
    service_catalog_id BIGINT UNSIGNED NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    labor_hours DECIMAL(8,2) DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    materials_total DECIMAL(10,2) DEFAULT 0,
    margin_percent DECIMAL(8,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    valid_until DATE NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_quotes_scope_reference (data_scope, reference),
    CONSTRAINT fk_quotes_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    CONSTRAINT fk_quotes_job FOREIGN KEY (job_id) REFERENCES service_jobs(id) ON DELETE SET NULL,
    CONSTRAINT fk_quotes_catalog FOREIGN KEY (service_catalog_id) REFERENCES service_catalog(id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS backoffice_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value JSON NULL,
    setting_group VARCHAR(100) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS backoffice_audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    data_scope ENUM('real','demo') NOT NULL DEFAULT 'real',
    source VARCHAR(50) DEFAULT 'api',
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    changes JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_scope (data_scope)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
]

const scopedTables = [
  'clients', 'quote_requests', 'service_jobs', 'service_job_tasks', 'appointments',
  'customer_messages', 'service_catalog', 'purchase_lists', 'purchase_list_items',
  'material_items', 'orders', 'order_items', 'quotes', 'backoffice_audit_logs',
]

async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = ? AND table_name = ? AND column_name = ? LIMIT 1`,
    [config.database.database, table, column],
  )
  return Boolean(rows[0])
}

async function indexExists(table, index) {
  const [rows] = await db.query(
    `SELECT 1 FROM information_schema.statistics
     WHERE table_schema = ? AND table_name = ? AND index_name = ? LIMIT 1`,
    [config.database.database, table, index],
  )
  return Boolean(rows[0])
}

async function upgradeLegacySchema() {
  for (const table of scopedTables) {
    if (!(await columnExists(table, 'data_scope'))) {
      await db.query(`ALTER TABLE \`${table}\` ADD COLUMN data_scope ENUM('real','demo') NOT NULL DEFAULT 'real' AFTER id`)
    }
    const scopeIndex = `idx_${table}_scope`
    if (!(await indexExists(table, scopeIndex))) {
      await db.query(`ALTER TABLE \`${table}\` ADD INDEX \`${scopeIndex}\` (data_scope)`)
    }
  }

  if ((await columnExists('backoffice_settings', 'key')) && !(await columnExists('backoffice_settings', 'setting_key'))) {
    await db.query('ALTER TABLE backoffice_settings RENAME COLUMN `key` TO setting_key')
  }
  if ((await columnExists('backoffice_settings', 'value')) && !(await columnExists('backoffice_settings', 'setting_value'))) {
    await db.query('ALTER TABLE backoffice_settings RENAME COLUMN `value` TO setting_value')
  }
  if ((await columnExists('backoffice_settings', 'group')) && !(await columnExists('backoffice_settings', 'setting_group'))) {
    await db.query('ALTER TABLE backoffice_settings RENAME COLUMN `group` TO setting_group')
  }
}

export async function migrate() {
  for (const statement of schema) await db.query(statement)
  await upgradeLegacySchema()
  await db.query(
    `INSERT INTO app_settings (setting_key, setting_value)
     VALUES ('demo_mode', JSON_EXTRACT('false', '$'))
     ON DUPLICATE KEY UPDATE setting_key = setting_key`,
  )
}

export async function getDemoMode(connection = db) {
  const [rows] = await connection.query("SELECT setting_value FROM app_settings WHERE setting_key = 'demo_mode' LIMIT 1")
  const raw = rows[0]?.setting_value
  return raw === true || raw === 1 || raw === 'true' || raw === '1'
}

export async function getScope(connection = db) {
  return (await getDemoMode(connection)) ? 'demo' : 'real'
}

export async function setDemoMode(enabled) {
  await db.query(
    `INSERT INTO app_settings (setting_key, setting_value) VALUES ('demo_mode', CAST(? AS JSON))
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [JSON.stringify(Boolean(enabled))],
  )
  return Boolean(enabled)
}

export async function closeDatabase() {
  await db.end()
}
