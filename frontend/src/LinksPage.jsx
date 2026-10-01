import { useEffect, useState } from 'react'
import { Camera, Globe2, Mail, MapPin, MessageCircle, Phone, House, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { phoneDisplay, phoneHref, whatsappUrl } from './content'
import './LinksPage.css'

const instagramUrl = 'https://www.instagram.com/martinsinhouseservices/'
const facebookUrl = 'https://www.facebook.com/profile.php?id=61594265003019'
const websiteUrl = 'https://martinsinhouseservices.com/'

function LinkButton({ href, icon: Icon, children, primary = false, external = false }) {
  const className = primary ? 'links-button links-button--primary' : 'links-button'
  return <a className={className} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
    <Icon aria-hidden="true" />
    <span>{children}</span>
  </a>
}

const copy = {
  en: { call: 'CALL US', whatsapp: 'WHATSAPP CHAT', quote: 'REQUEST A FREE QUOTE', instagram: 'FOLLOW US ON INSTAGRAM', facebook: 'FOLLOW US ON FACEBOOK', website: 'VISIT MAIN WEBSITE', area: 'Setúbal, Portugal', tagline: '· PROFESSIONAL HOME RENOVATION ·\n· REPAIRS & MAINTENANCE ·', nav: 'Contact and social links', language: 'Choose language', footer: '© MARTINS IN HOUSE SERVICES', title: 'Contact and social links | Martins In House Services' },
  pt: { call: 'LIGAR', whatsapp: 'CONVERSAR NO WHATSAPP', quote: 'PEDIR ORÇAMENTO GRATUITO', instagram: 'SEGUIR NO INSTAGRAM', facebook: 'SEGUIR NO FACEBOOK', website: 'VISITAR O SITE', area: 'Setúbal, Portugal', tagline: '· RENOVAÇÃO PROFISSIONAL DE CASAS ·\n· REPARAÇÕES E MANUTENÇÃO ·', nav: 'Contactos e redes sociais', language: 'Escolher idioma', footer: '© MARTINS IN HOUSE SERVICES', title: 'Contactos e redes sociais | Martins In House Services' },
  de: { call: 'JETZT ANRUFEN', whatsapp: 'WHATSAPP CHAT', quote: 'KOSTENLOSES ANGEBOT ANFRAGEN', instagram: 'INSTAGRAM FOLGEN', facebook: 'FACEBOOK FOLGEN', website: 'WEBSITE BESUCHEN', area: 'Setúbal, Portugal', tagline: '· PROFESSIONELLE HAUSRENOVIERUNG ·\n· REPARATUREN & INSTANDHALTUNG ·', nav: 'Kontakt und soziale Medien', language: 'Sprache wählen', footer: '© MARTINS IN HOUSE SERVICES', title: 'Kontakt und soziale Medien | Martins In House Services' },
}

export default function LinksPage() {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('martins-links-language')
    return copy[savedLanguage] ? savedLanguage : 'en'
  })
  const labels = copy[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = labels.title
  }, [language, labels.title])

  function changeLanguage(value) {
    localStorage.setItem('martins-links-language', value)
    localStorage.setItem('martins-language', value)
    setLanguage(value)
  }

  return <main className="links-page">
    <section className="links-card" aria-label={labels.nav}>
      <header className="links-profile">
        <img className="links-logo" src="/images/martins-logo-footer.png" alt="Martins In House Services" />
        <p className="links-tagline">{labels.tagline}</p>
        <p className="links-location"><MapPin aria-hidden="true" />{labels.area}</p>
      </header>
      <div className="links-languages" role="group" aria-label={labels.language}>
        {['en', 'pt', 'de'].map((option) => <button key={option} type="button" className={language === option ? 'active' : ''} aria-pressed={language === option} onClick={() => changeLanguage(option)}>{option.toUpperCase()}</button>)}
      </div>
      <nav className="links-list" aria-label={labels.nav}>
        <LinkButton href={phoneHref} icon={Phone} primary>{labels.call} ({phoneDisplay})</LinkButton>
        <LinkButton href={whatsappUrl(language)} icon={MessageCircle} external>{labels.whatsapp}</LinkButton>
        <a href="/quote" className="links-button"><Mail aria-hidden="true" /><span>{labels.quote}</span></a>
        {instagramUrl ? <LinkButton href={instagramUrl} icon={Camera} external>{labels.instagram}</LinkButton> : null}
        {facebookUrl ? <LinkButton href={facebookUrl} icon={UsersRound} external>{labels.facebook}</LinkButton> : null}
        <a href={websiteUrl} className="links-button"><House aria-hidden="true" /><span>{labels.website}</span><Globe2 aria-hidden="true" className="links-end-icon" /></a>
      </nav>
      <footer className="links-footer">{labels.footer}</footer>
    </section>
  </main>
}