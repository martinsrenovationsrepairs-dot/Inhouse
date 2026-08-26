export const allowedServices = new Set(['drywall', 'bathroom', 'painting', 'flooring', 'ikea', 'electrical', 'garden'])
export const allowedLanguages = new Set(['pt', 'en', 'de'])
export const allowedContactMethods = new Set(['phone', 'whatsapp', 'email'])

export function validateQuoteRequest(input = {}) {
  const errors = {}
  for (const field of ['name', 'phone', 'email', 'location', 'service', 'description', 'preferred_language', 'contact_method', 'consent']) {
    if (!String(input[field] || '').trim()) errors[field] = [`O campo ${field} é obrigatório.`]
  }
  if (!/^\S+@\S+\.\S+$/.test(input.email || '')) errors.email = ['Indique um email válido.']
  if (String(input.description || '').length < 10) errors.description = ['A descrição deve ter pelo menos 10 caracteres.']
  if (input.service && !allowedServices.has(input.service)) errors.service = ['Serviço inválido.']
  if (input.preferred_language && !allowedLanguages.has(input.preferred_language)) errors.preferred_language = ['Idioma inválido.']
  if (input.contact_method && !allowedContactMethods.has(input.contact_method)) errors.contact_method = ['Método de contacto inválido.']
  return errors
}

export function scopeFromDemoMode(enabled) {
  return enabled ? 'demo' : 'real'
}
