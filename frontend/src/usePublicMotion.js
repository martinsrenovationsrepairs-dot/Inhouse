import { useEffect } from 'react'

export default function usePublicMotion(scopeRef, pathname) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let context
    let observer
    let cancelled = false
    const cleanups = []

    async function setup() {
      const { gsap } = await import('gsap')
      if (cancelled) return

      context = gsap.context(() => {
        const header = scope.querySelector('.site-header')
        const pageLead = scope.querySelector('.hero-copy, .page-intro')
        const pageMedia = scope.querySelector('.hero-media')
        if (header) gsap.fromTo(header, { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' })
        if (pageLead) gsap.fromTo(pageLead, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.1, ease: 'power3.out' })
        if (pageMedia) gsap.fromTo(pageMedia, { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            observer.unobserve(entry.target)
            const items = entry.target.querySelectorAll('.service-row, .project, .why-grid article, .holiday-copy li, .contact-band-actions > *, .about-grid li')
            const timeline = gsap.timeline()
            timeline.fromTo(entry.target, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity,visibility' })
            if (items.length) timeline.fromTo(items, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.06, ease: 'power2.out', clearProps: 'transform,opacity,visibility' }, '-=0.28')
          })
        }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })

        scope.querySelectorAll('.section, .holiday, .contact-band').forEach((element) => observer.observe(element))

        scope.querySelectorAll('.button, .text-link, .contact-band-actions > a:last-child').forEach((element) => {
          const icon = element.querySelector('svg')
          const enter = () => {
            gsap.to(element, { y: -2, duration: 0.2, ease: 'power2.out', overwrite: true })
            if (icon) gsap.to(icon, { x: 4, duration: 0.2, ease: 'power2.out', overwrite: true })
          }
          const leave = () => {
            gsap.to(element, { y: 0, duration: 0.25, ease: 'power2.out', overwrite: true })
            if (icon) gsap.to(icon, { x: 0, duration: 0.25, ease: 'power2.out', overwrite: true })
          }
          element.addEventListener('pointerenter', enter)
          element.addEventListener('pointerleave', leave)
          cleanups.push(() => {
            element.removeEventListener('pointerenter', enter)
            element.removeEventListener('pointerleave', leave)
          })
        })

        scope.querySelectorAll('.project').forEach((project) => {
          const image = project.querySelector('img')
          const caption = project.querySelector('figcaption')
          const enter = () => {
            gsap.to(image, { scale: 1.025, duration: 0.55, ease: 'power3.out', overwrite: true })
            gsap.to(caption, { x: 5, duration: 0.3, ease: 'power2.out', overwrite: true })
          }
          const leave = () => {
            gsap.to(image, { scale: 1, duration: 0.55, ease: 'power3.out', overwrite: true })
            gsap.to(caption, { x: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
          }
          project.addEventListener('pointerenter', enter)
          project.addEventListener('pointerleave', leave)
          cleanups.push(() => { project.removeEventListener('pointerenter', enter); project.removeEventListener('pointerleave', leave) })
        })

        scope.querySelectorAll('.why-grid article').forEach((card) => {
          const icon = card.querySelector('svg')
          const enter = () => gsap.to(icon, { y: -5, rotate: -4, duration: 0.28, ease: 'back.out(2)', overwrite: true })
          const leave = () => gsap.to(icon, { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out', overwrite: true })
          card.addEventListener('pointerenter', enter)
          card.addEventListener('pointerleave', leave)
          cleanups.push(() => { card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave) })
        })

        scope.querySelectorAll('.quote-form input, .quote-form select, .quote-form textarea').forEach((field) => {
          const focus = () => gsap.to(field, { scale: 1.008, duration: 0.18, ease: 'power2.out', overwrite: true })
          const blur = () => gsap.to(field, { scale: 1, duration: 0.2, ease: 'power2.out', overwrite: true })
          field.addEventListener('focus', focus)
          field.addEventListener('blur', blur)
          cleanups.push(() => { field.removeEventListener('focus', focus); field.removeEventListener('blur', blur) })
        })

        scope.querySelectorAll('.service-row').forEach((row) => {
          if (row.closest('.service-list--full')) return
          const activate = () => {
            const plus = row.querySelector('.service-plus')
            const copy = row.querySelector('div')
            gsap.timeline().to(plus, { rotate: 90, duration: 0.22, ease: 'power2.out' }).to(plus, { rotate: 0, duration: 0.3, ease: 'back.out(2)' })
            gsap.fromTo(copy, { x: 0 }, { x: 6, duration: 0.16, yoyo: true, repeat: 1, ease: 'power1.inOut', clearProps: 'transform' })
          }
          row.addEventListener('click', activate)
          cleanups.push(() => row.removeEventListener('click', activate))
        })
      }, scope)
    }

    setup()
    return () => {
      cancelled = true
      observer?.disconnect()
      cleanups.forEach((cleanup) => cleanup())
      context?.revert()
    }
  }, [pathname, scopeRef])
}
