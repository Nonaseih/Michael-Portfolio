/**
 * @description      : SkillsSection — redesigned, inline styles, cyber-gold aesthetic
 * @author           : fortu
 * @version          : 2.0.0
 * @date             : 2026
 **/
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { skillDetails } from '../data/skillDetails'

/* ── Tokens ── */
const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_BRIGHT = '#e8c96a'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

/* ── Injected CSS ── */
const SKILLS_CSS = `
  @keyframes skBarGrow {
    from { transform: scaleX(0); transform-origin: left; }
    to   { transform: scaleX(1); transform-origin: left; }
  }
  @keyframes skPulse {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1; }
  }

  .sk-card {
    position: relative;
    background: rgba(10,10,8,0.7);
    border: 1px solid rgba(201,168,76,0.16);
    padding: 18px 20px 16px;
    cursor: default;
    overflow: hidden;
    transition: border-color 240ms ease, background 240ms ease, transform 240ms ease;
  }
  .sk-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 2px; height: 0;
    background: linear-gradient(180deg, ${GOLD_BRIGHT}, ${GOLD_DIM});
    transition: height 320ms ease;
  }
  .sk-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 300ms ease;
    pointer-events: none;
  }
  .sk-card:hover {
    border-color: rgba(201,168,76,0.45);
    background: rgba(14,14,10,0.85);
    transform: translateY(-3px);
  }
  .sk-card:hover::before { height: 100%; }
  .sk-card:hover::after  { opacity: 1; }

  /* Corner accents */
  .sk-card .sk-tl { position:absolute;top:-1px;right:-1px;width:8px;height:8px;border-top:1px solid ${GOLD_BRIGHT};border-right:1px solid ${GOLD_BRIGHT};transition:width .3s,height .3s;pointer-events:none; }
  .sk-card:hover .sk-tl { width: 14px; height: 14px; }

  /* Category tab active state */
  .sk-tab { transition: color 200ms, border-color 200ms, background 200ms; }
  .sk-tab:hover { color: ${GOLD_BRIGHT} !important; border-color: rgba(201,168,76,0.45) !important; }
  .sk-tab.active {
    color: #080808 !important;
    background: ${GOLD} !important;
    border-color: ${GOLD} !important;
  }

  /* Bar fill animation — triggered by class */
  .sk-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${GOLD_DIM}, ${GOLD});
    position: absolute; top: 0; left: 0;
    animation: skBarGrow 1.1s cubic-bezier(0.4,0,0.2,1) forwards;
    transform-origin: left;
  }

  @media (max-width: 700px) {
    .sk-tabs { flex-wrap: wrap !important; }
    .sk-grid  { grid-template-columns: 1fr !important; }
  }
`

/* ── Category groupings ── */
const CATEGORIES = [
  { label: 'All',         key: 'all' },
  { label: 'Offensive',   key: 'offensive' },
  { label: 'Cloud',       key: 'cloud' },
  { label: 'DevSecOps',   key: 'devsecops' },
  { label: 'Detection',   key: 'detection' },
]

/* Category assignment — falls back to showing everything under 'all' */
const SKILL_CATEGORIES = {
  'Penetration Testing':     'offensive',
  'Exploit Development':     'offensive',
  'Red Team Operations':     'offensive',
  'Web App Security':        'offensive',
  'Social Engineering':      'offensive',
  'Cloud Security':          'cloud',
  'AWS / GCP / Azure':       'cloud',
  'IAM & Access Control':    'cloud',
  'CSPM':                    'cloud',
  'Infrastructure Hardening':'cloud',
  'CI/CD Security':          'devsecops',
  'DevSecOps':               'devsecops',
  'Secrets Management':      'devsecops',
  'Policy as Code':          'devsecops',
  'Container Security':      'devsecops',
  'SIEM Engineering':        'detection',
  'Detection Engineering':   'detection',
  'Incident Response':       'detection',
  'Threat Intelligence':     'detection',
  'SOAR / Automation':       'detection',
}

/* ── Animated skill bar (GSAP-free, CSS-only) ── */
function SkillCard({ skill, inView }) {
  return (
    <div className="sk-card">
      <span className="sk-tl" />

      {/* Header row */}
      <div style={{
        display:'flex', alignItems:'baseline',
        justifyContent:'space-between', marginBottom:12,
      }}>
        <span style={{
          fontFamily:SANS, fontWeight:600,
          fontSize:'1.02rem', letterSpacing:'0.1em',
          color:GOLD, textTransform:'uppercase',
        }}>
          {skill.name}
        </span>
        <span style={{
          fontFamily:MONO, fontSize:'10px',
          letterSpacing:'0.1em', color:GOLD_DIM,
        }}>
          {skill.percent}%
        </span>
      </div>

      {/* Bar track */}
      <div style={{
        width:'100%', height:2,
        background:'rgba(201,168,76,0.1)',
        position:'relative', overflow:'hidden',
      }}>
        {inView && (
          <div
            className="sk-bar-fill"
            style={{ width:`${skill.percent}%` }}
          />
        )}
      </div>

      {/* Optional tags row */}
      {skill.tags?.length > 0 && (
        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginTop:10}}>
          {skill.tags.map(t => (
            <span key={t} style={{
              fontFamily:MONO, fontSize:'8px',
              letterSpacing:'0.1em',
              color:'rgba(201,168,76,0.45)',
              border:'1px solid rgba(201,168,76,0.14)',
              padding:'2px 7px',
            }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

const fadeUp = { hidden:{opacity:0,y:22}, visible:{opacity:1,y:0} }
const tv = (d=0) => ({ duration:0.5, ease:[0.22,1,0.36,1], delay:d })

export default function SkillsSection() {
  useEffect(() => {
    if (document.getElementById('skills-css')) return
    const s = document.createElement('style')
    s.id = 'skills-css'
    s.textContent = SKILLS_CSS
    document.head.appendChild(s)
  }, [])

  const [activeTab, setActiveTab] = useState('all')
  const headerRef  = useRef(null)
  const gridRef    = useRef(null)
  const headerView = useInView(headerRef, { once:true, margin:'-60px' })
  const gridView   = useInView(gridRef,   { once:true, margin:'-80px' })

  const filtered = activeTab === 'all'
    ? skillDetails
    : skillDetails.filter(s => SKILL_CATEGORIES[s.name] === activeTab)

  return (
    <section id="core-skills" style={{
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
          style={{ textAlign:'center', marginBottom:48 }}
        >
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:16}}>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
            <span style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.24em',color:GOLD_DIM}}>// 06 — CAPABILITIES</span>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
          </div>

          <h2 style={{
            fontFamily:SANS, fontWeight:300,
            fontSize:'clamp(1.8rem,3.5vw,2.6rem)',
            color:GOLD, letterSpacing:'0.14em',
            textTransform:'uppercase', margin:'0 0 18px',
          }}>
            Core Skills
          </h2>

          <p style={{
            fontFamily:SANS, fontWeight:400,
            fontSize:'clamp(1rem,1.2vw,1.1rem)',
            color:'rgba(245,245,245,0.68)',
            maxWidth:520, margin:'0 auto',
            lineHeight:1.74, letterSpacing:'0.03em',
          }}>
            A curated set of technical capabilities driving impactful results
            across security engineering, cloud, and automation.
          </p>
        </motion.div>

        {/* ── Category tabs ── */}
        <motion.div
          initial="hidden" animate={headerView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0.1)}
          className="sk-tabs"
          style={{
            display:'flex', justifyContent:'center',
            gap:8, marginBottom:40, flexWrap:'wrap',
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`sk-tab${activeTab === cat.key ? ' active' : ''}`}
              onClick={() => setActiveTab(cat.key)}
              style={{
                fontFamily:MONO, fontSize:'9px',
                letterSpacing:'0.18em',
                color: activeTab === cat.key ? '#080808' : GOLD_DIM,
                background: activeTab === cat.key ? GOLD : 'transparent',
                border:`1px solid ${activeTab === cat.key ? GOLD : 'rgba(201,168,76,0.22)'}`,
                padding:'7px 18px',
                cursor:'pointer', outline:'none',
              }}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* ── Skills grid ── */}
        <div ref={gridRef}>
          <div
            className="sk-grid"
            style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',
              gap:14,
            }}
          >
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial="hidden"
                animate={headerView ? 'visible' : 'hidden'}
                variants={fadeUp}
                transition={tv(i * 0.045)}
              >
                <SkillCard skill={skill} inView={gridView} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Summary stat bar ── */}
        <motion.div
          initial="hidden" animate={headerView ? 'visible' : 'hidden'}
          variants={fadeUp} transition={tv(0.3)}
          style={{
            display:'flex', justifyContent:'center',
            gap:0, marginTop:52,
            border:'1px solid rgba(201,168,76,0.16)',
            background:'rgba(10,10,8,0.55)',
            backdropFilter:'blur(10px)',
            overflow:'hidden',
          }}
        >
          {[
            { val:`${skillDetails.length}+`, label:'Skills Tracked' },
            { val:'5+',                      label:'Years Active'   },
            { val:'40+',                     label:'Engagements'    },
            { val:'0',                       label:'Breaches'       },
          ].map(({ val, label }, i, arr) => (
            <div key={label} style={{
              flex:1, textAlign:'center',
              padding:'20px 0',
              borderRight: i < arr.length-1 ? '1px solid rgba(201,168,76,0.12)' : 'none',
            }}>
              <div style={{
                fontFamily:MONO, fontSize:'clamp(1.1rem,2vw,1.5rem)',
                color:GOLD, letterSpacing:'0.1em', marginBottom:4,
              }}>
                {val}
              </div>
              <div style={{
                fontFamily:MONO, fontSize:'8px',
                letterSpacing:'0.18em', color:GOLD_DIM,
              }}>
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </motion.div>
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