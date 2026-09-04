import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BadgeCheck, Bath, Check, CheckCircle2, DoorOpen, FileText, Hammer, HeartHandshake, House, Languages, Lightbulb, Mail, MapPin, Menu, MessageCircle, PaintRoller, PanelsTopLeft, Phone, Plus, Quote, ShieldCheck, TreePine, UploadCloud, UserCheck, X } from 'lucide-react'
import { email, phoneDisplay, phoneHref, services, translations, whatsappUrl } from './content'
import './App.css'
import Admin from './Admin'
import SiteLoader from './SiteLoader'
import usePublicMotion from './usePublicMotion'

const LanguageContext = createContext(null)
const useLanguage = () => useContext(LanguageContext)
const serviceIcons = { PanelsTopLeft, Bath, PaintRoller, DoorOpen, Hammer, Lightbulb, TreePine }
const whyIcons = [ShieldCheck, UserCheck, BadgeCheck, House, HeartHandshake, Languages]
const Icons = { UploadCloud, ArrowRight }

function Brand() {
  return <Link className="brand" to="/" aria-label="Martins In House Services"><img src="/images/martins-logo-header.png" alt="Martins In House Services" className="header-logo" /></Link>
}

function Header() {
  const { language, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (!open || !navRef.current || !window.matchMedia('(max-width: 1120px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let context
    let cancelled = false
    import('gsap').then(({ gsap }) => {
      if (cancelled) return
      context = gsap.context(() => gsap.fromTo(navRef.current.children, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.035, ease: 'power2.out' }), navRef)
    })
    return () => { cancelled = true; context?.revert() }
  }, [open])
  const links = [['/', 'home'], ['/services', 'services'], ['/work', 'work'], ['/holiday-homes', 'holiday'], ['/about', 'about'], ['/reviews', 'reviews'], ['/contact', 'contact']]
  return <header className="site-header"><div className="header-inner"><Brand /><button className="menu-button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button><nav ref={navRef} className={open ? 'nav nav--open' : 'nav'} aria-label="Main navigation">{links.map(([to, key]) => <NavLink key={to} to={to} end={to === '/'}>{t.nav[key]}</NavLink>)}<div className="languages" aria-label="Language">{['pt', 'en', 'de'].map((item) => <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}</div><Link className="button button--small" to="/quote">{t.nav.quote}</Link></nav></div></header>
}

function Footer() {
  const { t } = useLanguage()
  return <footer className="footer"><div className="footer-grid"><div><Link className="footer-brand" to="/" aria-label="Martins In House Services"><img src="/images/martins-logo-footer.png" alt="Martins In House Services" className="footer-logo" /></Link><p>{t.footer.promise}</p></div><nav><Link to="/services">{t.nav.services}</Link><Link to="/work">{t.nav.work}</Link><Link to="/holiday-homes">{t.nav.holiday}</Link><Link to="/about">{t.nav.about}</Link></nav><div className="footer-contact"><a href={phoneHref}><Phone />{phoneDisplay}</a><a href={`mailto:${email}`}><Mail />{email}</a><span><MapPin />Setúbal, Portugal</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Martins In House Services. {t.footer.rights} · Deploy automático ativo</span><div><Link to="/privacy">{t.legal.privacyTitle}</Link><Link to="/cookies">{t.legal.cookieTitle}</Link></div></div></footer>
}

function MobileActions() {
  const { language, t } = useLanguage()
  return <nav className="mobile-actions"><a href={phoneHref}><Phone />{t.mobile.call}</a><a href={whatsappUrl(language)} target="_blank" rel="noreferrer"><MessageCircle />{t.mobile.whatsapp}</a><Link to="/quote"><FileText />{t.mobile.quote}</Link></nav>
}

function Seo() {
  const { language, t } = useLanguage()
  const { pathname } = useLocation()
  useEffect(() => {
    const titles = { '/': t.hero.title, '/services': t.nav.services, '/work': t.nav.work, '/holiday-homes': t.nav.holiday, '/about': t.nav.about, '/reviews': t.nav.reviews, '/contact': t.nav.contact, '/quote': t.nav.quote, '/privacy': t.legal.privacyTitle, '/cookies': t.legal.cookieTitle }
    const descriptions = { '/': t.hero.body, '/services': t.serviceSection.intro, '/work': t.work.body, '/holiday-homes': t.holiday.body, '/about': t.about.body, '/reviews': t.reviews.empty, '/contact': t.contact.body, '/quote': t.quote.body }
    const title = titles[pathname] ? `${titles[pathname]} | Martins In House Services` : 'Página não encontrada | Martins In House Services'
    const description = descriptions[pathname] || t.footer.promise
    const siteUrl = String(import.meta.env.VITE_SITE_URL || location.origin).replace(/\/$/, '')
    const canonical = `${siteUrl}${pathname === '/' ? '/' : pathname}`
    document.title = title
    document.documentElement.lang = language
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical)
  }, [language, pathname, t])
  return null
}

function Layout({ children }) {
  const location = useLocation()
  const publicSiteRef = useRef(null)
  usePublicMotion(publicSiteRef, location.pathname)
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [location.pathname])
  return <div ref={publicSiteRef} className="public-site"><Seo /><SiteLoader /><Header />{children}<Footer /><MobileActions /></div>
}

function ArrowLink({ to, children, secondary = false }) {
  return <Link className={secondary ? 'button button--outline' : 'button'} to={to}>{children}<ArrowRight /></Link>
}

function ServiceList({ full = false }) {
  const { t } = useLanguage()
  return <div className={full ? 'service-list service-list--full' : 'service-list'}>{services.map((service, index) => { const Icon = serviceIcons[service.icon]; const [title, description] = t.services[service.id]; return <article className="service-row" key={service.id}><span className="service-number">{String(index + 1).padStart(2, '0')}</span>{full ? <Icon className="service-icon" /> : null}<div><h3>{title}</h3><p>{description}</p></div><Plus className="service-plus" /></article> })}</div>
}

function ServicesSection({ full = false }) {
  const { t } = useLanguage()
  return <section className="section services-section"><div className="split-heading"><div><span className="section-label">{t.serviceSection.label}</span><h2>{t.serviceSection.title}</h2>{full ? <p>{t.serviceSection.intro}</p> : null}</div>{full ? null : <ArrowLink to="/services" secondary>{t.serviceSection.view}</ArrowLink>}</div><ServiceList full={full} /></section>
}

function WorkSection({ full = false }) {
  const { t } = useLanguage()
  const projects = [{ title: t.work.bathroom, image: '/images/bathroom-project.png', position: 'center' }, { title: t.work.painting, image: '/images/hero-renovation.png', position: 'left center' }, { title: t.work.flooring, image: '/images/hero-renovation.png', position: 'center bottom' }]
  return <section className="section work-section"><div className="split-heading"><div><span className="section-label">{t.work.label}</span><h2>{t.work.title}</h2><p>{t.work.body}</p></div>{full ? null : <ArrowLink to="/work" secondary>{t.nav.work}</ArrowLink>}</div><div className="work-grid">{projects.map((project, index) => <figure className={`project project--${index + 1}`} key={project.title}><img src={project.image} alt={project.title} style={{ objectPosition: project.position }} /><figcaption><span>{project.title}</span><small>{t.work.note}</small></figcaption></figure>)}</div></section>
}

function HolidaySection({ page = false }) {
  const { t } = useLanguage()
  return <section className={page ? 'holiday holiday--page' : 'holiday'}><div className="holiday-copy"><h2>{t.holiday.title}</h2><p>{t.holiday.body}</p><ul>{t.holiday.items.map((item) => <li key={item}><Check />{item}</li>)}</ul>{page ? <ArrowLink to="/quote">{t.nav.quote}</ArrowLink> : <ArrowLink to="/holiday-homes" secondary>{t.holiday.cta}</ArrowLink>}</div><img src="/images/holiday-home.png" alt="Holiday home maintenance in Setúbal" /></section>
}

function WhySection() {
  const { t } = useLanguage()
  return <section className="section why"><span className="section-label">{t.why.label}</span><h2>{t.why.title}</h2><div className="why-grid">{t.why.items.map(([title, body], index) => { const Icon = whyIcons[index]; return <article key={title}><Icon /><h3>{title}</h3><p>{body}</p></article> })}</div></section>
}

function HomePage() {
  const { language, t } = useLanguage()
  return <main><section className="hero"><div className="hero-copy"><h1>{t.hero.title}</h1><p>{t.hero.body}</p><div className="hero-actions"><ArrowLink to="/quote">{t.hero.quote}</ArrowLink><a className="button button--outline" href={whatsappUrl(language)} target="_blank" rel="noreferrer"><MessageCircle />{t.hero.whatsapp}</a><a className="text-link" href={phoneHref}><Phone />{t.hero.call}</a></div></div><div className="hero-media"><img src="/images/hero-renovation.png" alt="Professional home renovation in Setúbal" /><span /></div></section><ServicesSection /><WorkSection /><HolidaySection /><WhySection /><ContactBand /></main>
}

function PageIntro({ title, children }) { return <section className="page-intro"><h1>{title}</h1>{children ? <p>{children}</p> : null}</section> }
function ServicesPage() { const { t } = useLanguage(); return <main><PageIntro title={t.nav.services}>{t.serviceSection.intro}</PageIntro><ServicesSection full /><ContactBand /></main> }
function WorkPage() { const { t } = useLanguage(); return <main><PageIntro title={t.nav.work}>{t.work.body}</PageIntro><WorkSection full /><ContactBand /></main> }
function HolidayPage() { const { t } = useLanguage(); return <main><PageIntro title={t.nav.holiday}>{t.holiday.body}</PageIntro><HolidaySection page /><WhySection /><ContactBand /></main> }

function AboutPage() {
  const { t } = useLanguage()
  return <main><PageIntro title={t.about.title}>{t.about.body}</PageIntro><section className="section about-grid"><img src="/images/hero-renovation.png" alt="Martins In House Services at work" /><div><h2>{t.why.title}</h2><ul>{t.about.values.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul></div></section><WhySection /><ContactBand /></main>
}

function ReviewsPage() {
  const { t } = useLanguage()
  return <main><PageIntro title={t.reviews.title}>{t.reviews.empty}</PageIntro><section className="section review-placeholder"><Quote /><blockquote>{t.reviews.quote}</blockquote><p>{t.reviews.author}</p></section><ContactBand /></main>
}

function ContactBand() {
  const { language, t } = useLanguage()
  return <section className="contact-band"><div><h2>{t.contact.title}</h2><p>{t.contact.body}</p></div><div className="contact-band-actions"><ArrowLink to="/quote">{t.nav.quote}</ArrowLink><a href={whatsappUrl(language)} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight /></a></div></section>
}

function ContactPanel() {
  const { language, t } = useLanguage()
  return <aside className="contact-panel"><h2>{t.nav.contact}</h2><a href={phoneHref}><Phone />{phoneDisplay}<ArrowRight /></a><a href={whatsappUrl(language)} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp<ArrowRight /></a><a href={`mailto:${email}`}><Mail />{email}<ArrowRight /></a><span><MapPin />{t.contact.area}</span><span><Languages />{t.contact.languages}</span></aside>
}

function ContactPage() {
  const { t } = useLanguage()
  return <main><PageIntro title={t.contact.title}>{t.contact.body}</PageIntro><section className="section contact-layout"><ContactPanel /><div className="contact-note"><h2>{t.nav.quote}</h2><p>{t.quote.body}</p><ArrowLink to="/quote">{t.quote.submit}</ArrowLink></div></section></main>
}

function QuoteForm() {
  const { language, t } = useLanguage()
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  async function submit(event) {
    event.preventDefault(); setStatus('sending'); setErrors({})
    const form = event.currentTarget; const data = new FormData(form); data.set('preferred_language', language)
    try { const response = await fetch('/api/quote-requests', { method: 'POST', headers: { Accept: 'application/json' }, body: data }); const result = await response.json(); if (!response.ok) { setErrors(result.errors ?? {}); throw new Error('Validation failed') } form.reset(); setStatus('success') } catch { setStatus('error') }
  }
  const fieldError = (name) => errors[name] ? <small className="field-error">{errors[name][0]}</small> : null
  return <form className="quote-form" onSubmit={submit} encType="multipart/form-data"><label>{t.quote.name}<input name="name" required autoComplete="name" />{fieldError('name')}</label><label>{t.quote.phone}<input name="phone" required autoComplete="tel" />{fieldError('phone')}</label><label>{t.quote.email}<input name="email" type="email" required autoComplete="email" />{fieldError('email')}</label><label>{t.quote.location}<input name="location" required autoComplete="street-address" />{fieldError('location')}</label><label>{t.quote.service}<select name="service" required defaultValue=""><option value="" disabled>{t.quote.choose}</option>{services.map((item) => <option key={item.id} value={item.id}>{t.services[item.id][0]}</option>)}</select>{fieldError('service')}</label><label className="field-wide">{t.quote.description}<textarea name="description" required maxLength="2000" rows="5" />{fieldError('description')}</label><label>{t.quote.language}<select name="preferred_language" value={language} disabled><option value={language}>{language.toUpperCase()}</option></select></label><label>{t.quote.method}<select name="contact_method" required defaultValue=""><option value="" disabled>{t.quote.choose}</option>{['phone', 'whatsapp', 'email'].map((method, index) => <option key={method} value={method}>{t.quote.contactMethods[index]}</option>)}</select>{fieldError('contact_method')}</label><label>{t.quote.date}<input name="preferred_date" type="date" min={new Date().toISOString().slice(0, 10)} />{fieldError('preferred_date')}</label><label className="upload field-wide"><Icons.UploadCloud /><strong>{t.quote.upload}</strong><span>{t.quote.uploadHint}</span><input name="attachments[]" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple /></label><label className="consent field-wide"><input name="consent" type="checkbox" value="1" required /><span>{t.quote.consent}</span></label>{fieldError('consent')}<div className="field-wide form-submit"><button className="button" disabled={status === 'sending'}>{status === 'sending' ? t.quote.sending : t.quote.submit}<Icons.ArrowRight /></button>{status === 'success' ? <p className="form-message success">{t.quote.success}</p> : null}{status === 'error' ? <p className="form-message error">{t.quote.error}</p> : null}</div></form>
}

function QuotePage() { const { t } = useLanguage(); return <main><section className="quote-layout"><div><PageIntro title={t.quote.title}>{t.quote.body}</PageIntro><QuoteForm /></div><ContactPanel /></section></main> }
function LegalPage({ type }) { const { t } = useLanguage(); const privacy = type === 'privacy'; return <main><PageIntro title={privacy ? t.legal.privacyTitle : t.legal.cookieTitle}>{privacy ? t.legal.privacy : t.legal.cookies}</PageIntro></main> }
function NotFound() { return <main><PageIntro title="404">Page not found.</PageIntro></main> }

function App() {
  const [language, setLanguageState] = useState(() => localStorage.getItem('martins-language') || 'pt')
  const setLanguage = (value) => { localStorage.setItem('martins-language', value); setLanguageState(value) }
  const t = translations[language] ?? translations.pt
  if (window.location.pathname.startsWith('/admin')) return <Admin />
  return <LanguageContext.Provider value={{ language, setLanguage, t }}><BrowserRouter><Layout><Routes><Route path="/" element={<HomePage />} /><Route path="/services" element={<ServicesPage />} /><Route path="/work" element={<WorkPage />} /><Route path="/holiday-homes" element={<HolidayPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/reviews" element={<ReviewsPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/quote" element={<QuotePage />} /><Route path="/privacy" element={<LegalPage type="privacy" />} /><Route path="/cookies" element={<LegalPage type="cookies" />} /><Route path="*" element={<NotFound />} /></Routes></Layout></BrowserRouter></LanguageContext.Provider>
}

export default App
