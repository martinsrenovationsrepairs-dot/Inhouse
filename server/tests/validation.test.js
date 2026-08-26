import test from 'node:test'
import assert from 'node:assert/strict'
import { scopeFromDemoMode, validateQuoteRequest } from '../validation.js'

test('data mode keeps demo and real scopes separate', () => {
  assert.equal(scopeFromDemoMode(true), 'demo')
  assert.equal(scopeFromDemoMode(false), 'real')
})

test('a complete quote request is accepted', () => {
  const errors = validateQuoteRequest({ name: 'Cliente', phone: '910000000', email: 'cliente@example.com', location: 'Setúbal', service: 'painting', description: 'Pintura completa de duas divisões.', preferred_language: 'pt', contact_method: 'whatsapp', consent: '1' })
  assert.deepEqual(errors, {})
})

test('invalid public data is rejected', () => {
  const errors = validateQuoteRequest({ email: 'invalido', service: 'unknown', description: 'curta' })
  assert.ok(errors.name)
  assert.ok(errors.email)
  assert.ok(errors.service)
  assert.ok(errors.description)
})
