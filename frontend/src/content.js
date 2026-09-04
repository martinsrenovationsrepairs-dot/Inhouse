export const phoneDisplay = '934 793 058'
export const phoneHref = 'tel:+351934793058'
export const email = import.meta.env.VITE_CONTACT_EMAIL || 'martins.renovations.repairs@gmail.com'

export const services = [
  { id: 'drywall', icon: 'PanelsTopLeft' },
  { id: 'bathroom', icon: 'Bath' },
  { id: 'painting', icon: 'PaintRoller' },
  { id: 'flooring', icon: 'DoorOpen' },
  { id: 'ikea', icon: 'Hammer' },
  { id: 'electrical', icon: 'Lightbulb' },
  { id: 'garden', icon: 'TreePine' },
]

export const translations = {
  en: {
    nav: { home: 'Home', services: 'Services', work: 'Our Work', holiday: 'Holiday Homes', about: 'About', reviews: 'Reviews', contact: 'Contact', quote: 'Request a Quote' },
    hero: { title: 'Reliable & Professional Home Renovation, Repairs & Maintenance in the Setúbal Area.', body: 'One trusted local partner for renovations, repairs, installations and property maintenance. We communicate in Portuguese, English and German.', quote: 'Request a Quote', whatsapp: 'WhatsApp Us', call: `Call now: ${phoneDisplay}` },
    serviceSection: { label: 'Our services', title: 'Complete home services, built around your needs.', intro: 'From a single repair to a complete room renovation, we take care of the details with practical advice and careful workmanship.', view: 'Explore all services' },
    services: {
      drywall: ['Drywall & Ceilings', 'Installation and repair of plasterboard walls, suspended ceilings, partitions and smooth finishes.'],
      bathroom: ['Bathroom Renovation & Tiling', 'Bathroom improvements, waterproofing, tiling, tile replacement, grouting and careful finishing.'],
      painting: ['Painting & Wallpapering', 'Preparation, interior and exterior painting, repainting, feature walls and wallpaper installation.'],
      flooring: ['Flooring & Door Installation', 'Installation and replacement of flooring, skirting, interior doors and finishing details.'],
      ikea: ['IKEA Furniture Assembly', 'Reliable assembly of wardrobes, beds, cabinets, shelving, tables and other IKEA furniture.'],
      electrical: ['Electrical & Lighting', 'Lighting, lamps, garden lighting and connection work where legally permitted and appropriately qualified.'],
      garden: ['Gardening & Outdoor', 'Garden maintenance, outdoor installations, lighting and practical improvement work.'],
    },
    work: { label: 'Selected work', title: 'Careful finishes. Practical results.', body: 'A preview of the type of renovation and finishing work we provide. These demonstration images will be replaced with verified project photography.', bathroom: 'Bathroom renovation', painting: 'Interior painting', flooring: 'Flooring installation', note: 'Project photography coming soon' },
    holiday: { title: 'Your local property partner — even when you are not here.', body: 'Own a property in the Setúbal area but do not live here full-time? We provide reliable renovation, repair and maintenance support for international homeowners, holiday properties, landlords and property managers.', items: ['Property preparation before your arrival', 'Repairs and touch-ups between guest stays', 'Regular maintenance and outdoor work', 'Project coordination while you are abroad'], cta: 'Holiday home services' },
    why: { label: 'Why Martins', title: 'Work you can rely on.', items: [['Reliable', 'Clear communication and dependable service.'], ['Professional', 'Careful workmanship and attention to detail.'], ['Quality', 'Clean, practical and durable results.'], ['Multiple services', 'One trusted team for many home needs.'], ['Respectful', 'We treat your property with care.'], ['Multilingual', 'Português, English and Deutsch.']] },
    about: { title: 'Local service, professional standards.', body: 'Martins In House Services brings renovation, repair, installation and maintenance work together under one dependable local service. Our approach is straightforward: understand the job, communicate clearly, protect the home and deliver a clean, practical result.', values: ['Honest and clear communication', 'Careful planning before work begins', 'Respect for your home and schedule', 'A practical solution for every project'] },
    reviews: { title: 'Trust is built one project at a time.', empty: 'Verified customer reviews will appear here as projects are completed.', quote: 'Clear communication, careful work and a home left clean and ready to enjoy.', author: 'Our service promise' },
    quote: { title: 'Tell us about your project.', body: 'Share a few details and photos. We will get back to you to discuss the work and prepare a quote.', name: 'Name', phone: 'Phone number', email: 'Email', location: 'Property / location', service: 'Service required', description: 'Description of work', language: 'Preferred language', method: 'Preferred contact method', date: 'Preferred date (optional)', files: 'Photos or videos (optional)', upload: 'Send us photos of the job', uploadHint: 'JPG, PNG, WEBP or PDF — up to 10 MB each', consent: 'I consent to my data being used to respond to this request in accordance with the Privacy Policy.', submit: 'Request a Quote', sending: 'Sending…', success: 'Thank you. Your request has been received and we will contact you soon.', error: 'We could not send your request. Please check the fields and try again.', choose: 'Choose an option', contactMethods: ['Phone', 'WhatsApp', 'Email'] },
    contact: { title: 'Let’s talk about your property.', body: 'Tell us what needs doing and where the property is located. We respond in Portuguese, English or German.', area: 'Setúbal & surrounding areas', languages: 'Português · English · Deutsch', pending: 'Temporary email — to be confirmed before launch' },
    legal: { privacyTitle: 'Privacy Policy', cookieTitle: 'Cookie Policy', privacy: 'Enquiry data is used only to respond to quote requests and manage the requested service. Files and personal information are stored securely and are not sold to third parties. You may request access, correction or deletion by contacting us.', cookies: 'This website currently uses only essential technical storage required for language preferences and form operation. Analytics or marketing cookies will only be enabled after an appropriate consent mechanism is configured.' },
    footer: { promise: 'Reliable & Professional Home Renovation, Repairs & Maintenance.', rights: 'All rights reserved.' },
    mobile: { call: 'Call', whatsapp: 'WhatsApp', quote: 'Get a Quote' },
  },
}

translations.pt = {
  ...translations.en,
  nav: { home: 'Início', services: 'Serviços', work: 'Trabalhos', holiday: 'Casas de Férias', about: 'Sobre Nós', reviews: 'Avaliações', contact: 'Contacto', quote: 'Pedir Orçamento' },
  hero: { title: 'Renovação, reparação e manutenção profissional na área de Setúbal.', body: 'Um parceiro local de confiança para renovações, reparações, instalações e manutenção de imóveis. Comunicamos em português, inglês e alemão.', quote: 'Pedir Orçamento', whatsapp: 'Falar no WhatsApp', call: `Ligue já: ${phoneDisplay}` },
  serviceSection: { label: 'Os nossos serviços', title: 'Todos os serviços para a sua casa, num só lugar.', intro: 'De uma pequena reparação à renovação completa de uma divisão, tratamos de cada detalhe com aconselhamento prático e trabalho cuidado.', view: 'Ver todos os serviços' },
  services: {
    drywall: ['Pladur e Tetos Falsos', 'Instalação e reparação de paredes em pladur, tetos falsos, divisórias e acabamentos lisos.'],
    bathroom: ['Renovação de Casas de Banho', 'Melhorias, impermeabilização, azulejos, substituição, betumação e acabamentos cuidados.'],
    painting: ['Pintura e Papel de Parede', 'Preparação, pintura interior e exterior, repintura, paredes de destaque e aplicação de papel.'],
    flooring: ['Pavimentos e Portas', 'Instalação e substituição de pavimentos, rodapés, portas interiores e acabamentos.'],
    ikea: ['Montagem de Móveis IKEA', 'Montagem de roupeiros, camas, armários, prateleiras, mesas e outros móveis IKEA.'],
    electrical: ['Eletricidade e Iluminação', 'Candeeiros, iluminação de jardim e ligações permitidas por lei e executadas com qualificação adequada.'],
    garden: ['Jardins e Exteriores', 'Manutenção de jardins, instalações exteriores, iluminação e melhorias práticas.'],
  },
  work: { label: 'Trabalhos selecionados', title: 'Acabamentos cuidados. Resultados práticos.', body: 'Uma amostra do tipo de renovação e acabamento que realizamos. Estas imagens de demonstração serão substituídas por fotografias verificadas dos projetos.', bathroom: 'Renovação de casa de banho', painting: 'Pintura interior', flooring: 'Instalação de pavimento', note: 'Fotografias de projetos em breve' },
  holiday: { title: 'O seu parceiro local — mesmo quando está longe.', body: 'Tem uma propriedade na área de Setúbal mas não vive cá todo o ano? Prestamos apoio de renovação, reparação e manutenção a proprietários internacionais, alojamentos de férias, senhorios e gestores de imóveis.', items: ['Preparação antes da chegada do proprietário', 'Reparações entre estadias de hóspedes', 'Manutenção regular e trabalhos exteriores', 'Coordenação de projetos enquanto está no estrangeiro'], cta: 'Serviços para casas de férias' },
  why: { label: 'Porquê a Martins', title: 'Trabalho em que pode confiar.', items: [['Fiável', 'Comunicação clara e serviço pontual.'], ['Profissional', 'Trabalho cuidado e atenção ao detalhe.'], ['Qualidade', 'Resultados limpos, práticos e duradouros.'], ['Vários serviços', 'Uma equipa para várias necessidades.'], ['Respeito', 'Cuidamos da sua propriedade.'], ['Multilingue', 'Português, English e Deutsch.']] },
  about: { title: 'Serviço local, padrões profissionais.', body: 'A Martins In House Services reúne renovação, reparação, instalação e manutenção num serviço local de confiança. A nossa abordagem é simples: compreender o trabalho, comunicar com clareza, proteger a casa e entregar um resultado limpo e prático.', values: ['Comunicação honesta e clara', 'Planeamento cuidado antes do início', 'Respeito pela sua casa e horários', 'Uma solução prática para cada projeto'] },
  reviews: { title: 'A confiança constrói-se projeto a projeto.', empty: 'As avaliações verificadas de clientes serão apresentadas aqui à medida que os projetos forem concluídos.', quote: 'Comunicação clara, trabalho cuidado e uma casa limpa e pronta a utilizar.', author: 'O nosso compromisso' },
  quote: { title: 'Conte-nos sobre o seu projeto.', body: 'Partilhe alguns detalhes e fotografias. Entraremos em contacto para conversar sobre o trabalho e preparar um orçamento.', name: 'Nome', phone: 'Telefone', email: 'Email', location: 'Imóvel / localização', service: 'Serviço pretendido', description: 'Descrição do trabalho', language: 'Idioma preferido', method: 'Contacto preferido', date: 'Data preferida (opcional)', files: 'Fotos ou documentos (opcional)', upload: 'Envie-nos fotografias do trabalho', uploadHint: 'JPG, PNG, WEBP ou PDF — até 10 MB cada', consent: 'Autorizo a utilização dos meus dados para responder a este pedido, de acordo com a Política de Privacidade.', submit: 'Pedir Orçamento', sending: 'A enviar…', success: 'Obrigado. Recebemos o seu pedido e entraremos em contacto brevemente.', error: 'Não foi possível enviar. Verifique os campos e tente novamente.', choose: 'Escolha uma opção', contactMethods: ['Telefone', 'WhatsApp', 'Email'] },
  contact: { title: 'Vamos falar sobre a sua propriedade.', body: 'Diga-nos o que precisa e onde fica o imóvel. Respondemos em português, inglês ou alemão.', area: 'Setúbal e arredores', languages: 'Português · English · Deutsch', pending: 'Email provisório — confirmar antes do lançamento' },
  legal: { privacyTitle: 'Política de Privacidade', cookieTitle: 'Política de Cookies', privacy: 'Os dados enviados são utilizados apenas para responder a pedidos de orçamento e gerir o serviço solicitado. Os ficheiros e dados pessoais são guardados com segurança e não são vendidos a terceiros. Pode pedir acesso, correção ou eliminação através dos nossos contactos.', cookies: 'Este site utiliza atualmente apenas armazenamento técnico essencial para preferências de idioma e funcionamento do formulário. Cookies analíticos ou de marketing só serão ativados após configuração de um mecanismo de consentimento adequado.' },
  footer: { promise: 'Renovação, reparação e manutenção profissional.', rights: 'Todos os direitos reservados.' },
  mobile: { call: 'Ligar', whatsapp: 'WhatsApp', quote: 'Orçamento' },
}

translations.de = {
  ...translations.en,
  nav: { home: 'Start', services: 'Leistungen', work: 'Projekte', holiday: 'Ferienimmobilien', about: 'Über uns', reviews: 'Bewertungen', contact: 'Kontakt', quote: 'Angebot anfragen' },
  hero: { title: 'Zuverlässige & professionelle Renovierung, Reparatur und Instandhaltung im Raum Setúbal.', body: 'Ihr zuverlässiger Partner vor Ort für Renovierungen, Reparaturen, Installationen und Immobilienpflege. Wir sprechen Portugiesisch, Englisch und Deutsch.', quote: 'Angebot anfragen', whatsapp: 'WhatsApp', call: `Jetzt anrufen: ${phoneDisplay}` },
  serviceSection: { label: 'Unsere Leistungen', title: 'Kompletter Hausservice, abgestimmt auf Ihren Bedarf.', intro: 'Von einer kleinen Reparatur bis zur vollständigen Raumrenovierung kümmern wir uns mit klarer Beratung und sorgfältiger Arbeit um jedes Detail.', view: 'Alle Leistungen' },
  services: {
    drywall: ['Trockenbau & Decken', 'Montage und Reparatur von Gipskartonwänden, abgehängten Decken, Trennwänden und Oberflächen.'],
    bathroom: ['Badrenovierung & Fliesen', 'Badmodernisierung, Abdichtung, Fliesen, Austausch, Verfugung und saubere Abschlüsse.'],
    painting: ['Maler- & Tapezierarbeiten', 'Vorbereitung, Innen- und Außenanstrich, Neuanstrich, Akzentwände und Tapeten.'],
    flooring: ['Böden & Türen', 'Montage und Austausch von Bodenbelägen, Sockelleisten, Innentüren und Abschlüssen.'],
    ikea: ['IKEA-Möbelmontage', 'Zuverlässige Montage von Schränken, Betten, Regalen, Tischen und weiteren IKEA-Möbeln.'],
    electrical: ['Elektrik & Beleuchtung', 'Lampen, Gartenbeleuchtung und gesetzlich zulässige Arbeiten mit geeigneter Qualifikation.'],
    garden: ['Garten & Außenbereich', 'Gartenpflege, Außeninstallationen, Beleuchtung und praktische Verbesserungen.'],
  },
  work: { label: 'Ausgewählte Arbeiten', title: 'Sorgfältige Ausführung. Praktische Ergebnisse.', body: 'Ein Einblick in unsere Renovierungs- und Ausbauarbeiten. Diese Beispielbilder werden durch verifizierte Projektfotos ersetzt.', bathroom: 'Badrenovierung', painting: 'Innenanstrich', flooring: 'Bodenverlegung', note: 'Projektfotos folgen' },
  holiday: { title: 'Ihr Partner vor Ort — auch wenn Sie nicht da sind.', body: 'Sie besitzen eine Immobilie im Raum Setúbal, leben aber nicht ganzjährig hier? Wir unterstützen internationale Eigentümer, Ferienimmobilien, Vermieter und Hausverwaltungen zuverlässig.', items: ['Vorbereitung vor Ihrer Ankunft', 'Reparaturen zwischen Gästeaufenthalten', 'Regelmäßige Wartung und Außenarbeiten', 'Projektkoordination während Ihrer Abwesenheit'], cta: 'Service für Ferienimmobilien' },
  why: { label: 'Warum Martins', title: 'Arbeit, auf die Sie sich verlassen können.', items: [['Zuverlässig', 'Klare Kommunikation und verbindlicher Service.'], ['Professionell', 'Sorgfalt und Liebe zum Detail.'], ['Qualität', 'Saubere, praktische und langlebige Ergebnisse.'], ['Viele Leistungen', 'Ein Team für viele Aufgaben.'], ['Respektvoll', 'Wir behandeln Ihr Eigentum sorgfältig.'], ['Mehrsprachig', 'Português, English und Deutsch.']] },
  about: { title: 'Lokaler Service, professionelle Standards.', body: 'Martins In House Services verbindet Renovierung, Reparatur, Installation und Instandhaltung in einem zuverlässigen lokalen Service. Wir verstehen die Aufgabe, kommunizieren klar, schützen Ihr Zuhause und liefern ein sauberes Ergebnis.', values: ['Ehrliche, klare Kommunikation', 'Sorgfältige Planung', 'Respekt für Ihr Zuhause und Ihre Zeit', 'Praktische Lösungen für jedes Projekt'] },
  reviews: { title: 'Vertrauen entsteht mit jedem Projekt.', empty: 'Verifizierte Kundenbewertungen erscheinen hier nach Abschluss der ersten Projekte.', quote: 'Klare Kommunikation, sorgfältige Arbeit und ein sauberes, bezugsfertiges Zuhause.', author: 'Unser Serviceversprechen' },
  quote: { ...translations.en.quote, title: 'Erzählen Sie uns von Ihrem Projekt.', body: 'Senden Sie uns einige Details und Fotos. Wir melden uns, um die Arbeiten zu besprechen und ein Angebot vorzubereiten.', name: 'Name', phone: 'Telefonnummer', location: 'Immobilie / Ort', service: 'Gewünschte Leistung', description: 'Beschreibung der Arbeiten', language: 'Bevorzugte Sprache', method: 'Bevorzugter Kontaktweg', date: 'Wunschtermin (optional)', files: 'Fotos oder Dokumente (optional)', upload: 'Senden Sie uns Fotos der Arbeiten', consent: 'Ich stimme der Verarbeitung meiner Daten zur Beantwortung dieser Anfrage gemäß der Datenschutzerklärung zu.', submit: 'Angebot anfragen', sending: 'Wird gesendet…', success: 'Vielen Dank. Ihre Anfrage ist eingegangen. Wir melden uns bald.', error: 'Die Anfrage konnte nicht gesendet werden. Bitte prüfen Sie die Felder.', choose: 'Bitte auswählen', contactMethods: ['Telefon', 'WhatsApp', 'E-Mail'] },
  contact: { title: 'Sprechen wir über Ihre Immobilie.', body: 'Sagen Sie uns, was zu tun ist und wo sich die Immobilie befindet. Wir antworten auf Portugiesisch, Englisch oder Deutsch.', area: 'Setúbal und Umgebung', languages: 'Português · English · Deutsch', pending: 'Vorläufige E-Mail — vor Veröffentlichung bestätigen' },
  legal: { privacyTitle: 'Datenschutzerklärung', cookieTitle: 'Cookie-Richtlinie', privacy: 'Anfragedaten werden ausschließlich zur Beantwortung von Angebotsanfragen und zur Abwicklung der gewünschten Leistung verwendet. Dateien und personenbezogene Daten werden sicher gespeichert und nicht verkauft. Sie können Auskunft, Berichtigung oder Löschung verlangen.', cookies: 'Diese Website verwendet derzeit nur technisch notwendige Speicherung für Spracheinstellungen und Formularfunktionen. Analyse- oder Marketing-Cookies werden erst nach Einrichtung einer geeigneten Einwilligung aktiviert.' },
  footer: { promise: 'Zuverlässige Renovierung, Reparatur und Instandhaltung.', rights: 'Alle Rechte vorbehalten.' },
  mobile: { call: 'Anrufen', whatsapp: 'WhatsApp', quote: 'Angebot' },
}

export function whatsappUrl(language = 'en') {
  const messages = {
    pt: 'Olá, gostaria de pedir um orçamento para um trabalho na área de Setúbal.',
    en: 'Hello, I would like to request a quote for work in the Setúbal area.',
    de: 'Hallo, ich möchte ein Angebot für Arbeiten im Raum Setúbal anfragen.',
  }
  return `https://wa.me/351934793058?text=${encodeURIComponent(messages[language])}`
}
