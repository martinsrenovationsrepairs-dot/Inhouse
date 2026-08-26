import { useEffect, useRef, useState } from 'react'

function SiteLoader({ waitForContent = false }) {
  const rootRef = useRef(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    let context
    let cancelled = false

    async function animate() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (!waitForContent) setVisible(false)
        return
      }

      const { gsap } = await import('gsap')
      if (cancelled) return

      context = gsap.context(() => {
        const timeline = gsap.timeline({
          onComplete: waitForContent ? undefined : () => setVisible(false),
          repeat: waitForContent ? -1 : 0,
          repeatDelay: waitForContent ? 0.25 : 0,
        })
        timeline
          .fromTo('.site-loader__brand', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' })
          .fromTo('.site-loader__bar span', { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: 'power3.inOut' }, '-=0.15')
        if (waitForContent) timeline.to('.site-loader__bar span', { scaleX: 0, transformOrigin: 'right center', duration: 0.35, ease: 'power2.in' })
        else timeline.to(root, { yPercent: -100, duration: 0.65, ease: 'power3.inOut' }, '+=0.12')
      }, root)
    }

    animate()
    return () => {
      cancelled = true
      context?.revert()
    }
  }, [waitForContent])

  if (!visible) return null

  return <div ref={rootRef} className="site-loader" role="status" aria-live="polite" aria-label="A carregar o site">
    <div className="site-loader__content">
      <div className="site-loader__brand"><strong>MARTINS</strong><span>IN HOUSE SERVICES</span></div>
      <div className="site-loader__bar" aria-hidden="true"><span /></div>
      <small>A PREPARAR O SEU ESPAÇO</small>
    </div>
  </div>
}

export default SiteLoader
