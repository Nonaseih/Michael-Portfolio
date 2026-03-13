/**
 * @description      : Navbar v4 â€” with ContactModal popout
 * @author           : fortu
 * @version          : 4.0.0
 * @date             : 2026
 **/
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/* â”€â”€ Tokens â”€â”€ */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

const NAV_LINKS = [
  { id: 'home',       label: 'Home',       icon: '⌂' },
  { id: 'about',      label: 'About',      icon: '◈' },
  { id: 'experience', label: 'Experience', icon: '▸' },
  { id: 'process',    label: 'Process',    icon: '↯' },
  { id: 'projects',   label: 'Projects',   icon: '⊟' },
  { id: 'services',   label: 'Services',   icon: '◎' },
]

const INJECTED_CSS = `
  @keyframes mcSlideDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes mcModalIn {
    from { opacity: 0; transform: translateY(-12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)     scale(1); }
  }
  @keyframes mcOverlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes mcCursor {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }

  #mc-logo  { animation: mcSlideDown 0.55s cubic-bezier(.22,1,.36,1) 0.08s both; }
  #mc-links { animation: mcSlideDown 0.55s cubic-bezier(.22,1,.36,1) 0.18s both; }
  #mc-cta   { animation: mcSlideDown 0.55s cubic-bezier(.22,1,.36,1) 0.34s both; }

  #mc-logo::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 0; height: 1px;
    background: ${GOLD};
    transition: width 0.35s cubic-bezier(.4,0,.2,1);
  }
  #mc-logo:hover::after { width: 100%; }

  #mc-nav.mc-scrolled::before {
    content: '';
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(201,168,76,0.012) 2px, rgba(201,168,76,0.012) 4px
    );
  }

  .mc-link::after {
    content: '';
    position: absolute; bottom: 0; left: 50%;
    width: 0; height: 1px;
    background: ${GOLD};
    transform: translateX(-50%);
    transition: width 0.28s cubic-bezier(.4,0,.2,1);
  }
  .mc-link.mc-active::after,
  .mc-link:hover::after { width: calc(100% - 20px); }

  .mc-link.mc-active::before {
    content: '';
    position: absolute; bottom: -1px; left: 50%;
    transform: translateX(-50%);
    width: 3px; height: 3px;
    background: ${GOLD_BRIGHT}; border-radius: 50%;
    box-shadow: 0 0 6px ${GOLD};
  }

  #mc-cta .mc-fill {
    position: absolute; inset: 0;
    background: ${GOLD};
    transform: translateX(-101%);
    transition: transform 0.32s cubic-bezier(.4,0,.2,1);
    z-index: 0;
  }
  #mc-cta:hover .mc-fill { transform: translateX(0); }

  #mc-progress-fill {
    height: 1px;
    background: linear-gradient(90deg, transparent, ${GOLD_DIM}, ${GOLD_BRIGHT});
    transform-origin: left;
    transition: transform 0.08s linear;
  }

  .mc-mob-link { transition: color 0.2s, padding-left 0.22s !important; }
  .mc-mob-link:hover { color: ${GOLD_BRIGHT} !important; padding-left: 14px !important; }

  /* â”€â”€ Contact modal â”€â”€ */
  .mc-modal-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: mcOverlayIn 0.22s ease both;
    display: flex; align-items: flex-start; justify-content: center;
    padding-top: 80px;
  }
  .mc-modal {
    width: min(540px, 94vw);
    background: rgba(6,6,4,0.98);
    border: 1px solid rgba(201,168,76,0.3);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    position: relative;
    animation: mcModalIn 0.32s cubic-bezier(.22,1,.36,1) both;
    box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.06);
  }
  .mc-modal-tl {
    position:absolute;top:-1px;left:-1px;
    width:14px;height:14px;
    border-top:1px solid ${GOLD_BRIGHT};border-left:1px solid ${GOLD_BRIGHT};
    pointer-events:none;
  }
  .mc-modal-br {
    position:absolute;bottom:-1px;right:-1px;
    width:14px;height:14px;
    border-bottom:1px solid ${GOLD_BRIGHT};border-right:1px solid ${GOLD_BRIGHT};
    pointer-events:none;
  }

  /* Form inputs */
  .mc-input, .mc-textarea {
    width: 100%;
    background: rgba(201,168,76,0.03);
    border: 1px solid rgba(201,168,76,0.18);
    color: rgba(245,245,245,0.88);
    font-family: ${SANS};
    font-size: 1rem;
    letter-spacing: 0.04em;
    padding: 11px 14px;
    outline: none;
    transition: border-color 240ms, background 240ms;
    box-sizing: border-box;
    resize: none;
    appearance: none;
    -webkit-appearance: none;
  }
  .mc-input::placeholder, .mc-textarea::placeholder {
    color: rgba(201,168,76,0.28);
    font-family: ${SANS};
    font-size: 0.95rem;
    letter-spacing: 0.04em;
  }
  .mc-input:focus, .mc-textarea:focus {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.05);
  }

  /* Submit button */
  .mc-submit {
    display: flex; align-items: center; justify-content: center; gap: 9px;
    width: 100%;
    font-family: ${MONO};
    font-size: 11px; letter-spacing: 0.18em;
    color: ${GOLD};
    background: transparent;
    border: 1px solid rgba(201,168,76,0.42);
    padding: 13px;
    cursor: pointer;
    position: relative; overflow: hidden;
    transition: color 0.28s, border-color 0.28s;
  }
  .mc-submit .mc-submit-fill {
    position: absolute; inset: 0;
    background: ${GOLD};
    transform: translateX(-101%);
    transition: transform 0.32s cubic-bezier(.4,0,.2,1);
    z-index: 0;
  }
  .mc-submit:hover { color: #060604; border-color: ${GOLD}; }
  .mc-submit:hover .mc-submit-fill { transform: translateX(0); }
  .mc-submit span { position: relative; z-index: 1; display: flex; align-items: center; gap: 9px; }
  .mc-submit:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

  /* Blinking cursor in sent state */
  .mc-cursor { animation: mcCursor 1.1s step-end infinite; display: inline-block; }

  /* Close button */
  .mc-close {
    background: none; border: none; cursor: pointer;
    color: rgba(201,168,76,0.4);
    font-size: 18px; line-height: 1;
    padding: 4px;
    transition: color 0.2s, transform 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .mc-close:hover { color: ${GOLD_BRIGHT}; transform: rotate(90deg); }

  /* Select type chips */
  .mc-chip {
    font-family: ${MONO}; font-size: 9px; letter-spacing: 0.12em;
    color: rgba(201,168,76,0.45);
    border: 1px solid rgba(201,168,76,0.18);
    padding: 5px 12px;
    cursor: pointer; background: transparent;
    transition: color 220ms, border-color 220ms, background 220ms;
    white-space: nowrap;
  }
  .mc-chip:hover { color: ${GOLD}; border-color: rgba(201,168,76,0.42); }
  .mc-chip.mc-chip-active {
    color: #060604;
    background: ${GOLD};
    border-color: ${GOLD};
  }

  #mc-burger { display: none !important; }

  @media (max-width: 820px) {
    #mc-links, #mc-cta { display: none !important; }
    #mc-burger          { display: flex !important; }
    #mc-nav-inner       { padding: 0 24px !important; }
  }
`

const ENQUIRY_TYPES = ['Pentest', 'Cloud Security', 'DevSecOps', 'Consultation', 'Other']

/* â”€â”€ Contact Modal â”€â”€ */
function ContactModal({ onClose }) {
  const [form,    setForm]    = useState({ name:'', email:'', message:'' })
  const [type,    setType]    = useState('Consultation')
  const [status,  setStatus]  = useState('idle') // idle | sending | sent | error
  const [errors,  setErrors]  = useState({})
  const overlayRef = useRef(null)

  /* Close on Escape */
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  /* Trap focus â€” body scroll lock */
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Valid email required'
    if (!form.message.trim()) e.message = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    /* Simulated send â€” replace with real endpoint */
    await new Promise(r => setTimeout(r, 1400))
    setStatus('sent')
  }

  const set = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors(er => ({ ...er, [key]: undefined }))
  }

  return createPortal(
      <div
        ref={overlayRef}
        className="mc-modal-overlay"
        onClick={e => { if (e.target === overlayRef.current) onClose() }}
        role="dialog" aria-modal="true" aria-label="Contact form"
      >
        <div className="mc-modal">
          <span className="mc-modal-tl" />
          <span className="mc-modal-br" />

          {/* â”€â”€ Header â”€â”€ */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'18px 22px 14px',
            borderBottom:'1px solid rgba(201,168,76,0.1)',
          }}>
            <div>
              <div style={{
                fontFamily:MONO, fontSize:'8px',
                letterSpacing:'0.24em', color:GOLD_DIM,
                marginBottom:4,
              }}>
                // INITIATE CONTACT
              </div>
              <div style={{
                fontFamily:SANS, fontWeight:600,
                fontSize:'1.35rem', letterSpacing:'0.08em',
                color:GOLD, lineHeight:1,
              }}>
                Let's Work Together
              </div>
            </div>
            <button className="mc-close" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {status === 'sent' ? (
            /* â”€â”€ Sent state â”€â”€ */
            <div style={{
              padding:'48px 28px',
              textAlign:'center',
              display:'flex', flexDirection:'column', alignItems:'center', gap:16,
            }}>
              <div style={{
                width:52, height:52,
                border:`1px solid rgba(201,168,76,0.35)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:GOLD, marginBottom:4,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{
                fontFamily:SANS, fontWeight:600,
                fontSize:'1.3rem', color:GOLD, letterSpacing:'0.06em',
              }}>
                Message Received
              </div>
              <div style={{
                fontFamily:SANS, fontSize:'0.95rem',
                color:'rgba(185,185,185,0.65)', lineHeight:1.65,
                maxWidth:320,
              }}>
                I'll review and get back to you within 24â€“48 hours.
              </div>
              <div style={{
                fontFamily:MONO, fontSize:'10px',
                letterSpacing:'0.16em', color:GOLD_DIM,
                marginTop:8,
              }}>
                SYS // TRANSMISSION COMPLETE<span className="mc-cursor">_</span>
              </div>
              <button
                onClick={onClose}
                style={{
                  marginTop:8,
                  fontFamily:MONO, fontSize:'10px', letterSpacing:'0.16em',
                  color:GOLD, background:'transparent',
                  border:`1px solid rgba(201,168,76,0.35)`,
                  padding:'10px 28px', cursor:'pointer',
                  transition:'background 0.26s, color 0.26s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background=GOLD; e.currentTarget.style.color='#060604' }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=GOLD }}
              >
                CLOSE
              </button>
            </div>
          ) : (
            /* â”€â”€ Form â”€â”€ */
            <form onSubmit={handleSubmit} noValidate style={{ padding:'20px 22px 24px' }}>
              {/* Enquiry type chips */}
              <div style={{ marginBottom:20 }}>
                <div style={{
                  fontFamily:MONO, fontSize:'8px',
                  letterSpacing:'0.2em', color:GOLD_DIM,
                  marginBottom:10,
                }}>
                  ENQUIRY TYPE
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {ENQUIRY_TYPES.map(t => (
                    <button
                      key={t} type="button"
                      className={`mc-chip${type === t ? ' mc-chip-active' : ''}`}
                      onClick={() => setType(t)}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                <div>
                  <input
                    className="mc-input"
                    placeholder="Name"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                  />
                  {errors.name && (
                    <div style={{ fontFamily:MONO, fontSize:'8px', color:'#cf6679', letterSpacing:'0.1em', marginTop:4 }}>
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    className="mc-input"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div style={{ fontFamily:MONO, fontSize:'8px', color:'#cf6679', letterSpacing:'0.1em', marginTop:4 }}>
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom:16 }}>
                <textarea
                  className="mc-textarea"
                  placeholder="Tell me about your security challenge or project..."
                  rows={5}
                  value={form.message}
                  onChange={set('message')}
                />
                {errors.message && (
                  <div style={{ fontFamily:MONO, fontSize:'8px', color:'#cf6679', letterSpacing:'0.1em', marginTop:4 }}>
                    {errors.message}
                  </div>
                )}
              </div>

              {/* Footer row: alt contact + submit */}
              <div style={{
                display:'flex', alignItems:'center',
                justifyContent:'space-between', gap:12,
                paddingTop:14,
                borderTop:'1px solid rgba(201,168,76,0.1)',
              }}>
                <div style={{
                  fontFamily:MONO, fontSize:'8px',
                  letterSpacing:'0.1em', color:'rgba(201,168,76,0.28)',
                  lineHeight:1.7,
                }}>
                  PGP available<br/>on request
                </div>

                <button
                  type="submit"
                  className="mc-submit"
                  disabled={status === 'sending'}
                  style={{ width:'auto', minWidth:180, flexShrink:0 }}
                >
                  <span className="mc-submit-fill" />
                  <span>
                    {status === 'sending' ? (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation:'spin 1s linear infinite' }}>
                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                        </svg>
                        SENDING...
                      </>
                    ) : (
                      <>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        SEND MESSAGE
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>,
      document.body
    )
}

function Navbar() {
  const [progress,    setProgress]    = useState(0)
  const [activeId,    setActiveId]    = useState('home')
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [ctaHover,    setCtaHover]    = useState(false)
  const [logoHover,   setLogoHover]   = useState(false)
  const [logoFull,    setLogoFull]    = useState(true)
  const [hovered,     setHovered]     = useState(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [scrolled,    setScrolled]    = useState(false)

  useEffect(() => {
    if (document.getElementById('mc-nav-css')) return
    const s = document.createElement('style')
    s.id = 'mc-nav-css'
    s.textContent = INJECTED_CSS
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    const fn = () => {
      const y   = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      setScrolled(y > 10)
      setLogoFull(y < 80)
      setProgress(max > 0 ? y / max : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const els = NAV_LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const fn = () => { if (window.innerWidth > 820) setMenuOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const go = id => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openContact = e => {
    e?.preventDefault()
    setMenuOpen(false)
    setContactOpen(true)
  }

  return (
    <>
      {/* â”€â”€ NAV â”€â”€ */}
      <nav
        id="mc-nav"
        className={scrolled ? 'mc-scrolled' : ''}
        style={{
          position:'fixed', top:0, left:0, right:0, zIndex:999,
          height: scrolled ? '54px' : '64px',
          background: scrolled ? 'rgba(4,4,3,0.97)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.22)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(0)',
          transition:'background 0.4s ease, border-color 0.4s ease, height 0.32s cubic-bezier(.4,0,.2,1)',
          overflow:'hidden',
        }}
      >
        {/* Progress */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0 }}>
          <div id="mc-progress-fill" style={{ transform:`scaleX(${progress})` }} />
        </div>

        <div
          id="mc-nav-inner"
          style={{
            width:'100%', maxWidth:1400,
            margin:'0 auto', height:'100%',
            display:'flex', alignItems:'center',
            padding:'0 48px', boxSizing:'border-box',
            position:'relative', zIndex:1,
          }}
        >
          {/* Logo */}
          <a
            id="mc-logo"
            href="#home"
            style={{
              fontFamily:MONO, fontSize:'13px', letterSpacing:'0.2em',
              color: logoHover ? GOLD_BRIGHT : GOLD,
              textDecoration:'none', whiteSpace:'nowrap',
              position:'relative', flexShrink:0,
              transition:'color 0.28s',
            }}
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
            onClick={e => { e.preventDefault(); go('home') }}
          >
            {/* Invisible spacer â€” always holds full-text width so layout never shifts */}
            <span style={{ display:'inline-flex', alignItems:'center', gap:4, visibility:'hidden', pointerEvents:'none' }} aria-hidden="true">
              MICHAEL
              <span style={{ margin:'0 2px' }}>//</span>
              CYBER
            </span>
            {/* Full text */}
            <span style={{
              display:'inline-flex', alignItems:'center', gap:4,
              position:'absolute', top:0, left:0,
              opacity: logoFull ? 1 : 0,
              transform: logoFull ? 'none' : 'translateX(-10px)',
              transition:'opacity 0.32s, transform 0.32s',
              pointerEvents: logoFull ? 'auto' : 'none',
            }}>
              MICHAEL
              <span style={{ color: logoHover ? GOLD : GOLD_DIM, margin:'0 2px', transition:'color 0.28s' }}>//</span>
              CYBER
            </span>
            {/* Short text */}
            <span style={{
              display:'inline-flex', alignItems:'center', gap:4,
              position:'absolute', top:0, left:0,
              opacity: logoFull ? 0 : 1,
              transform: logoFull ? 'translateX(10px)' : 'none',
              transition:'opacity 0.32s, transform 0.32s',
              pointerEvents: logoFull ? 'none' : 'auto',
            }}>
              M
              <span style={{ color: logoHover ? GOLD : GOLD_DIM, margin:'0 2px', transition:'color 0.28s' }}>//</span>
              C
            </span>
          </a>

          {/* Desktop links */}
          <ul
            id="mc-links"
            style={{
              display:'flex', alignItems:'center', gap:'2px',
              margin:'0 auto', listStyle:'none', padding:0,
            }}
          >
            {NAV_LINKS.map(({ id, label, icon }, idx) => {
              const isActive = activeId === id
              const isHov    = hovered === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={`mc-link${isActive ? ' mc-active' : ''}`}
                    style={{
                      display:'flex', alignItems:'center', gap:'5px',
                      fontFamily:MONO, fontSize:'11px', letterSpacing:'0.08em',
                      color: isActive ? GOLD_BRIGHT : isHov ? GOLD : 'rgba(201,168,76,0.45)',
                      textDecoration:'none',
                      padding:'6px 13px', position:'relative',
                      background: isHov ? 'rgba(201,168,76,0.07)' : 'transparent',
                      transition:'color 0.22s, background 0.22s',
                      whiteSpace:'nowrap',
                      animation:`mcSlideDown 0.55s cubic-bezier(.22,1,.36,1) ${0.26 + idx * 0.06}s both`,
                    }}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={e => { e.preventDefault(); go(id) }}
                  >
                    <span style={{
                      fontSize:'11px',
                      opacity: isActive || isHov ? 1 : 0.5,
                      transform: isHov ? 'scale(1.18)' : 'scale(1)',
                      transition:'opacity 0.22s, transform 0.28s',
                      display:'inline-block',
                    }}>
                      {icon}
                    </span>
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* CTA */}
          <a
            id="mc-cta"
            href="#"
            style={{
              display:'flex', alignItems:'center', gap:'7px',
              fontFamily:MONO, fontSize:'10.5px', letterSpacing:'0.16em',
              color: ctaHover ? '#060604' : GOLD,
              textDecoration:'none',
              padding:'8px 18px',
              border:`1px solid rgba(201,168,76,${ctaHover ? '0.9' : '0.55'})`,
              position:'relative', overflow:'hidden', flexShrink:0,
              transition:'color 0.28s, border-color 0.28s',
            }}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            onClick={openContact}
          >
            <span className="mc-fill" />
            <span style={{ position:'absolute', top:'-1px', left:'-1px', width:'6px', height:'6px', zIndex:2, borderTop:`1px solid ${GOLD_BRIGHT}`, borderLeft:`1px solid ${GOLD_BRIGHT}` }} />
            <span style={{ position:'absolute', bottom:'-1px', right:'-1px', width:'6px', height:'6px', zIndex:2, borderBottom:`1px solid ${GOLD_BRIGHT}`, borderRight:`1px solid ${GOLD_BRIGHT}` }} />
            <span style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:'7px' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m2 4 10 9 10-9"/>
              </svg>
              LET'S CONNECT
            </span>
          </a>

          {/* Hamburger — uneven lines */}
          <button
            id="mc-burger"
            style={{ flexDirection:'column', gap:'5px', cursor:'pointer', marginLeft:'auto', padding:'4px', background:'none', border:'none', alignItems:'flex-end' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            {[
              { w:'22px' },   // top   — full width
              { w:'14px' },   // mid   — short
              { w:'18px' },   // bot   — medium
            ].map(({ w }, i) => (
              <span key={i} style={{
                display:'block',
                width: menuOpen ? '22px' : w,
                height:'1px', background:GOLD,
                transformOrigin:'center',
                transition:'transform 0.3s, opacity 0.3s, width 0.3s',
                transform: menuOpen
                  ? i===0 ? 'translateY(6px) rotate(45deg)'
                  : i===2 ? 'translateY(-6px) rotate(-45deg)'
                  : 'none' : 'none',
                opacity: menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* â”€â”€ Mobile menu â”€â”€ */}
      <div
        style={{
          position:'fixed', top:'54px', left:0, right:0, zIndex:998,
          background:'rgba(4,4,3,0.98)',
          borderBottom:'1px solid rgba(201,168,76,0.18)',
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          padding:'12px 28px 24px',
          display:'flex', flexDirection:'column', gap:'2px',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-14px)',
          opacity: menuOpen ? 1 : 0,
          transition:'transform 0.28s cubic-bezier(.22,1,.36,1), opacity 0.28s ease',
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
        aria-hidden={!menuOpen}
      >
        <div style={{ fontFamily:MONO, fontSize:'8px', letterSpacing:'0.24em', color:GOLD_DIM, padding:'6px 0 12px', borderBottom:'1px solid rgba(201,168,76,0.1)', marginBottom:4 }}>
          // NAVIGATE
        </div>
        {NAV_LINKS.map(({ id, label, icon }) => (
          <a
            key={id} href={`#${id}`} className="mc-mob-link"
            style={{
              fontFamily:MONO, fontSize:'12px', letterSpacing:'0.12em',
              color: activeId === id ? GOLD_BRIGHT : 'rgba(201,168,76,0.52)',
              textDecoration:'none', padding:'11px 0',
              borderBottom:'1px solid rgba(201,168,76,0.07)',
              display:'flex', alignItems:'center', gap:'12px',
            }}
            onClick={e => { e.preventDefault(); go(id) }}
          >
            <span style={{ fontSize:'12px', opacity:0.7 }}>{icon}</span>
            {label}
            {activeId === id && (
              <span style={{ marginLeft:'auto', width:4, height:4, borderRadius:'50%', background:GOLD_BRIGHT, boxShadow:`0 0 6px ${GOLD}` }} />
            )}
          </a>
        ))}
        <a
          href="#footer"
          style={{
            fontFamily:MONO, fontSize:'11px', letterSpacing:'0.16em',
            color:GOLD, textDecoration:'none',
            padding:'12px 0', marginTop:12,
            display:'flex', alignItems:'center', justifyContent:'center', gap:'9px',
            border:`1px solid rgba(201,168,76,0.38)`,
            transition:'background 0.26s, color 0.26s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background=GOLD; e.currentTarget.style.color='#060604' }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=GOLD }}
          onClick={openContact}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 4 10 9 10-9"/>
          </svg>
          LET'S CONNECT
        </a>
      </div>

      {/* â”€â”€ Contact Modal â”€â”€ */}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}

export default Navbar
