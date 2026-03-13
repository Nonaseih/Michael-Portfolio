/**
 * @description      : ProjectsSection — redesigned with real CardSwap import
 * @author           : fortu
 * @version          : 2.0.0
 * @date             : 2026
 **/
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import CardSwap, { Card } from './CardSwap'

/* ── Tokens ── */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

/* ── Injected CSS (pseudo-elements + card-swap overrides only) ── */
const PROJ_CSS = `
  /* Card-swap gold palette override */
  .card-swap-container .card {
    border-color: rgba(201,168,76,0.2);
    background: linear-gradient(180deg,rgba(10,10,10,0.96),rgba(6,6,6,0.96));
  }
  .card-swap-container .card:hover {
    border-color: rgba(201,168,76,0.52);
    box-shadow: 0 6px 32px rgba(201,168,76,0.1);
  }

  /* Corner accents injected on .project-swap-card */
  .project-swap-card { position: relative; overflow: hidden; }
  .project-swap-card::before,
  .project-swap-card::after {
    content: '';
    position: absolute;
    width: 10px; height: 10px;
    z-index: 3; pointer-events: none;
    transition: width .3s, height .3s;
  }
  .project-swap-card::before {
    top: -1px; left: -1px;
    border-top: 1px solid ${GOLD_BRIGHT};
    border-left: 1px solid ${GOLD_BRIGHT};
  }
  .project-swap-card::after {
    bottom: -1px; right: -1px;
    border-bottom: 1px solid ${GOLD_BRIGHT};
    border-right: 1px solid ${GOLD_BRIGHT};
  }
  .project-swap-card:hover::before,
  .project-swap-card:hover::after { width: 18px; height: 18px; }

  /* Tag chip */
  .proj-tag {
    border: 1px solid rgba(201,168,76,0.28);
    background: rgba(201,168,76,0.04);
    color: rgba(201,168,76,0.7);
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; letter-spacing: 0.1em;
    padding: 3px 9px;
    transition: border-color 200ms, color 200ms, background 200ms;
    cursor: default;
  }
  .proj-tag:hover {
    border-color: rgba(201,168,76,0.55);
    color: ${GOLD_BRIGHT};
    background: rgba(201,168,76,0.08);
  }

  /* Left-panel list item hover */
  .proj-list-item { transition: color 200ms, padding-left 200ms; cursor: default; }
  .proj-list-item:hover  { color: ${GOLD_BRIGHT} !important; padding-left: 6px !important; }
  .proj-list-item.active { color: ${GOLD_BRIGHT} !important; padding-left: 6px !important; }

  /* Card visual grid bg */
  .proj-card-grid-bg {
    position: absolute; inset: 0; opacity: 0.05;
    background-image:
      linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px);
    background-size: 22px 22px;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    .proj-section  { padding: 60px 0 72px !important; }
    .proj-layout   { flex-direction: column !important; gap: 36px !important; }
    .proj-left     { flex: 1 1 100% !important; min-width: unset !important; }
    .proj-stage    { display: none !important; }
    .proj-mobile-grid { display: grid !important; }
  }
  @media (max-width: 520px) {
    .proj-section  { padding: 44px 0 56px !important; }
    .proj-mobile-grid { grid-template-columns: 1fr !important; }
  }
`

/* ── Inline SVG icons (no lucide dep needed in this file) ── */
const ICONS = {
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Cloud: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  ),
  Bot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/>
      <line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  MailWarning: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5"/>
      <path d="m2 6 10 7 10-7"/>
      <path d="M20 14v4"/><circle cx="20" cy="20" r=".5" fill="currentColor"/>
    </svg>
  ),
  Fingerprint: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10"/>
      <path d="M5 12a7 7 0 0 1 7-7 7 7 0 0 1 5.196 2.32"/>
      <path d="M8 12a4 4 0 0 1 4-4 4 4 0 0 1 2.959 1.32"/>
      <path d="M12 12v.01"/>
    </svg>
  ),
  ShieldAlert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

/* ── Project metadata (icon + tags keyed by name) ── */
const PROJECT_META = {
  'Zero Trust Rollout':        { Icon: ICONS.Shield,      tags: ['IAM', 'Zero Trust', 'Identity', 'Policy']         },
  'Cloud Threat Hardening':    { Icon: ICONS.Cloud,       tags: ['AWS', 'GCP', 'CSPM', 'Hardening']                 },
  'SOC Workflow Automation':   { Icon: ICONS.Bot,         tags: ['SOAR', 'Automation', 'Triage', 'SIEM']            },
  'Phishing Defense Program':  { Icon: ICONS.MailWarning, tags: ['Email Sec', 'Phishing', 'Awareness', 'DMARC']     },
  'Identity Governance Refresh':{ Icon: ICONS.Fingerprint,tags: ['IGA', 'RBAC', 'PAM', 'Governance']               },
  'SIEM Signal Tuning':        { Icon: ICONS.ShieldAlert, tags: ['SIEM', 'Detection', 'Monitoring', 'Analytics']    },
}

const FALLBACK_META = { Icon: ICONS.Shield, tags: ['Security'] }

const fadeUp = { hidden:{opacity:0,y:22}, visible:{opacity:1,y:0} }
const tv = (d=0) => ({ duration:0.5, ease:[0.22,1,0.36,1], delay:d })

export default function ProjectsSection({ projects = [] }) {
  useEffect(() => {
    if (document.getElementById('proj-css')) return
    const s = document.createElement('style')
    s.id = 'proj-css'
    s.textContent = PROJ_CSS
    document.head.appendChild(s)
  }, [])

  const headerRef  = useRef(null)
  const headerView = useInView(headerRef, { once:true, margin:'-60px' })
  const [activeIdx, setActiveIdx] = useState(0)
  const [swapKey, setSwapKey] = useState(0)
  const [displayProjects, setDisplayProjects] = useState(projects)

  /* Rotate the array so the clicked project becomes index 0 (front card),
     then remount CardSwap via key change so it resets its internal order. */
  const swapToFront = (clickedIdx) => {
    if (clickedIdx === 0) return
    const reordered = [
      ...displayProjects.slice(clickedIdx),
      ...displayProjects.slice(0, clickedIdx),
    ]
    setDisplayProjects(reordered)
    setActiveIdx(0)
    setSwapKey(k => k + 1)
  }

  /* Keep displayProjects in sync if the parent `projects` prop changes */
  useEffect(() => { setDisplayProjects(projects) }, [projects])

  return (
    <section id="projects" className="proj-section" style={{
      position:'relative', background:'transparent',
      padding:'88px 0 96px', overflow:'hidden',
    }}>
      {/* Top rule */}
      <div style={{
        position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
        width:'min(1120px,92vw)', height:'1px',
        background:`linear-gradient(90deg,transparent,${GOLD_DIM},transparent)`,
        opacity:.35,
      }} />

      <div style={{ width:'min(1120px,92vw)', margin:'0 auto' }}>

        {/* ── Header ── */}
        <motion.div ref={headerRef}
          initial="hidden" animate={headerView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0)}
          style={{ marginBottom:52 }}
        >
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16}}>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
            <span style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.24em',color:GOLD_DIM}}>// 05 — WORK</span>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
          </div>
          <h2 style={{
            fontFamily:SANS, fontWeight:300,
            fontSize:'clamp(1.8rem,3.5vw,2.6rem)',
            color:GOLD, letterSpacing:'0.14em',
            textTransform:'uppercase', margin:0,
          }}>
            Featured Projects
          </h2>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="proj-layout" style={{display:'flex',gap:64,alignItems:'flex-start'}}>

          {/* LEFT — copy panel */}
          <motion.div
            initial="hidden" animate={headerView ? 'visible' : 'hidden'}
            variants={fadeUp} transition={tv(0.1)}
            className="proj-left"
            style={{flex:'0 0 340px',minWidth:0}}
          >
            <p style={{
              fontFamily:SANS, fontWeight:400,
              fontSize:'clamp(1rem,1.15vw,1.1rem)',
              color:'rgba(245,245,245,0.7)',
              lineHeight:1.74, letterSpacing:'0.03em',
              margin:'0 0 28px',
            }}>
              A selection of security engineering engagements tackling real-world
              challenges across identity, cloud, and SOC operations.
            </p>

            {/* What you'll find */}
            <div style={{
              border:'1px solid rgba(201,168,76,0.18)',
              background:'rgba(10,10,10,0.55)',
              backdropFilter:'blur(10px)',
              padding:'18px 20px', marginBottom:28,
              position:'relative',
            }}>
              {/* Corner accents */}
              <div style={{position:'absolute',top:-1,left:-1,width:10,height:10,borderTop:`1px solid ${GOLD_BRIGHT}`,borderLeft:`1px solid ${GOLD_BRIGHT}`}} />
              <div style={{position:'absolute',bottom:-1,right:-1,width:10,height:10,borderBottom:`1px solid ${GOLD_BRIGHT}`,borderRight:`1px solid ${GOLD_BRIGHT}`}} />

              <div style={{fontFamily:MONO,fontSize:'9px',letterSpacing:'0.2em',color:GOLD_DIM,marginBottom:16}}>
                // WHAT YOU'LL FIND
              </div>

              <ul style={{margin:0,padding:0,listStyle:'none',display:'grid',gap:10}}>
                {displayProjects.map((p, i) => (
                  <li
                    key={p.name}
                    className={`proj-list-item${activeIdx === i ? ' active' : ''}`}
                    onClick={() => swapToFront(i)}
                    style={{
                      display:'flex', alignItems:'center', gap:10,
                      fontFamily:SANS, fontSize:'1rem',
                      color: activeIdx === i ? GOLD_BRIGHT : 'rgba(185,185,185,0.72)',
                      letterSpacing:'0.04em',
                      paddingLeft: activeIdx === i ? 6 : 0,
                      cursor: i === 0 ? 'default' : 'pointer',
                      userSelect:'none',
                    }}
                  >
                    <span style={{
                      width:5, height:5, flexShrink:0,
                      border:`1px solid ${activeIdx === i ? GOLD_BRIGHT : GOLD_DIM}`,
                      transform:'rotate(45deg)',
                      transition:'border-color 220ms',
                    }} />
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <a href="#footer" style={{
              display:'inline-flex', alignItems:'center', gap:9,
              fontFamily:MONO, fontSize:'10px', letterSpacing:'0.16em',
              color:GOLD, textDecoration:'none',
              padding:'11px 24px',
              border:`1px solid rgba(201,168,76,0.42)`,
              transition:'background 280ms, color 280ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.background=GOLD; e.currentTarget.style.color='#080808' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=GOLD }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 4 10 9 10-9"/>
              </svg>
              DISCUSS A PROJECT
            </a>
          </motion.div>

          {/* MOBILE — project card grid (hidden on desktop via CSS) */}
          <div className="proj-mobile-grid" style={{
            display:'none',
            gridTemplateColumns:'repeat(2,minmax(0,1fr))',
            gap:14, width:'100%',
          }}>
            {displayProjects.map((project, idx) => {
              const { Icon, tags } = PROJECT_META[project.name] ?? FALLBACK_META
              return (
                <motion.div
                  key={project.name}
                  initial="hidden" animate={headerView ? 'visible' : 'hidden'}
                  variants={fadeUp} transition={tv(0.1 + idx * 0.06)}
                  style={{
                    position:'relative',
                    border:'1px solid rgba(201,168,76,0.18)',
                    background:'rgba(10,10,10,0.7)',
                    backdropFilter:'blur(10px)',
                    overflow:'hidden',
                  }}
                >
                  {/* Corner accents */}
                  <div style={{position:'absolute',top:-1,left:-1,width:9,height:9,borderTop:`1px solid ${GOLD_BRIGHT}`,borderLeft:`1px solid ${GOLD_BRIGHT}`,zIndex:2}} />
                  <div style={{position:'absolute',bottom:-1,right:-1,width:9,height:9,borderBottom:`1px solid ${GOLD_BRIGHT}`,borderRight:`1px solid ${GOLD_BRIGHT}`,zIndex:2}} />

                  {/* Icon area */}
                  <div style={{
                    height:90, display:'flex', alignItems:'center', justifyContent:'center',
                    borderBottom:'1px solid rgba(201,168,76,0.1)',
                    background:'rgba(201,168,76,0.02)', position:'relative',
                  }}>
                    <div className="proj-card-grid-bg" />
                    <div style={{
                      width:50, height:50,
                      border:`1px solid rgba(201,168,76,0.3)`,
                      display:'flex', alignItems:'center', justifyContent:'center', zIndex:1,
                    }}>
                      <div style={{width:32,height:32,color:GOLD}}><Icon /></div>
                    </div>
                    <div style={{
                      position:'absolute', top:8, right:10,
                      fontFamily:MONO, fontSize:'8px', letterSpacing:'0.12em', color:GOLD_DIM,
                    }}>
                      {String(idx+1).padStart(2,'0')}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{padding:'14px 14px 16px'}}>
                    <h3 style={{
                      fontFamily:SANS, fontWeight:600, fontSize:'0.95rem',
                      color:GOLD, margin:'0 0 8px', letterSpacing:'0.04em', lineHeight:1.25,
                    }}>{project.name}</h3>
                    <p style={{
                      fontFamily:SANS, fontWeight:400, fontSize:'0.82rem',
                      color:'rgba(185,185,185,0.68)', margin:'0 0 12px', lineHeight:1.58,
                    }}>{project.summary}</p>
                    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                      {tags.slice(0,3).map(tag => (
                        <span key={tag} className="proj-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* RIGHT — CardSwap stage */}
          <motion.div
            initial="hidden" animate={headerView ? 'visible' : 'hidden'}
            variants={fadeUp} transition={tv(0.18)}
            className="proj-stage"
            style={{
              flex:1, position:'relative',
              minWidth:560, height:420,
              marginTop:'6rem',
              left:'-40px',
              /* Move cards a bit to the left */
            }}
          >
            <CardSwap
              key={swapKey}
              width={560}
              height={360}
              cardDistance={66}
              verticalDistance={76}
              delay={5000}
              pauseOnHover
              swapOnClick
              onCardClick={(i) => setActiveIdx(i)}
            >
              {displayProjects.map((project, idx) => {
                const { Icon, tags } = PROJECT_META[project.name] ?? FALLBACK_META
                return (
                  <Card key={project.name} className="project-swap-card">

                    {/* Visual area */}
                    <div style={{
                      height:130, display:'flex',
                      alignItems:'center', justifyContent:'center',
                      borderBottom:'1px solid rgba(201,168,76,0.12)',
                      background:'rgba(201,168,76,0.025)',
                      position:'relative',
                    }}>
                      <div className="proj-card-grid-bg" />

                      {/* Icon frame */}
                      <div style={{
                        width:70, height:70,
                        border:`1px solid rgba(201,168,76,0.35)`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        position:'relative', zIndex:1,
                      }}>
                        <div style={{width:48,height:48,color:GOLD}}>
                          <Icon />
                        </div>
                      </div>

                      {/* Index */}
                      <div style={{
                        position:'absolute', top:10, right:14,
                        fontFamily:MONO, fontSize:'9px',
                        letterSpacing:'0.14em', color:GOLD_DIM,
                      }}>
                        {String(idx+1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}
                      </div>
                    </div>

                    {/* Card content */}
                    <div className="project-card-content">
                      <h3 className="project-card-title">{project.name}</h3>
                      <p className="project-card-summary">{project.summary}</p>
                      <div className="project-card-tags">
                        {tags.map(tag => (
                          <span key={tag} className="proj-tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="project-card-footer-line" />
                    <div className="project-card-footer">
                      <span className="project-card-footer-icon" aria-label="GitHub">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V25"/>
                        </svg>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{marginLeft:4}}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </span>
                      <span className="project-card-footer-status">Coming soon!</span>
                    </div>
                  </Card>
                )
              })}
            </CardSwap>
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