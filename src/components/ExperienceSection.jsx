/**
 * @description      : ExperienceSection â€” self-contained with ScrollReveal inline
 * @author           : fortu
 * @version          : 2.0.0
 * @date             : 2026
 **/
import { useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* â”€â”€ Tokens â”€â”€ */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

/* â”€â”€ Injected CSS â”€â”€ */
const EXP_CSS = `
  .exp-item {
    position: relative;
    padding: 28px 0 28px 32px;
    border-bottom: 1px solid rgba(201,168,76,0.1);
    transition: border-color 300ms ease;
  }
  .exp-item:last-child { border-bottom: none; }
  .exp-item:hover { border-color: rgba(201,168,76,0.28); }

  /* Timeline dot */
  .exp-dot {
    position: absolute;
    left: -1px;
    top: 36px;
    width: 8px;
    height: 8px;
    border: 1px solid ${GOLD_DIM};
    background: #000;
    transform: rotate(45deg);
    transition: border-color 300ms, background 300ms, box-shadow 300ms;
  }
  .exp-item:hover .exp-dot {
    border-color: ${GOLD_BRIGHT};
    background: rgba(201,168,76,0.15);
    box-shadow: 0 0 8px rgba(201,168,76,0.4);
  }

  /* Index badge */
  .exp-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.16em;
    color: ${GOLD_DIM};
    border: 1px solid rgba(201,168,76,0.2);
    padding: 2px 8px;
    display: inline-block;
    margin-bottom: 10px;
    transition: color 300ms, border-color 300ms;
  }
  .exp-item:hover .exp-badge {
    color: ${GOLD_BRIGHT};
    border-color: rgba(201,168,76,0.5);
  }

  /* ScrollReveal words */
  .sr-word {
    display: inline-block;
    will-change: opacity, filter;
  }

  @media (max-width: 780px) {
    .exp-section { padding: 60px 0 72px !important; }
    .exp-layout { flex-direction: column !important; }
    .exp-sidebar {
      width: 100% !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      border-left: none !important;
      border-top: 1px solid rgba(201,168,76,0.15) !important;
      padding: 20px 0 0 !important;
    }
    .exp-sidebar-item {
      flex: 1 1 calc(50% - 4px) !important;
      padding: 10px 14px !important;
      border-left: none !important;
      border-bottom: none !important;
      border: 1px solid rgba(201,168,76,0.18) !important;
    }
    .exp-sidebar-cta { width: 100% !important; box-sizing: border-box !important; }
  }
  @media (max-width: 600px) {
    .exp-section { padding: 44px 0 56px !important; }
    .exp-item { padding: 20px 0 20px 24px !important; }
    .exp-item h3 { font-size: 1.1rem !important; }
    .exp-sidebar-item { flex: 1 1 100% !important; }
  }
`

/* â”€â”€ ScrollReveal (inlined) â”€â”€ */
function ScrollReveal({
  children,
  enableBlur     = true,
  baseOpacity    = 0.12,
  baseRotation   = 2,
  blurStrength   = 3,
  rotationEnd    = 'bottom 90%',
  wordAnimationEnd = 'bottom 74%',
}) {
  const ref = useRef(null)

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split(/(\s+)/).map((word, i) => {
      if (word.match(/^\s+$/)) return word
      return <span className="sr-word" key={i}>{word}</span>
    })
  }, [children])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { transformOrigin:'0% 50%', rotate: baseRotation },
        { ease:'none', rotate:0, scrollTrigger:{ trigger:el, start:'top bottom', end:rotationEnd, scrub:true } }
      )
      const words = el.querySelectorAll('.sr-word')
      gsap.fromTo(words,
        { opacity: baseOpacity },
        { ease:'none', opacity:1, stagger:0.05, scrollTrigger:{ trigger:el, start:'top bottom-=20%', end:wordAnimationEnd, scrub:true } }
      )
      if (enableBlur) {
        gsap.fromTo(words,
          { filter:`blur(${blurStrength}px)` },
          { ease:'none', filter:'blur(0px)', stagger:0.05, scrollTrigger:{ trigger:el, start:'top bottom-=20%', end:wordAnimationEnd, scrub:true } }
        )
      }
    }, el)
    return () => ctx.revert()
  }, [enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength])

  return (
    <div ref={ref} style={{ margin:'4px 0' }}>
      <p style={{
        margin: 0,
        fontFamily: SANS,
        fontSize: 'clamp(1rem,1.25vw,1.18rem)',
        fontWeight: 500,
        lineHeight: 1.65,
        color: 'rgba(195,195,195,0.85)',
        letterSpacing: '0.02em',
      }}>
        {splitText}
      </p>
    </div>
  )
}

/* â”€â”€ Experience data â”€â”€ */
const EXPERIENCES = [
  {
    title: 'Cybersecurity Engineer',
    tags: ['Red Team', 'Cloud', 'Risk'],
    writeups: [
      'Led offensive assessments and remediation strategy to reduce enterprise risk across cloud and core infrastructure.',
      'Coordinated security decisions with engineering and operations teams to close critical findings with minimal release disruption.',
    ],
  },
  {
    title: 'Ethical Hacker',
    tags: ['Pentest', 'API', 'Network'],
    writeups: [
      'Performed authorized penetration tests on apps, APIs, and internal networks with high-confidence exploit validation.',
      'Delivered concise technical reports with practical remediation guidance that teams could implement immediately.',
    ],
  },
  {
    title: 'DevSecOps Consultant',
    tags: ['CI/CD', 'Pipeline', 'Automation'],
    writeups: [
      'Integrated security checks into CI/CD and release workflows without slowing delivery velocity.',
      'Improved deployment trust through automated controls, policy checks, and secure-by-default pipeline standards.',
    ],
  },
  {
    title: 'Cloud Security Specialist',
    tags: ['AWS', 'IAM', 'Hardening'],
    writeups: [
      'Implemented hardened cloud baselines, IAM guardrails, and segmentation controls for resilient platform operations.',
    ],
  },
  {
    title: 'Incident Readiness Lead',
    tags: ['Detection', 'Response', 'SIEM'],
    writeups: [
      'Improved response readiness with detection tuning, playbook refinement, and post-incident control improvements.',
    ],
  },
  {
    title: 'Security Program Advisor',
    tags: ['Strategy', 'Compliance', 'Risk'],
    writeups: [
      'Converted technical findings into business-prioritized action plans aligned with uptime, compliance, and product goals.',
    ],
  },
]

/* â”€â”€ Variants â”€â”€ */
const fadeUp = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} }
const tv = (d=0) => ({ duration:0.5, ease:[0.22,1,0.36,1], delay:d })

export default function ExperienceSection() {
  useEffect(() => {
    if (document.getElementById('exp-css')) return
    const s = document.createElement('style')
    s.id = 'exp-css'
    s.textContent = EXP_CSS
    document.head.appendChild(s)
  }, [])

  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once:true, margin:'-60px' })

  return (
    <section id="experience" className="exp-section" style={{
      position:'relative', background:'transparent',
      padding:'88px 0 96px', overflow:'hidden',
    }}>
      {/* Top rule */}
      <div style={{
        position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',
        width:'min(1120px,92vw)',height:'1px',
        background:`linear-gradient(90deg,transparent,${GOLD_DIM},transparent)`,
        opacity:.35,
      }} />

      <div style={{ width:'min(1120px,92vw)', margin:'0 auto' }}>

        {/* â”€â”€ Header â”€â”€ */}
        <motion.div ref={headerRef}
          initial="hidden" animate={headerInView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0)}
          style={{ marginBottom:52 }}
        >
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
            <span style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.24em',color:GOLD_DIM}}>// 03 â€” HISTORY</span>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
          </div>
          <h2 style={{
            fontFamily:SANS, fontWeight:300,
            fontSize:'clamp(1.8rem,3.5vw,2.6rem)',
            color:GOLD, letterSpacing:'0.14em',
            textTransform:'uppercase', margin:0,
          }}>
            Experience
          </h2>
        </motion.div>

        {/* â”€â”€ Layout: timeline left, sidebar right â”€â”€ */}
        <div className="exp-layout" style={{display:'flex',gap:48,alignItems:'flex-start'}}>

          {/* â”€â”€ Timeline column â”€â”€ */}
          <div style={{flex:1,minWidth:0,borderLeft:`1px solid rgba(201,168,76,0.15)`,paddingLeft:0}}>
            {EXPERIENCES.map((item, i) => (
              <div key={item.title} className="exp-item">
                <span className="exp-dot" />

                {/* Badge + tags row */}
                <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:4}}>
                  <span className="exp-badge">{String(i+1).padStart(2,'0')}</span>
                  {item.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily:MONO, fontSize:'9px', letterSpacing:'0.1em',
                      color:'rgba(201,168,76,0.45)',
                      border:'1px solid rgba(201,168,76,0.12)',
                      padding:'2px 7px',
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily:SANS, fontWeight:600,
                  fontSize:'clamp(1.15rem,1.6vw,1.35rem)',
                  color:GOLD, margin:'0 0 14px',
                  letterSpacing:'0.06em', lineHeight:1.2,
                }}>
                  {item.title}
                </h3>

                {/* Scroll-reveal writeups */}
                <div style={{display:'grid',gap:6}}>
                  {item.writeups.map((w) => (
                    <ScrollReveal key={w}>{w}</ScrollReveal>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* â”€â”€ Sidebar: summary stats â”€â”€ */}
          <motion.div
            initial="hidden" animate={headerInView ? 'visible' : 'hidden'}
            variants={fadeUp} transition={tv(0.18)}
            className="exp-sidebar"
            style={{
              flexShrink:0, width:220,
              display:'flex', flexDirection:'column', gap:0,
              borderLeft:`1px solid rgba(201,168,76,0.15)`,
              paddingLeft:0,
            }}
          >
            {[
              { icon:'◆', label:'Red Team Ops',     val:'5+ yrs'  },
              { icon:'☁', label:'Cloud Security',    val:'AWS/GCP' },
              { icon:'⬡', label:'DevSecOps',         val:'CI/CD'   },
              { icon:'◎', label:'Threat Modelling',  val:'STRIDE'  },
              { icon:'⊛', label:'Incident Response', val:'NIST'    },
              { icon:'⚙', label:'Compliance',        val:'ISO/SOC' },
            ].map(({ icon, label, val }) => (
              <div
                key={label}
                className="exp-sidebar-item"
                style={{
                  padding:'14px 20px',
                  borderBottom:'1px solid rgba(201,168,76,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  gap:12,
                  transition:'background 250ms, border-color 250ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(201,168,76,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <span style={{color:GOLD_DIM,fontSize:12}}>{icon}</span>
                  <span style={{fontFamily:SANS,fontSize:'0.9rem',color:'rgba(185,185,185,0.7)',letterSpacing:'0.04em'}}>{label}</span>
                </div>
                <span style={{fontFamily:MONO,fontSize:'9px',letterSpacing:'0.1em',color:GOLD_DIM,whiteSpace:'nowrap'}}>{val}</span>
              </div>
            ))}

            {/* CTA */}
            <a href="#footer" className="exp-sidebar-cta" style={{
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              fontFamily:MONO, fontSize:'10px', letterSpacing:'0.16em',
              color:GOLD, textDecoration:'none',
              padding:'14px 20px',
              border:`1px solid rgba(201,168,76,0.35)`,
              marginTop:16,
              transition:'background 250ms, border-color 250ms, color 250ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.background=GOLD; e.currentTarget.style.color='#000' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=GOLD }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 4 10 9 10-9"/>
              </svg>
              LET'S WORK TOGETHER
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{
        position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',
        width:'min(1120px,92vw)',height:'1px',
        background:`linear-gradient(90deg,transparent,${GOLD_DIM},transparent)`,
        opacity:.25,
      }} />
    </section>
  )
}
