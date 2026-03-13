/**
 * @description      : Footer — redesigned, cyber-gold aesthetic, inline styles
 * @author           : fortu
 * @version          : 2.0.0
 * @date             : 2026
 **/
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

/* ── Tokens ── */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

const EMAIL = 'example@email.com'

/* ── Injected CSS ── */
const FOOTER_CSS = `
  @keyframes ftScan {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100vw); }
  }
  @keyframes ftBlink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes ftPulse {
    0%,100% { box-shadow: 0 0 0px rgba(201,168,76,0); }
    50%      { box-shadow: 0 0 14px rgba(201,168,76,0.25); }
  }

  /* Scanline sweep across big headline */
  .ft-scanline {
    position: absolute; top: 0; left: 0;
    width: 60px; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent);
    animation: ftScan 6s linear infinite;
    pointer-events: none;
  }

  /* Nav links */
  .ft-link {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.4);
    text-decoration: none;
    padding: 7px 0;
    border-bottom: 1px solid rgba(201,168,76,0.07);
    transition: color 220ms, padding-left 220ms, border-color 220ms;
    cursor: pointer; background: none; border-left: none; border-right: none; border-top: none; outline: none;
  }
  .ft-link:last-child { border-bottom: none; }
  .ft-link:hover { color: ${GOLD_BRIGHT}; padding-left: 8px; border-color: rgba(201,168,76,0.2); }

  /* Email button */
  .ft-email-btn {
    display: inline-flex; align-items: center; gap: 12px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; letter-spacing: 0.14em;
    color: ${GOLD};
    border: 1px solid rgba(201,168,76,0.38);
    padding: 14px 28px;
    cursor: pointer; background: transparent;
    position: relative; overflow: hidden;
    transition: border-color 300ms, color 300ms;
  }
  .ft-email-btn::before {
    content: '';
    position: absolute; top: -1px; left: -1px;
    width: 11px; height: 11px;
    border-top: 1px solid ${GOLD_BRIGHT};
    border-left: 1px solid ${GOLD_BRIGHT};
    transition: width .3s, height .3s;
  }
  .ft-email-btn::after {
    content: '';
    position: absolute; bottom: -1px; right: -1px;
    width: 11px; height: 11px;
    border-bottom: 1px solid ${GOLD_BRIGHT};
    border-right: 1px solid ${GOLD_BRIGHT};
    transition: width .3s, height .3s;
  }
  .ft-email-btn:hover {
    border-color: rgba(201,168,76,0.7);
    background: rgba(201,168,76,0.05);
    animation: ftPulse 2s ease infinite;
  }
  .ft-email-btn:hover::before,
  .ft-email-btn:hover::after { width: 18px; height: 18px; }

  /* Fill-sweep CTA (secondary) */
  .ft-cta {
    display: inline-flex; align-items: center; gap: 9px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 0.16em;
    color: ${GOLD}; text-decoration: none;
    border: 1px solid rgba(201,168,76,0.42);
    padding: 11px 22px;
    transition: background 280ms, color 280ms, border-color 280ms;
    cursor: pointer; background: transparent;
  }
  .ft-cta:hover { background: ${GOLD}; color: #080808; border-color: ${GOLD}; }

  /* Back-to-top */
  .ft-top-btn {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.38);
    background: none; border: none;
    cursor: pointer;
    transition: color 220ms;
  }
  .ft-top-btn:hover { color: ${GOLD_BRIGHT}; }
  .ft-top-box {
    width: 30px; height: 30px;
    border: 1px solid rgba(201,168,76,0.28);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    transition: border-color 220ms, background 220ms;
  }
  .ft-top-btn:hover .ft-top-box {
    border-color: rgba(201,168,76,0.65);
    background: rgba(201,168,76,0.07);
  }

  /* Status dot */
  .ft-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #3ecf8e;
    animation: ftBlink 2.4s ease-in-out infinite;
    display: inline-block; margin-right: 7px;
  }

  @media (max-width: 720px) {
    .ft-section     { padding: 52px 0 28px !important; }
    .ft-headline    { font-size: clamp(2.4rem,11vw,4.5rem) !important; }
    .ft-cta-h1      { font-size: clamp(2rem,8vw,3.8rem) !important; }
    .ft-cta-h2      { font-size: clamp(1.7rem,7.5vw,3.5rem) !important; margin-bottom: 24px !important; }
    .ft-email-row   { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
    .ft-email-btn   { justify-content: center !important; padding: 13px 20px !important; }
    .ft-cta         { justify-content: center !important; }
    .ft-bottom-grid { flex-direction: column !important; gap: 32px !important; }
    .ft-nav-cols    { gap: 32px !important; }
    .ft-top-block   { align-items: flex-end !important; flex-direction: column !important; width: 100% !important; gap: 16px !important; }
    .ft-bottom-bar  { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
  }
  @media (max-width: 420px) {
    .ft-nav-cols  { gap: 20px !important; }
  }
`

const NAV_LINKS = [
  { label: 'Home',       href: '#home'       },
  { label: 'About',      href: '#about'       },
  { label: 'Experience', href: '#experience'  },
  { label: 'Process',    href: '#process'     },
  { label: 'Projects',   href: '#projects'    },
  { label: 'Services',   href: '#services'    },
]

const SOCIALS = [
  { label: 'GitHub',    href: '#', icon: (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V25"/>
    </svg>
  )},
  { label: 'LinkedIn',  href: '#', icon: (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )},
  { label: 'Twitter',   href: '#', icon: (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  )},
  { label: 'Instagram', href: '#', icon: (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )},
]

const fadeUp = { hidden:{opacity:0,y:18}, visible:{opacity:1,y:0} }
const tv = (d=0) => ({ duration:0.5, ease:[0.22,1,0.36,1], delay:d })

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const ref     = useRef(null)
  const inView  = useInView(ref, { once:true, margin:'-60px' })

  useEffect(() => {
    if (document.getElementById('footer-css')) return
    const s = document.createElement('style')
    s.id = 'footer-css'
    s.textContent = FOOTER_CSS
    document.head.appendChild(s)
  }, [])

  const handleEmail = () => {
    navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const scrollToTop = () => window.scrollTo({ top:0, behavior:'smooth' })

  return (
    <footer ref={ref} id="footer" style={{
      width:'100%', background:'#000',
      borderTop:'1px solid rgba(201,168,76,0.18)',
      position:'relative', overflow:'hidden',
    }}>
      {/* Subtle scanline on the big text */}
      <div className="ft-scanline" />

      {/* Top gradient rule */}
      <div style={{
        position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
        width:'min(1120px,92vw)', height:'1px',
        background:`linear-gradient(90deg,transparent,${GOLD_DIM},transparent)`,
        opacity:.45,
      }} />

      <div className="ft-section" style={{ width:'min(1120px,92vw)', margin:'0 auto', padding:'80px 0 36px' }}>

        {/* ── BIG CTA HEADLINE ── */}
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0)}
          style={{ marginBottom:52, position:'relative' }}
        >
          {/* Eyebrow */}
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
            <span style={{width:30,height:1,background:GOLD,opacity:.35,display:'block'}} />
            <span style={{fontFamily:MONO,fontSize:9,letterSpacing:'0.24em',color:GOLD_DIM}}>// GET IN TOUCH</span>
          </div>

          {/* Ghost watermark headline */}
          <div className="ft-headline" style={{
            fontFamily:SANS, fontWeight:800,
            fontSize:'clamp(3.2rem,9vw,7.5rem)',
            lineHeight:.92, letterSpacing:'-0.02em',
            color:GOLD, opacity:.06,
            userSelect:'none', pointerEvents:'none',
            position:'absolute', top:-10, left:0,
            whiteSpace:'nowrap',
          }}>
            LET'S WORK
          </div>

          {/* Real headline */}
          <div className="ft-cta-h1" style={{
            fontFamily:SANS, fontWeight:700,
            fontSize:'clamp(2.4rem,6vw,5.2rem)',
            lineHeight:1, color:GOLD,
            letterSpacing:'-0.01em',
            marginBottom:6,
          }}>
            Let's Build
          </div>
          <div className="ft-cta-h2" style={{
            fontFamily:SANS, fontWeight:300,
            fontSize:'clamp(2rem,5.5vw,4.8rem)',
            lineHeight:1,
            color:'rgba(201,168,76,0.32)',
            marginBottom:36, letterSpacing:'0.01em',
            fontStyle:'italic',
          }}>
            Something Secure.
          </div>


          {/* Email CTA row */}
          <div className="ft-email-row" style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap'}}>
            <button className="ft-email-btn" onClick={handleEmail}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 4 10 9 10-9"/>
              </svg>
              {copied ? (
                <span style={{display:'flex',alignItems:'center',gap:7}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  COPIED
                </span>
              ) : EMAIL}
            </button>

            <a href="#footer" className="ft-cta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.07 6.07l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.91 17z"/>
              </svg>
              SCHEDULE A CALL
            </a>
          </div>
        </motion.div>

        {/* ── Dashed divider ── */}
        <div style={{
          height:1, marginBottom:44,
          background:'repeating-linear-gradient(90deg,rgba(201,168,76,0.18) 0,rgba(201,168,76,0.18) 4px,transparent 4px,transparent 10px)',
        }} />

        {/* ── Bottom grid: brand | nav | socials | back-to-top ── */}
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0.12)}
          className="ft-bottom-grid"
          style={{
            display:'flex', justifyContent:'space-between',
            alignItems:'flex-start', flexWrap:'wrap', gap:40,
          }}
        >
          {/* Brand block */}
          <div style={{minWidth:180}}>
            <div style={{
              fontFamily:MONO, fontSize:'12px',
              letterSpacing:'0.3em', color:GOLD,
              textTransform:'uppercase', marginBottom:8,
            }}>
              MICHAEL<span style={{color:GOLD_DIM}}> // CYBER</span>
            </div>
            <div style={{
              fontFamily:SANS, fontWeight:400,
              fontSize:'0.92rem', color:'rgba(201,168,76,0.35)',
              lineHeight:1.7, maxWidth:160, letterSpacing:'0.04em',
            }}>
              Cybersecurity &<br />Penetration Testing
            </div>

            {/* Social icons row */}
            <div style={{display:'flex',gap:8,marginTop:20}}>
              {SOCIALS.map(({ label, href, icon }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width:30, height:30,
                  border:'1px solid rgba(201,168,76,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:GOLD_DIM, textDecoration:'none',
                  transition:'border-color 220ms,color 220ms,background 220ms',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.6)'; e.currentTarget.style.color=GOLD_BRIGHT; e.currentTarget.style.background='rgba(201,168,76,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.2)'; e.currentTarget.style.color=GOLD_DIM; e.currentTarget.style.background='transparent' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          <div className="ft-nav-cols" style={{display:'flex',gap:56,alignItems:'flex-start'}}>
            {/* Sitemap */}
            <div>
              <div style={{
                fontFamily:MONO, fontSize:'8px',
                letterSpacing:'0.24em', color:GOLD_DIM,
                textTransform:'uppercase', marginBottom:16,
                paddingBottom:10,
                borderBottom:'1px solid rgba(201,168,76,0.1)',
              }}>
                Sitemap
              </div>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={href} className="ft-link">{label}</a>
              ))}
            </div>

            {/* Contact block */}
            <div>
              <div style={{
                fontFamily:MONO, fontSize:'8px',
                letterSpacing:'0.24em', color:GOLD_DIM,
                textTransform:'uppercase', marginBottom:16,
                paddingBottom:10,
                borderBottom:'1px solid rgba(201,168,76,0.1)',
              }}>
                Contact
              </div>
              {[
                { label:'Email',    href:`mailto:${EMAIL}` },
                { label:'LinkedIn', href:'#' },
                { label:'GitHub',   href:'#' },
                { label:'Twitter',  href:'#' },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="ft-link">{label}</a>
              ))}

              {/* PGP / key hint */}
              <div style={{
                fontFamily:MONO, fontSize:'8px',
                letterSpacing:'0.1em', color:'rgba(201,168,76,0.2)',
                marginTop:16, lineHeight:1.7,
              }}>
                PGP KEY AVAILABLE<br />ON REQUEST
              </div>
            </div>
          </div>

          {/* Back to top */}
          <div className="ft-top-block" style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:24}}>
            <button className="ft-top-btn" onClick={scrollToTop}>
              BACK TO TOP
              <span className="ft-top-box">↑</span>
            </button>

            {/* System time / coords flavour text */}
            <div style={{
              fontFamily:MONO, fontSize:'8px',
              letterSpacing:'0.1em', color:'rgba(201,168,76,0.2)',
              textAlign:'right', lineHeight:1.8,
            }}>
              SYS // SECURE<br />
              {new Date().getFullYear()} — ACTIVE
            </div>
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom-bar" style={{
          marginTop:36, paddingTop:16,
          borderTop:'1px solid rgba(201,168,76,0.08)',
          display:'flex', justifyContent:'space-between',
          alignItems:'center', flexWrap:'wrap', gap:12,
        }}>
          <span style={{
            fontFamily:MONO, fontSize:'8px',
            letterSpacing:'0.18em', color:'rgba(201,168,76,0.22)',
          }}>
            © {new Date().getFullYear()} MICHAEL — ALL RIGHTS RESERVED
          </span>

          <div style={{display:'flex',alignItems:'center',gap:16}}>
            {/* Uptime / status flavour */}
            <span style={{
              fontFamily:MONO, fontSize:'8px',
              letterSpacing:'0.12em', color:'rgba(201,168,76,0.18)',
            }}>
              BUILT WITH PRECISION
            </span>
            <span style={{
              display:'flex', alignItems:'center', gap:5,
              fontFamily:MONO, fontSize:'8px',
              letterSpacing:'0.12em', color:'rgba(62,207,142,0.45)',
              }}> 
                {/* ALL SYSTEMS OPERATIONAL removed */}
              </span>
          </div>
        </div>
      </div>
    </footer>
  )
}