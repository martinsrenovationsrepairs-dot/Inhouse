import { db } from './database.js'

async function upsert(connection, table, uniqueWhere, data) {
  const whereFields = Object.keys(uniqueWhere)
  const [rows] = await connection.query(`SELECT id FROM \`${table}\` WHERE ${whereFields.map((field) => `\`${field}\` = ?`).join(' AND ')} LIMIT 1`, Object.values(uniqueWhere))
  if (rows[0]) return rows[0].id
  const payload = { ...uniqueWhere, ...data }
  const fields = Object.keys(payload)
  const [result] = await connection.query(`INSERT INTO \`${table}\` (${fields.map((field) => `\`${field}\``).join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`, Object.values(payload))
  return result.insertId
}

export async function seedDemo() {
  const connection = await db.getConnection()
  try {
    await connection.beginTransaction()
    const clients = {}
    for (const client of [
      ['Ana Martins', 'ana.martins@example.test', '912 340 101', 'Azeitão', 'pt', ['Recorrente', 'Recomendação'], 'Prefere contacto por WhatsApp ao final da tarde.'],
      ['Thomas Weber', 'thomas.weber@example.test', '913 550 202', 'Tróia', 'de', ['Casa de férias', 'Internacional'], 'Proprietário no estrangeiro; enviar fotografias do progresso.'],
      ['Sofia Almeida', 'sofia.almeida@example.test', '914 770 303', 'Setúbal', 'pt', ['Renovação'], 'Apartamento ocupado; proteger pavimentos e mobiliário.'],
      ['James Wilson', 'james.wilson@example.test', '915 880 404', 'Palmela', 'en', ['Holiday home'], 'Disponível por email; visitas apenas de manhã.'],
      ['Miguel Santos', 'miguel.santos@example.test', '916 990 505', 'Quinta do Conde', 'pt', ['Novo cliente'], 'Solicitou orçamento por recomendação.'],
      ['Helena Costa', 'helena.costa@example.test', '917 120 606', 'Sesimbra', 'pt', ['Manutenção'], 'Manutenção regular da moradia e jardim.'],
    ]) {
      clients[client[0]] = await upsert(connection, 'clients', { data_scope: 'demo', email: client[1] }, { name: client[0], phone: client[2], location: client[3], preferred_language: client[4], tags: JSON.stringify(client[5]), notes: client[6] })
    }

    const catalogDefinitions = [
      ['CAT-PLADUR', 'Pladur e tetos falsos', 'Divisórias, tetos, isolamento e acabamentos.', 28, 16, ['Kit base de pladur', [['Placa de gesso 13 mm', 'Leroy Merlin', 8, 'un.', 12.5], ['Perfil metálico 48 mm', 'MaxMat', 12, 'un.', 5.9], ['Massa de juntas', 'Leroy Merlin', 2, 'balde', 19.9]]]],
      ['CAT-BANHO', 'Renovação de casa de banho', 'Impermeabilização, revestimentos e equipamentos.', 32, 40, ['Renovação completa', [['Cerâmica de parede', 'Revigrés', 24, 'm²', 21.5], ['Impermeabilizante', 'Sika', 2, 'balde', 48], ['Cola flexível', 'Weber', 6, 'saco', 17.8], ['Torneira misturadora', 'Sanitana', 1, 'un.', 89]]]],
      ['CAT-PINTURA', 'Pintura interior', 'Preparação, primário e pintura de interiores.', 25, 20, ['Pintura T2', [['Tinta interior branca 15 L', 'CIN', 2, 'lata', 78], ['Primário aquoso 5 L', 'Robbialac', 1, 'lata', 39], ['Fita de pintura', 'MaxMat', 6, 'rolo', 4.2], ['Plástico de proteção', 'Leroy Merlin', 2, 'rolo', 8.5]]]],
      ['CAT-PAVIMENTO', 'Pavimentos e rodapés', 'Aplicação de pavimento flutuante e acabamentos.', 29, 24, ['Pavimento sala', [['Pavimento laminado AC5', 'Quick-Step', 32, 'm²', 23.9], ['Manta acústica', 'Leroy Merlin', 32, 'm²', 3.4], ['Rodapé branco', 'MaxMat', 28, 'm', 4.7]]]],
      ['CAT-IKEA', 'Montagem IKEA', 'Montagem e fixação segura de mobiliário.', 24, 8, ['Roupeiro PAX', [['Buchas universais', 'Würth', 1, 'cx.', 12.9], ['Parafusos 5x60', 'Würth', 1, 'cx.', 10.5], ['Calços de nivelamento', 'Leroy Merlin', 1, 'cx.', 8.4]]]],
      ['CAT-ELETRICA', 'Iluminação e pequenas instalações', 'Instalação de luminárias e mecanismos permitidos.', 34, 8, ['Iluminação interior', [['Foco LED embutir', 'Brico Depôt', 8, 'un.', 11.9], ['Cabo 3x1,5 mm', 'Leroy Merlin', 25, 'm', 1.15], ['Caixa de derivação', 'Efapel', 4, 'un.', 3.8]]]],
      ['CAT-JARDIM', 'Jardim e exteriores', 'Manutenção, rega e pequenas melhorias exteriores.', 23, 12, ['Manutenção sazonal', [['Substrato universal', 'Horto do Campo', 4, 'saco', 8.9], ['Tubo de rega 16 mm', 'Leroy Merlin', 30, 'm', 0.85], ['Programador de rega', 'Gardena', 1, 'un.', 54.9]]]],
    ]
    const catalogs = {}
    const lists = {}
    for (const [code, name, description, rate, hours, listDefinition] of catalogDefinitions) {
      const catalogId = await upsert(connection, 'service_catalog', { data_scope: 'demo', code }, { name, description, hourly_rate: rate, default_hours: hours, active: true })
      catalogs[code] = catalogId
      const [listName, items] = listDefinition
      const listId = await upsert(connection, 'purchase_lists', { data_scope: 'demo', service_catalog_id: catalogId, name: listName }, { notes: 'Lista demonstrativa editável.' })
      lists[code] = listId
      for (const [itemName, supplier, quantity, unit, price] of items) {
        await upsert(connection, 'purchase_list_items', { data_scope: 'demo', purchase_list_id: listId, name: itemName }, { supplier, quantity, unit, unit_price: price, description: 'Item habitual para este tipo de serviço.' })
      }
    }

    const jobDefinitions = [
      ['SRV-2026-001', 'Renovação da casa de banho', 'Ana Martins', 'Casa de banho', 'in_progress', 65, 4800, 'Azeitão', '2026-08-10', '2026-08-28'],
      ['SRV-2026-002', 'Pintura completa do apartamento', 'Sofia Almeida', 'Pintura', 'in_progress', 35, 2650, 'Setúbal', '2026-08-18', '2026-08-30'],
      ['SRV-2026-003', 'Preparação da casa de férias', 'Thomas Weber', 'Manutenção', 'waiting_client', 20, 1450, 'Tróia', '2026-08-22', '2026-09-05'],
      ['SRV-2026-004', 'Pavimento da sala e corredor', 'James Wilson', 'Pavimento', 'planned', 0, 3200, 'Palmela', '2026-09-02', '2026-09-12'],
      ['SRV-2026-005', 'Manutenção de jardim', 'Helena Costa', 'Jardim', 'in_progress', 80, 780, 'Sesimbra', '2026-08-15', '2026-08-23'],
    ]
    const jobs = {}
    for (const job of jobDefinitions) {
      jobs[job[0]] = await upsert(connection, 'service_jobs', { data_scope: 'demo', reference: job[0] }, { title: job[1], client_id: clients[job[2]], service: job[3], status: job[4], progress: job[5], budget: job[6], location: job[7], start_date: job[8], end_date: job[9], notes: 'Registo demonstrativo para testar o CRUD.' })
    }

    for (const task of [
      ['SRV-2026-001', 'Remover revestimentos antigos', 'completed', 1], ['SRV-2026-001', 'Aplicar impermeabilização', 'in_progress', 2], ['SRV-2026-001', 'Assentar cerâmica', 'pending', 3],
      ['SRV-2026-002', 'Proteger mobiliário', 'completed', 1], ['SRV-2026-002', 'Preparar paredes', 'in_progress', 2], ['SRV-2026-002', 'Aplicar acabamento', 'pending', 3],
      ['SRV-2026-005', 'Podar arbustos', 'completed', 1], ['SRV-2026-005', 'Rever sistema de rega', 'in_progress', 2],
    ]) await upsert(connection, 'service_job_tasks', { data_scope: 'demo', job_id: jobs[task[0]], title: task[1] }, { status: task[2], position: task[3] })

    for (const appointment of [
      ['Visita de acompanhamento', 'Ana Martins', 'SRV-2026-001', '2026-08-20 09:00:00', '2026-08-20 10:00:00', 'Azeitão', 'confirmed'],
      ['Escolha final de cores', 'Sofia Almeida', 'SRV-2026-002', '2026-08-20 15:00:00', '2026-08-20 16:00:00', 'Setúbal', 'scheduled'],
      ['Inspeção da propriedade', 'Thomas Weber', 'SRV-2026-003', '2026-08-21 10:30:00', '2026-08-21 12:00:00', 'Tróia', 'confirmed'],
      ['Medição do pavimento', 'James Wilson', 'SRV-2026-004', '2026-08-22 11:00:00', '2026-08-22 12:00:00', 'Palmela', 'scheduled'],
    ]) await upsert(connection, 'appointments', { data_scope: 'demo', title: appointment[0], starts_at: appointment[3] }, { client_id: clients[appointment[1]], job_id: jobs[appointment[2]], ends_at: appointment[4], location: appointment[5], status: appointment[6] })

    for (const message of [
      ['Ana Martins', 'whatsapp', 'Azulejos confirmados', 'Confirmo o modelo de azulejo que vimos ontem. Obrigada!', 'unread', 'normal'],
      ['Thomas Weber', 'email', 'Arrival dates', 'We will arrive on 4 September. Can the property be ready before then?', 'unread', 'high'],
      ['Sofia Almeida', 'website', 'Cor da sala', 'Podemos usar o tom mais claro na parede principal?', 'read', 'normal'],
      ['Helena Costa', 'phone', 'Sistema de rega', 'O programador voltou a desligar durante a noite.', 'unread', 'high'],
    ]) await upsert(connection, 'customer_messages', { data_scope: 'demo', client_id: clients[message[0]], subject: message[2] }, { channel: message[1], body: message[3], status: message[4], priority: message[5] })

    for (const material of [
      ['SRV-2026-001', 'Cerâmica de parede', 24, 'm²', 21.5, 'reserved', 'Revigrés'], ['SRV-2026-001', 'Cola flexível', 6, 'saco', 17.8, 'needed', 'Weber'],
      ['SRV-2026-002', 'Tinta interior branca', 2, 'lata', 78, 'purchased', 'CIN'], ['SRV-2026-002', 'Fita de pintura', 6, 'rolo', 4.2, 'needed', 'MaxMat'],
      ['SRV-2026-004', 'Pavimento laminado AC5', 32, 'm²', 23.9, 'needed', 'Quick-Step'], ['SRV-2026-005', 'Programador de rega', 1, 'un.', 54.9, 'reserved', 'Gardena'],
    ]) await upsert(connection, 'material_items', { data_scope: 'demo', job_id: jobs[material[0]], name: material[1] }, { quantity: material[2], unit: material[3], unit_cost: material[4], status: material[5], supplier: material[6] })

    const orders = [
      ['ENC-2026-001', 'SRV-2026-001', 'CAT-BANHO', 'Sanitana', 'ordered', 'Material de revestimento e impermeabilização.'],
      ['ENC-2026-002', 'SRV-2026-002', 'CAT-PINTURA', 'CIN Setúbal', 'received', 'Tintas e consumíveis de pintura.'],
      ['ENC-2026-003', 'SRV-2026-004', 'CAT-PAVIMENTO', 'Quick-Step', 'draft', 'Confirmar área antes de encomendar.'],
    ]
    for (const order of orders) {
      const orderId = await upsert(connection, 'orders', { data_scope: 'demo', reference: order[0] }, { job_id: jobs[order[1]], purchase_list_id: lists[order[2]], supplier: order[3], status: order[4], notes: order[5] })
      const [items] = await connection.query('SELECT name, quantity, unit, unit_price, supplier FROM purchase_list_items WHERE purchase_list_id = ? AND data_scope = ?', [lists[order[2]], 'demo'])
      for (const item of items) await upsert(connection, 'order_items', { data_scope: 'demo', order_id: orderId, name: item.name }, { quantity: item.quantity, unit: item.unit, unit_price: item.unit_price, supplier: item.supplier, status: order[4] === 'received' ? 'received' : 'pending' })
    }

    for (const quote of [
      ['ORC-2026-101', 'Miguel Santos', 'CAT-PLADUR', 'Divisória para escritório', 'new', 16, 28, 245, 18],
      ['ORC-2026-102', 'James Wilson', 'CAT-PAVIMENTO', 'Pavimento sala e corredor', 'sent', 24, 29, 980, 20],
      ['ORC-2026-103', 'Ana Martins', 'CAT-BANHO', 'Renovação de casa de banho', 'accepted', 40, 32, 1650, 22],
      ['ORC-2026-104', 'Thomas Weber', 'CAT-JARDIM', 'Manutenção exterior', 'analyzing', 12, 23, 240, 15],
    ]) {
      const base = quote[5] * quote[6] + quote[7]
      await upsert(connection, 'quotes', { data_scope: 'demo', reference: quote[0] }, { client_id: clients[quote[1]], service_catalog_id: catalogs[quote[2]], title: quote[3], status: quote[4], labor_hours: quote[5], hourly_rate: quote[6], materials_total: quote[7], margin_percent: quote[8], total: Math.round(base * (1 + quote[8] / 100) * 100) / 100, description: 'Orçamento demonstrativo editável.' })
    }

    await upsert(connection, 'quote_requests', { data_scope: 'demo', email: 'pedido.demo@example.test', name: 'Pedido Website Demo' }, { phone: '910 000 000', location: 'Setúbal', service: 'painting', description: 'Pretendo pintar sala e dois quartos, incluindo preparação das paredes.', preferred_language: 'pt', contact_method: 'whatsapp', consent_at: new Date(), attachments: JSON.stringify([]) })
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}
