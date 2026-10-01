import { Facebook, Globe2, Instagram, Mail, MapPin, MessageCircle, Phone, House } from 'lucide-react'
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

export default function LinksPage({ language = 'en' }) {
  const isPortuguese = language === 'pt'
  const isGerman = language === 'de'
  const labels = isPortuguese
    ? { call: 'LIGAR', whatsapp: 'CONVERSAR NO WHATSAPP', quote: 'PEDIR ORÇAMENTO GRATUITO', instagram: 'SEGUIR NO INSTAGRAM', facebook: 'SEGUIR NO FACEBOOK', website: 'VISITAR O SITE', area: 'Setúbal, Portugal' }
    : isGerman
      ? { call: 'JETZT ANRUFEN', whatsapp: 'WHATSAPP CHAT', quote: 'KOSTENLOSES ANGEBOT ANFRAGEN', instagram: 'INSTAGRAM FOLGEN', facebook: 'FACEBOOK FOLGEN', website: 'WEBSITE BESUCHEN', area: 'Setúbal, Portugal' }
      : { call: 'CALL US', whatsapp: 'WHATSAPP CHAT', quote: 'REQUEST A FREE QUOTE', instagram: 'FOLLOW US ON INSTAGRAM', facebook: 'FOLLOW US ON FACEBOOK', website: 'VISIT MAIN WEBSITE', area: 'Setúbal, Portugal' }

  return <main className="links-page">
    <section className="links-card" aria-label="Martins In House Services links">
      <header className="links-profile">
        <img className="links-logo" src="/images/martins-logo.jpg" alt="Martins In House Services" />
        <p className="links-tagline">PROFESSIONAL HOME RENOVATION<br />• REPAIRS &amp; MAINTENANCE</p>
        <p className="links-location"><MapPin aria-hidden="true" />{labels.area}</p>
      </header>
      <nav className="links-list" aria-label="Contact and social links">
        <LinkButton href={phoneHref} icon={Phone} primary>{labels.call} ({phoneDisplay})</LinkButton>
        <LinkButton href={whatsappUrl(language)} icon={MessageCircle} external>{labels.whatsapp}</LinkButton>
        <Link to="/quote" className="links-button"><Mail aria-hidden="true" /><span>{labels.quote}</span></Link>
        {instagramUrl ? <LinkButton href={instagramUrl} icon={Instagram} external>{labels.instagram}</LinkButton> : null}
        {facebookUrl ? <LinkButton href={facebookUrl} icon={Facebook} external>{labels.facebook}</LinkButton> : null}
        <a href={websiteUrl} className="links-button"><House aria-hidden="true" /><span>{labels.website}</span><Globe2 aria-hidden="true" className="links-end-icon" /></a>
      </nav>
      <footer className="links-footer">© MARTINS IN HOUSE SERVICES</footer>
    </section>
  </main>
}