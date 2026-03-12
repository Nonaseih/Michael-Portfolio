/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 09/03/2026 - 21:39:30
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 09/03/2026
    * - Author          : fortu
    * - Modification    : 
**/
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const trackedSections = ['about', 'experience', 'process', 'services', 'projects']

function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollBarRef = useRef(null)

  useEffect(() => {
    const setBarScaleX = gsap.quickTo(scrollBarRef.current, 'scaleX', {
      duration: 0.35,
      ease: 'power3.out',
    })

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 140
      let nextActiveSection = ''
      setIsScrolled(window.scrollY > 24)

      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0
      setBarScaleX(nextProgress)

      for (const sectionId of trackedSections) {
        const section = document.getElementById(sectionId)

        if (!section) {
          continue
        }

        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          nextActiveSection = sectionId
          break
        }
      }

      setActiveSection(nextActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  return (
    <header className={`top-nav ${isScrolled ? 'scrolled' : ''}`}>
      <span ref={scrollBarRef} className="nav-scrollbar" aria-hidden="true" />
      <a href="#home" className="brand">
        <span className="brand-text-full">MICHAEL // CYBER</span>
        <span className="brand-text-short">M/C</span>
      </a>
      <nav className="nav-links">
        <a href="#about" className={activeSection === 'about' ? 'active' : ''}>
          <span className="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>About</span>
        </a>
        <a href="#experience" className={activeSection === 'experience' ? 'active' : ''}>
          <span className="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 7V5h6v2m-9 0h12a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Experience</span>
        </a>
        <a href="#process" className={activeSection === 'process' ? 'active' : ''}>
          <span className="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7h8m0 0-2.5-2.5M12 7 9.5 9.5M20 17h-8m0 0 2.5-2.5M12 17l2.5 2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Process</span>
        </a>
        <a href="#services" className={activeSection === 'services' ? 'active' : ''}>
          <span className="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m12 3 7 4v5c0 4.2-2.5 7.7-7 9-4.5-1.3-7-4.8-7-9V7l7-4Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Services</span>
        </a>
        <a href="#projects" className={activeSection === 'projects' ? 'active' : ''}>
          <span className="nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h5l1.7 2h8.3A1.5 1.5 0 0 1 21 10.5v7A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Projects</span>
        </a>
      </nav>
      <a href="#contact" className="nav-contact">
        <span className="nav-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>Contact</span>
      </a>
    </header>
  )
}

export default Navbar
