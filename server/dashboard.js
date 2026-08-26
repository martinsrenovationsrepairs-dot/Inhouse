import { db, getDemoMode, getScope } from './database.js'

export async function dashboard() {
  const scope = await getScope()
  const queries = [
    db.query(`SELECT c.*, COUNT(DISTINCT j.id) jobs_count, COALESCE(SUM(DISTINCT j.budget), 0) total_value FROM clients c LEFT JOIN service_jobs j ON j.client_id = c.id AND j.data_scope = ? WHERE c.data_scope = ? GROUP BY c.id ORDER BY c.created_at DESC LIMIT 200`, [scope, scope]),
    db.query(`SELECT a.*, c.name client_name, j.reference job_reference FROM appointments a LEFT JOIN clients c ON c.id = a.client_id LEFT JOIN service_jobs j ON j.id = a.job_id WHERE a.data_scope = ? ORDER BY a.starts_at LIMIT 200`, [scope]),
    db.query(`SELECT m.*, c.name client_name FROM customer_messages m LEFT JOIN clients c ON c.id = m.client_id WHERE m.data_scope = ? ORDER BY m.created_at DESC LIMIT 200`, [scope]),
    db.query(`SELECT j.*, c.name client_name FROM service_jobs j LEFT JOIN clients c ON c.id = j.client_id WHERE j.data_scope = ? ORDER BY j.created_at DESC LIMIT 200`, [scope]),
    db.query('SELECT * FROM service_job_tasks WHERE data_scope = ? ORDER BY position, id', [scope]),
    db.query(`SELECT m.*, j.reference job_reference FROM material_items m JOIN service_jobs j ON j.id = m.job_id WHERE m.data_scope = ? ORDER BY m.created_at DESC LIMIT 200`, [scope]),
    db.query('SELECT * FROM service_catalog WHERE data_scope = ? ORDER BY name', [scope]),
    db.query('SELECT * FROM purchase_lists WHERE data_scope = ? ORDER BY id', [scope]),
    db.query('SELECT * FROM purchase_list_items WHERE data_scope = ? ORDER BY id', [scope]),
    db.query(`SELECT o.*, j.reference job_reference, pl.service_catalog_id FROM orders o LEFT JOIN service_jobs j ON j.id = o.job_id LEFT JOIN purchase_lists pl ON pl.id = o.purchase_list_id WHERE o.data_scope = ? ORDER BY o.created_at DESC LIMIT 200`, [scope]),
    db.query('SELECT * FROM order_items WHERE data_scope = ? ORDER BY id', [scope]),
    db.query(`SELECT q.*, c.name client_name, sc.name service_name FROM quotes q LEFT JOIN clients c ON c.id = q.client_id LEFT JOIN service_catalog sc ON sc.id = q.service_catalog_id WHERE q.data_scope = ? ORDER BY q.created_at DESC LIMIT 200`, [scope]),
    db.query('SELECT * FROM quote_requests WHERE data_scope = ? ORDER BY created_at DESC LIMIT 200', [scope]),
    db.query('SELECT id, setting_key AS `key`, setting_value AS value, setting_group AS `group`, description FROM backoffice_settings ORDER BY setting_group, setting_key'),
    db.query('SELECT * FROM backoffice_audit_logs WHERE data_scope = ? ORDER BY created_at DESC LIMIT 50', [scope]),
  ]
  const results = await Promise.all(queries)
  const rows = results.map(([items]) => items)
  const catalog = rows[6].map((service) => ({
    ...service,
    purchase_lists: rows[7].filter((list) => list.service_catalog_id === service.id).map((list) => ({
      ...list,
      items: rows[8].filter((item) => item.purchase_list_id === list.id),
    })),
  }))
  return {
    data_mode: scope,
    demo_mode: await getDemoMode(),
    clients: rows[0], appointments: rows[1], messages: rows[2], jobs: rows[3], job_tasks: rows[4],
    materials: rows[5], service_catalog: catalog, orders: rows[9], order_items: rows[10], quotes: rows[11],
    quote_requests: rows[12], settings: rows[13], activity: rows[14],
  }
}
