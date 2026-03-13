/**
 * @description      : ProcessSection — redesigned, inline styles, cyber-gold aesthetic
 * @author           : fortu
 * @version          : 2.0.0
 * @date             : 2026
 **/
import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* ── Tokens ── */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

/* ── Injected CSS ── */
const PROC_CSS = `
  .proc-card {
    position: relative;
    border: 1px solid rgba(201,168,76,0.18);
    background: rgba(10,10,10,0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 1.4rem 1.25rem 1.5rem;
    overflow: hidden;
    transition: transform 240ms ease, border-color 240ms ease,
                box-shadow 240ms ease, background 240ms ease;
  }
  .proc-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 320ms ease;
    pointer-events: none;
  }
  .proc-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${GOLD_DIM}, transparent);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 360ms cubic-bezier(.4,0,.2,1);
  }
  .proc-card:hover {
    transform: translateY(-5px);
    border-color: rgba(201,168,76,0.42);
    box-shadow: 0 14px 36px rgba(0,0,0,0.38), 0 0 0 1px rgba(201,168,76,0.07);
    background: rgba(14,14,14,0.78);
  }
  .proc-card:hover::before { opacity: 1; }
  .proc-card:hover::after  { transform: scaleX(1); }

  /* Corner accents */
  .proc-card .hc-tl { position:absolute;top:-1px;left:-1px;width:9px;height:9px;border-top:1px solid ${GOLD_BRIGHT};border-left:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none; }
  .proc-card .hc-br { position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-bottom:1px solid ${GOLD_BRIGHT};border-right:1px solid ${GOLD_BRIGHT};z-index:2;transition:width .3s,height .3s;pointer-events:none; }
  .proc-card:hover .hc-tl,
  .proc-card:hover .hc-br { width: 18px; height: 18px; }

  /* Number badge */
  .proc-num {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 0.14em;
    color: ${GOLD_DIM};
    border: 1px solid rgba(201,168,76,0.22);
    padding: 2px 8px;
    display: inline-flex; align-items: center; justify-content: center;
    transition: color 280ms, border-color 280ms;
    min-width: 36px;
  }
  .proc-card:hover .proc-num {
    color: ${GOLD_BRIGHT};
    border-color: rgba(201,168,76,0.55);
  }

  /* Icon glow on hover */
  .proc-icon {
    width: 20px; height: 20px;
    color: ${GOLD_DIM};
    display: inline-flex; align-items: center; justify-content: center;
    transition: color 280ms, filter 280ms;
  }
  .proc-card:hover .proc-icon {
    color: ${GOLD_BRIGHT};
    filter: drop-shadow(0 0 5px rgba(201,168,76,0.5));
  }

  /* Outcome pill */
  .proc-outcome {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; letter-spacing: 0.1em;
    color: rgba(201,168,76,0.5);
    margin-top: 14px;
    padding: 5px 10px;
    border: 1px solid rgba(201,168,76,0.12);
    background: rgba(201,168,76,0.03);
    transition: color 280ms, border-color 280ms, background 280ms;
    line-height: 1.5;
  }
  .proc-card:hover .proc-outcome {
    color: rgba(201,168,76,0.8);
    border-color: rgba(201,168,76,0.3);
    background: rgba(201,168,76,0.06);
  }

  /* Connector line between phases (desktop) */
  .proc-connector {
    position: absolute;
    top: 50%; right: -1px;
    width: 1px; height: 40%;
    background: linear-gradient(180deg, transparent, rgba(201,168,76,0.2), transparent);
    transform: translateY(-50%);
  }

  @keyframes procPulse {
    0%,100% { opacity: 0.4; }
    50%      { opacity: 1; }
  }

  @media (max-width: 860px) {
    .proc-section { padding: 60px 0 72px !important; }
    .proc-grid { grid-template-columns: repeat(2,1fr) !important; }
    .proc-flow { display: none !important; }
    .proc-flow-mobile { display: flex !important; }
    .proc-header { margin-bottom: 36px !important; }
  }
  @media (max-width: 520px) {
    .proc-section { padding: 44px 0 56px !important; }
    .proc-grid { grid-template-columns: 1fr !important; }
    .proc-card { padding: 1.1rem 1rem 1.2rem !important; }
    .proc-card p { font-size: 0.88rem !important; }
    .proc-outcome { font-size: 8px !important; }
  }
`

/* ── SVG icons (replaces lucide dependency) ── */
const Icons = {
  SearchCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
      <path d="m9 11 2 2 4-4"/>
    </svg>
  ),
  ShieldCheck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  ),
  Radar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/>
      <path d="M4 6h.01"/>
      <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/>
      <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/>
      <path d="M12 18h.01"/>
      <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/>
      <circle cx="12" cy="12" r="2"/>
      <path d="m13.41 10.59 5.66-5.66"/>
    </svg>
  ),
  AutomateIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  EvolveIcon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
    </svg>
  ),
}

/* ── Process data ── */
const STEPS = [
  {
    title: 'Discover',
    desc: 'Assess infrastructure, map attack surfaces, and prioritize exposure across application, identity, and cloud layers.',
    outcome: 'Clear risk baseline and prioritized roadmap',
    Icon: Icons.SearchCheck,
    phase: 'PHASE 1',
  },
  {
    title: 'Defend',
    desc: 'Harden controls, close high-impact gaps, and introduce preventive guardrails in engineering and operations workflows.',
    outcome: 'Reduced exploitability and stronger resilience',
    Icon: Icons.ShieldCheck,
    phase: 'PHASE 2',
  },
  {
    title: 'Develop',
    desc: 'Embed secure-by-default practices into delivery pipelines with iterative validation, monitoring, and continuous improvement.',
    outcome: 'Security scales with every release cycle',
    Icon: Icons.Radar,
    phase: 'PHASE 3',
  },
  {
    title: 'Validate',
    desc: 'Execute targeted verification, attack-path checks, and control validation to ensure remediation efforts hold under real pressure.',
    outcome: 'Proven controls with reduced regression risk',
    Icon: Icons.SearchCheck,
    phase: 'PHASE 4',
  },
  {
    title: 'Automate',
    desc: 'Operationalize repeatable checks, integrate policy enforcement, and embed security signals directly into delivery and runtime workflows.',
    outcome: 'Faster teams with consistent protection',
    Icon: Icons.AutomateIcon,
    phase: 'PHASE 5',
  },
  {
    title: 'Evolve',
    desc: 'Continuously refine posture with incident learnings, telemetry feedback, and strategic improvements aligned to changing threats.',
    outcome: 'Adaptive, long-term cyber resilience',
    Icon: Icons.EvolveIcon,
    phase: 'PHASE 6',
  },
]

const fadeUp = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0} }
const tv = (d=0) => ({ duration:0.48, ease:[0.22,1,0.36,1], delay:d })

export default function ProcessSection() {
  useEffect(() => {
    if (document.getElementById('proc-css')) return
    const s = document.createElement('style')
    s.id = 'proc-css'
    s.textContent = PROC_CSS
    document.head.appendChild(s)
  }, [])

  const headerRef  = useRef(null)
  const headerView = useInView(headerRef, { once:true, margin:'-60px' })

  return (
    <section id="process" className="proc-section" style={{
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

        {/* ── Header ── */}
        <motion.div ref={headerRef}
          initial="hidden" animate={headerView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0)}
          className="proc-header"
          style={{ textAlign:'center', marginBottom:56 }}
        >
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:16}}>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
            <span style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.24em',color:GOLD_DIM}}>// 04 — METHOD</span>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
          </div>

          <h2 style={{
            fontFamily:SANS, fontWeight:300,
            fontSize:'clamp(1.8rem,3.5vw,2.6rem)',
            color:GOLD, letterSpacing:'0.14em',
            textTransform:'uppercase', margin:'0 0 20px',
          }}>
            Process
          </h2>

          <p style={{
            fontFamily:SANS, fontWeight:400,
            fontSize:'clamp(1rem,1.2vw,1.1rem)',
            color:'rgba(245,245,245,0.7)', maxWidth:580,
            margin:'0 auto', lineHeight:1.74, letterSpacing:'0.03em',
          }}>
            A six-stage security delivery model designed to build momentum from discovery
            to resilience — each phase creating practical outcomes your teams can
            operationalize quickly.
          </p>
        </motion.div>

        {/* ── Phase flow indicator ── */}
        <motion.div
          initial="hidden" animate={headerView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0.1)}
          className="proc-flow"
          style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            gap:0, marginBottom:40, overflowX:'auto',
          }}
        >
          {STEPS.map((step, i) => (
            <div key={step.title} style={{display:'flex',alignItems:'center'}}>
              <div style={{
                fontFamily:MONO, fontSize:'9px', letterSpacing:'0.12em',
                color: i === 0 ? GOLD_BRIGHT : GOLD_DIM,
                padding:'4px 12px',
                border:`1px solid ${i === 0 ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.15)'}`,
                background: i === 0 ? 'rgba(201,168,76,0.08)' : 'transparent',
                whiteSpace:'nowrap',
                transition:'all .3s',
              }}>
                {step.title.toUpperCase()}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width:20, height:1,
                  background:`linear-gradient(90deg,${GOLD_DIM},rgba(201,168,76,0.2))`,
                  flexShrink:0,
                }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* ── Mobile-only compact phase row ── */}
        <div className="proc-flow-mobile" style={{
          display:'none', alignItems:'center', justifyContent:'center',
          gap:6, marginBottom:32, flexWrap:'wrap',
        }}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={{
              fontFamily:MONO, fontSize:'9px', letterSpacing:'0.12em',
              color:GOLD_DIM,
              padding:'3px 10px',
              border:'1px solid rgba(201,168,76,0.15)',
            }}>
              {String(i+1).padStart(2,'0')} {step.title.toUpperCase()}
            </div>
          ))}
        </div>

        {/* ── Cards grid ── */}
        <div
          className="proc-grid"
          style={{
            display:'grid',
            gridTemplateColumns:'repeat(3,minmax(0,1fr))',
            gap:14,
          }}
        >
          {STEPS.map((step, i) => (
            <motion.article
              key={step.title}
              className="proc-card"
              role="listitem"
              initial="hidden"
              whileInView="visible"
              viewport={{ once:true, amount:0.25 }}
              variants={fadeUp}
              transition={tv(i * 0.08)}
            >
              <span className="hc-tl" />
              <span className="hc-br" />

              {/* Top row: number + icon */}
              <div style={{
                display:'flex', justifyContent:'space-between',
                alignItems:'center', marginBottom:14,
              }}>
                <span className="proc-num">{String(i+1).padStart(2,'0')}</span>
                <span className="proc-icon" aria-hidden="true">
                  <step.Icon />
                </span>
              </div>

              {/* Phase label */}
              <div style={{
                fontFamily:MONO, fontSize:'8px', letterSpacing:'0.2em',
                color:'rgba(201,168,76,0.35)', marginBottom:8,
              }}>
                {step.phase}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily:SANS, fontWeight:600,
                fontSize:'1.18rem', letterSpacing:'0.06em',
                color:GOLD, margin:'0 0 10px', lineHeight:1.2,
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily:SANS, fontWeight:400,
                fontSize:'0.95rem', lineHeight:1.65,
                color:'rgba(185,185,185,0.72)', margin:0,
              }}>
                {step.desc}
              </p>

              {/* Outcome */}
              <div className="proc-outcome">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {step.outcome}
              </div>
            </motion.article>
          ))}
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