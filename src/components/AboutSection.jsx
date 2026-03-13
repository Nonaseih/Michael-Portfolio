/**
 * @description      : AboutSection â€” redesigned, inline styles, cyber-gold aesthetic
 * @author           : fortu
 * @version          : 2.0.0
 * @date             : 2026
 **/
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
// import GhostCursor from './GhostCursor'

/* â”€â”€ Tokens â”€â”€ */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

/* â”€â”€ Injected CSS (hover pseudo-states only) â”€â”€ */
const ABOUT_CSS = `
  .ab-card {
    position: relative;
    border: 1px solid rgba(201,168,76,0.18);
    background: rgba(10,10,10,0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 1.35rem 1.2rem 1.4rem;
    transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease, background 240ms ease;
    overflow: hidden;
  }
  .ab-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 300ms ease;
    pointer-events: none;
  }
  .ab-card:hover {
    transform: translateY(-4px);
    border-color: rgba(201,168,76,0.45);
    box-shadow: 0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,168,76,0.08);
    background: rgba(14,14,14,0.75);
  }
  .ab-card:hover::before { opacity: 1; }

  /* Corner accents â€” grow on hover */
  .ab-card .hc-tl { position:absolute;top:-1px;left:-1px;width:8px;height:8px;border-top:1px solid ${GOLD_BRIGHT};border-left:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none; }
  .ab-card .hc-br { position:absolute;bottom:-1px;right:-1px;width:8px;height:8px;border-bottom:1px solid ${GOLD_BRIGHT};border-right:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none; }
  .ab-card:hover .hc-tl,
  .ab-card:hover .hc-br { width: 16px; height: 16px; }

  /* Number glyph */
  .ab-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.14em;
    color: ${GOLD_DIM};
    border: 1px solid rgba(201,168,76,0.22);
    padding: 2px 7px;
    display: inline-block;
    margin-bottom: 0.75rem;
    transition: color 240ms, border-color 240ms;
  }
  .ab-card:hover .ab-num {
    color: ${GOLD_BRIGHT};
    border-color: rgba(201,168,76,0.5);
  }

  /* Stat bar */
  .ab-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${GOLD_DIM}, ${GOLD});
    border-radius: 2px;
    transition: width 1.2s cubic-bezier(.4,0,.2,1);
  }

  @keyframes abPulse {
    0%,100% { opacity: 0.5; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.15); }
  }

  @media (max-width: 860px) {
    .ab-section { padding: 60px 0 72px !important; }
    .ab-cols { gap: 28px !important; }
    .ab-sidebar { flex: 1 1 100% !important; min-width: unset !important; }
    .ab-stats { flex-direction: column !important; }
  }
  @media (max-width: 600px) {
    .ab-section { padding: 44px 0 56px !important; }
    .ab-grid { grid-template-columns: 1fr !important; }
    .ab-card { padding: 1.1rem 1rem 1.15rem !important; }
    .ab-card p { font-size: 0.88rem !important; }
  }
`

/* â”€â”€ Card data â”€â”€ */
const CARDS = [
  { icon: '◆', title: 'Offensive Security Testing',       desc: 'Simulate real attacker behavior with structured recon, exploit validation, and clear remediation paths prioritized by risk and impact.' },
  { icon: '☁', title: 'Cloud & Infrastructure Hardening', desc: 'Design secure cloud foundations, least-privilege IAM controls, segmented networks, and hardened baselines for resilient production systems.' },
  { icon: '⬡', title: 'Secure CI/CD Delivery',            desc: 'Embed security gates in pipelines with dependency checks, secrets scanning, policy enforcement, and release controls that keep velocity high.' },
  { icon: '◉', title: 'Detection & Incident Readiness',   desc: 'Strengthen detection logic, telemetry quality, and response playbooks so teams can identify, contain, and recover from threats faster.' },
  { icon: '⚙', title: 'Threat-Led Risk Prioritization',   desc: 'Translate technical findings into business risk language that supports better security decisions, roadmap focus, and stakeholder alignment.' },
  { icon: '⊛', title: 'Automation for Security Ops',      desc: 'Reduce repetitive manual effort with scripted checks, workflow orchestration, and evidence collection that improves consistency at scale.' },
]

/* â”€â”€ Proficiency bars â”€â”€ */
const SKILLS = [
  { label: 'Penetration Testing',  pct: 94 },
  { label: 'Cloud Security',       pct: 88 },
  { label: 'DevOps / CI-CD',       pct: 85 },
  { label: 'Threat Modelling',     pct: 82 },
  { label: 'Incident Response',    pct: 79 },
]

/* â”€â”€ Variants â”€â”€ */
const fadeUp  = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0} }
const fadeIn  = { hidden:{opacity:0},      visible:{opacity:1}     }
const t       = (delay=0) => ({ duration:0.5, ease:[0.22,1,0.36,1], delay })

/* â”€â”€ Skill bar (animate when in view) â”€â”€ */
function SkillBar({ label, pct, index }) {
  const ref       = useRef(null)
  const inView    = useInView(ref, { once:true, margin:'-60px' })
  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.12em', color:'rgba(201,168,76,0.65)' }}>{label}</span>
        <span style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.1em',  color:GOLD_DIM }}>{pct}%</span>
      </div>
      <div style={{ height:2, background:'rgba(201,168,76,0.1)', borderRadius:2, overflow:'hidden' }}>
        <div className="ab-bar-fill" style={{ width: inView ? `${pct}%` : '0%' }}
          /* slight stagger per bar */
          // transition override via inline style trick
        />
      </div>
    </div>
  )
}

export default function AboutSection() {
  useEffect(() => {
    if (document.getElementById('about-css')) return
    const s = document.createElement('style')
    s.id = 'about-css'
    s.textContent = ABOUT_CSS
    document.head.appendChild(s)
  }, [])

  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once:true, margin:'-80px' })

  return (
    <section
      id="about"
      className="ab-section"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: 'transparent',
        padding: '88px 0 96px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background rule */}
      <div style={{
        position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
        width:'min(1120px,92vw)', height:'1px',
        background:`linear-gradient(90deg,transparent,${GOLD_DIM},transparent)`,
        opacity:.35,
      }} />

      {/* Ghost cursor effect removed */}

      <div style={{ width:'min(1120px,92vw)', margin:'0 auto', position:'relative', zIndex:2 }}>

        {/* â”€â”€ Section header â”€â”€ */}
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={t(0)}
          style={{ textAlign:'center', marginBottom:56 }}
        >
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, marginBottom:16 }}>
            <span style={{ width:40, height:1, background:GOLD, opacity:.4, display:'block' }} />
            <span style={{ fontFamily:MONO, fontSize:10, letterSpacing:'0.24em', color:GOLD_DIM }}>// 02 â€” BIO</span>
            <span style={{ width:40, height:1, background:GOLD, opacity:.4, display:'block' }} />
          </div>

          <h2 style={{
            fontFamily:SANS, fontWeight:300, fontSize:'clamp(1.8rem,3.5vw,2.6rem)',
            color:GOLD, letterSpacing:'0.14em', textTransform:'uppercase',
            margin:'0 0 20px',
          }}>
            About
          </h2>

          <p style={{
            fontFamily:SANS, fontWeight:400, fontSize:'clamp(1rem,1.2vw,1.12rem)',
            color:'rgba(245,245,245,0.72)', maxWidth:580, margin:'0 auto',
            lineHeight:1.74, letterSpacing:'0.03em',
          }}>
            I work at the intersection of cybersecurity and delivery engineering,
            helping teams build secure systems without slowing down product momentum.
          </p>
          <p style={{
            fontFamily:SANS, fontWeight:400, fontSize:'clamp(.95rem,1.1vw,1.04rem)',
            color:'rgba(185,185,185,0.58)', maxWidth:540, margin:'14px auto 0',
            lineHeight:1.74, letterSpacing:'0.03em',
          }}>
            My focus is practical: identify real attack paths, close exploitable gaps,
            and turn security into an everyday engineering habit through architecture,
            automation, and measurable controls.
          </p>
        </motion.div>

        {/* â”€â”€ Two-column: cards + skill bars â”€â”€ */}
        <div className="ab-cols" style={{ display:'flex', gap:48, alignItems:'flex-start', flexWrap:'wrap' }}>

          {/* LEFT â€” cards grid */}
          <div style={{ flex:'1 1 560px', minWidth:0 }}>
            <div
              className="ab-grid"
              style={{
                display:'grid',
                gridTemplateColumns:'repeat(2,minmax(0,1fr))',
                gap:14,
              }}
            >
              {CARDS.map((card, i) => (
                <motion.article
                  key={card.title}
                  className="ab-card"
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                  variants={fadeUp}
                  transition={t(0.08 + i * 0.07)}
                >
                  <span className="hc-tl" />
                  <span className="hc-br" />

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <span className="ab-num">{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontSize:15, color:GOLD_DIM, lineHeight:1 }}>{card.icon}</span>
                  </div>

                  <h3 style={{
                    fontFamily:SANS, fontWeight:600, fontSize:'1.05rem',
                    color:GOLD, margin:'0 0 8px', letterSpacing:'0.04em', lineHeight:1.3,
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontFamily:SANS, fontWeight:400, fontSize:'0.95rem',
                    color:'rgba(185,185,185,0.72)', margin:0, lineHeight:1.62,
                  }}>
                    {card.desc}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>

          {/* RIGHT — proficiency + mini bio */}
          <motion.div
            initial="hidden" animate={inView ? 'visible' : 'hidden'}
            variants={fadeUp} transition={t(0.2)}
            className="ab-sidebar"
            style={{ flex:'0 0 280px', minWidth:260 }}
          >
            {/* Mini identity card */}
            <div style={{
              border:'1px solid rgba(201,168,76,0.22)',
              background:'rgba(10,10,10,0.6)',
              backdropFilter:'blur(10px)',
              padding:'18px 20px',
              marginBottom:24,
              position:'relative',
            }}>
              <div style={{
                position:'absolute', top:-1, left:-1, width:10, height:10,
                borderTop:`1px solid ${GOLD_BRIGHT}`, borderLeft:`1px solid ${GOLD_BRIGHT}`,
              }} />
              <div style={{
                position:'absolute', bottom:-1, right:-1, width:10, height:10,
                borderBottom:`1px solid ${GOLD_BRIGHT}`, borderRight:`1px solid ${GOLD_BRIGHT}`,
              }} />

              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                {/* Avatar placeholder */}
                <div style={{
                  width:48, height:48, border:`1px solid rgba(201,168,76,0.35)`,
                  background:'rgba(201,168,76,0.06)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" width={22} height={22}>
                    <path d="m12 3 7 4v5c0 4.2-2.5 7.7-7 9-4.5-1.3-7-4.8-7-9V7l7-4Z"
                      stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m9.5 12 1.8 1.8 3.2-3.6"
                      stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily:SANS, fontWeight:600, fontSize:'1rem', color:GOLD, letterSpacing:'0.06em' }}>
                    Otenaike Michael
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.14em', color:GOLD_DIM, marginTop:2 }}>
                    SEC // DEV // OPS
                  </div>
                </div>
              </div>

              {/* Key facts */}
              {[
                { k:'Speciality', v:'Offensive Security' },
                { k:'Stack',      v:'Cloud / DevOps / AppSec' },
                { k:'Focus',      v:'Risk-driven engineering' },
              ].map(({ k, v }) => (
                <div key={k} style={{
                  display:'flex', justifyContent:'space-between',
                  padding:'6px 0',
                  borderBottom:'1px solid rgba(201,168,76,0.07)',
                }}>
                  <span style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.1em', color:GOLD_DIM }}>{k}</span>
                  <span style={{ fontFamily:SANS, fontWeight:400, fontSize:'0.9rem', color:'rgba(245,245,245,0.72)', letterSpacing:'0.04em' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Proficiency bars */}
            <div style={{
              border:'1px solid rgba(201,168,76,0.18)',
              background:'rgba(10,10,10,0.55)',
              backdropFilter:'blur(10px)',
              padding:'16px 18px',
            }}>
              <div style={{ fontFamily:MONO, fontSize:9, letterSpacing:'0.2em', color:GOLD_DIM, marginBottom:16 }}>
                // PROFICIENCY
              </div>
              {SKILLS.map((s, i) => (
                <SkillBar key={s.label} {...s} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom rule */}
      <div style={{
        position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'min(1120px,92vw)', height:'1px',
        background:`linear-gradient(90deg,transparent,${GOLD_DIM},transparent)`,
        opacity:.25,
      }} />
    </section>
  )
}
