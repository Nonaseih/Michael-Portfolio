/**
 * @description      : ServicesSection — redesigned with Roadmap inlined
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

/* ── Injected CSS ── */
const SVC_CSS = `
  .rmap-row {
    display: flex; align-items: stretch;
    width: 100%; max-width: 900px;
    min-height: 150px; position: relative;
    margin: 0 auto;
  }
  .rmap-card-col {
    width: calc(50% - 32px);
    display: flex; align-items: center;
    padding: 10px 0;
  }
  .rmap-card-col.left  { justify-content: flex-end; }
  .rmap-card-col.right { justify-content: flex-start; }
  .rmap-spine-col {
    width: 64px; display: flex;
    flex-direction: column; align-items: center;
    position: relative; flex-shrink: 0;
  }

  /* Vertical spine segment */
  .rmap-v-line {
    flex: 1; width: 1px;
    background: repeating-linear-gradient(
      180deg,
      rgba(201,168,76,0.4) 0px,
      rgba(201,168,76,0.4) 4px,
      transparent 4px,
      transparent 9px
    );
  }

  /* Spine node */
  .rmap-node {
    width: 10px; height: 10px;
    border: 1.5px solid rgba(201,168,76,0.65);
    background: rgba(6,6,4,0.95);
    transform: rotate(45deg);
    flex-shrink: 0; z-index: 2;
    transition: background 240ms, border-color 240ms, box-shadow 240ms;
    cursor: default;
  }
  .rmap-node:hover,
  .rmap-node.active {
    background: rgba(201,168,76,0.18);
    border-color: ${GOLD_BRIGHT};
    box-shadow: 0 0 8px rgba(201,168,76,0.45);
  }

  /* Horizontal dashed connector */
  .rmap-h-line {
    position: absolute; top: 50%;
    transform: translateY(-50%);
    height: 1px; width: 64px;
    background: repeating-linear-gradient(
      90deg,
      rgba(201,168,76,0.45) 0px,
      rgba(201,168,76,0.45) 4px,
      transparent 4px,
      transparent 9px
    );
  }
  .rmap-h-line.from-left  { right: 0; }
  .rmap-h-line.from-right { left: 0; }

  /* Card */
  .rmap-card {
    position: relative;
    background: rgba(10,10,8,0.72);
    border: 1px solid rgba(201,168,76,0.16);
    padding: 22px 24px 18px;
    width: 100%; max-width: 370px;
    transition: border-color 240ms ease, background 240ms ease, transform 240ms ease;
    overflow: hidden; cursor: default;
  }
  .rmap-card::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 55%);
    opacity: 0; transition: opacity 300ms ease; pointer-events: none;
  }
  .rmap-card::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${GOLD_DIM}, transparent);
    transform: scaleX(0); transform-origin: center;
    transition: transform 360ms cubic-bezier(.4,0,.2,1);
  }
  .rmap-card:hover,
  .rmap-card.active {
    border-color: rgba(201,168,76,0.42);
    background: rgba(14,14,10,0.85);
    transform: translateY(-3px);
  }
  .rmap-card:hover::before,
  .rmap-card.active::before { opacity: 1; }
  .rmap-card:hover::after,
  .rmap-card.active::after  { transform: scaleX(1); }

  /* Corner accents */
  .rmap-card .rc-tl { position:absolute;top:-1px;left:-1px;width:10px;height:10px;border-top:1px solid ${GOLD_BRIGHT};border-left:1px solid ${GOLD_BRIGHT};transition:width .3s,height .3s;pointer-events:none; }
  .rmap-card .rc-br { position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-bottom:1px solid ${GOLD_BRIGHT};border-right:1px solid ${GOLD_BRIGHT};transition:width .3s,height .3s;pointer-events:none; }
  .rmap-card:hover .rc-tl, .rmap-card:hover .rc-br { width: 17px; height: 17px; }

  /* Deliverable rows */
  .rmap-deliverable {
    display: flex; align-items: center; gap: 8px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; letter-spacing: 0.1em;
    color: rgba(201,168,76,0.5);
    padding: 4px 0;
    border-bottom: 1px solid rgba(201,168,76,0.07);
    transition: color 200ms;
  }
  .rmap-card:hover .rmap-deliverable { color: rgba(201,168,76,0.72); }
  .rmap-deliverable:last-child { border-bottom: none; }

  /* Tags */
  .rmap-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px; letter-spacing: 0.12em;
    color: rgba(201,168,76,0.5);
    border: 1px solid rgba(201,168,76,0.18);
    padding: 2px 8px;
    transition: color 200ms, border-color 200ms;
  }
  .rmap-card:hover .rmap-tag {
    color: rgba(201,168,76,0.8);
    border-color: rgba(201,168,76,0.38);
  }

  /* Mobile layout */
  .rmap-mobile { display: none; }

  @media (max-width: 680px) {
    .svc-section  { padding: 44px 0 56px !important; }
    .rmap-desktop { display: none !important; }
    .rmap-mobile  { display: block !important; }
  }
  @media (max-width: 860px) and (min-width: 681px) {
    .svc-section { padding: 60px 0 72px !important; }
    .rmap-card   { padding: 18px 18px 14px !important; }
  }
`

/* ── Service data ── */
const SERVICES = [
  {
    id:1, step:'01', side:'left',
    title: 'Offensive Security Testing',
    description: 'Simulate real attacker behavior with structured recon, exploit validation, and clear remediation paths prioritized by risk and impact.',
    tags: ['Red Team', 'Recon'],
    deliverables: ['Attack simulation', 'Exploit validation', 'Risk-ranked remediation'],
  },
  {
    id:2, step:'02', side:'right',
    title: 'Cloud & Infrastructure Hardening',
    description: 'Design secure cloud foundations, least-privilege IAM controls, segmented networks, and hardened baselines for resilient production systems.',
    tags: ['IAM', 'Network'],
    deliverables: ['Reference architecture', 'Identity hardening', 'Guardrail policies'],
  },
  {
    id:3, step:'03', side:'left',
    title: 'Secure CI/CD Delivery',
    description: 'Embed security gates in pipelines with dependency checks, secrets scanning, policy enforcement, and release controls that keep velocity high.',
    tags: ['DevSecOps', 'Pipeline'],
    deliverables: ['Pipeline controls', 'Policy-as-code', 'Continuous compliance'],
  },
  {
    id:4, step:'04', side:'right',
    title: 'Detection & Incident Readiness',
    description: 'Strengthen detection logic, telemetry quality, and response playbooks so teams can identify, contain, and recover from threats faster.',
    tags: ['SIEM', 'Response'],
    deliverables: ['Detection rules', 'Alert tuning', 'IR playbooks'],
  },
  {
    id:5, step:'05', side:'left',
    title: 'Threat-Led Risk Prioritization',
    description: 'Translate technical findings into business risk language that supports better security decisions, roadmap focus, and stakeholder alignment.',
    tags: ['Risk', 'Strategy'],
    deliverables: ['Risk scoring', 'Gap analysis', 'Executive roadmap'],
  },
  {
    id:6, step:'06', side:'right',
    title: 'Automation for Security Ops',
    description: 'Reduce repetitive manual effort with scripted checks, workflow orchestration, and evidence collection that improves consistency at scale.',
    tags: ['Scripting', 'Ops'],
    deliverables: ['Workflow automation', 'Evidence collection', 'Ops consistency'],
  },
]

/* ── Roadmap component (inlined) ── */
function Roadmap() {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center' }}>
      {SERVICES.map((item, i) => {
        const isLeft = item.side === 'left'
        const isLast = i === SERVICES.length - 1
        const isActive = hovered === i

        return (
          <motion.div
            key={item.id}
            className="rmap-row"
            initial={{ opacity:0, y:18 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, amount:0.25 }}
            transition={{ duration:0.48, ease:[0.22,1,0.36,1], delay: i * 0.07 }}
          >
            {/* LEFT column */}
            <div className="rmap-card-col left">
              {isLeft && (
                <div style={{ position:'relative', width:'100%', display:'flex', justifyContent:'flex-end' }}>
                  <div className={`rmap-card${isActive?' active':''}`}
                    style={{ marginRight:64 }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span className="rc-tl" /><span className="rc-br" />
                    <CardContent item={item} />
                  </div>
                  <div className="rmap-h-line from-left" />
                </div>
              )}
            </div>

            {/* SPINE */}
            <div className="rmap-spine-col">
              {i > 0 ? <div className="rmap-v-line" /> : <div style={{flex:1}} />}
              <div
                className={`rmap-node${isActive?' active':''}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
              {!isLast ? <div className="rmap-v-line" /> : <div style={{flex:1}} />}
            </div>

            {/* RIGHT column */}
            <div className="rmap-card-col right">
              {!isLeft && (
                <div style={{ position:'relative', width:'100%', display:'flex', justifyContent:'flex-start' }}>
                  <div className="rmap-h-line from-right" />
                  <div className={`rmap-card${isActive?' active':''}`}
                    style={{ marginLeft:64 }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span className="rc-tl" /><span className="rc-br" />
                    <CardContent item={item} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function CardContent({ item }) {
  return (
    <>
      {/* Step + tags row */}
      <div style={{
        display:'flex', alignItems:'center',
        justifyContent:'space-between', marginBottom:12,
      }}>
        <span style={{
          fontFamily:MONO, fontSize:'10px',
          letterSpacing:'0.2em', color:GOLD_DIM,
        }}>
          {item.step}
        </span>
        <div style={{display:'flex',gap:6}}>
          {item.tags.map(t => (
            <span key={t} className="rmap-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily:SANS, fontWeight:600,
        fontSize:'clamp(1rem,1.3vw,1.15rem)',
        letterSpacing:'0.06em', color:GOLD,
        margin:'0 0 10px', lineHeight:1.25,
        textTransform:'uppercase',
      }}>
        {item.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily:SANS, fontWeight:400,
        fontSize:'0.95rem', lineHeight:1.65,
        color:'rgba(185,185,185,0.72)',
        margin:'0 0 14px',
      }}>
        {item.description}
      </p>

      {/* Deliverables */}
      <div style={{borderTop:'1px solid rgba(201,168,76,0.1)',paddingTop:10}}>
        {item.deliverables.map(d => (
          <div key={d} className="rmap-deliverable">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {d}
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Variants ── */
const fadeUp = { hidden:{opacity:0,y:22}, visible:{opacity:1,y:0} }
const tv = (d=0) => ({ duration:0.5, ease:[0.22,1,0.36,1], delay:d })

export default function ServicesSection({ services: externalServices }) {
  useEffect(() => {
    if (document.getElementById('svc-css')) return
    const s = document.createElement('style')
    s.id = 'svc-css'
    s.textContent = SVC_CSS
    document.head.appendChild(s)
  }, [])

  const headerRef  = useRef(null)
  const headerView = useInView(headerRef, { once:true, margin:'-60px' })

  return (
    <section id="services" className="svc-section" style={{
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
          style={{ textAlign:'center', marginBottom:56 }}
        >
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:14,marginBottom:16}}>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
            <span style={{fontFamily:MONO,fontSize:10,letterSpacing:'0.24em',color:GOLD_DIM}}>// 07 — OFFERINGS</span>
            <span style={{width:40,height:1,background:GOLD,opacity:.4,display:'block'}} />
          </div>

          <h2 style={{
            fontFamily:SANS, fontWeight:300,
            fontSize:'clamp(1.8rem,3.5vw,2.6rem)',
            color:GOLD, letterSpacing:'0.14em',
            textTransform:'uppercase', margin:'0 0 20px',
          }}>
            Services
          </h2>

          <p style={{
            fontFamily:SANS, fontWeight:400,
            fontSize:'clamp(1rem,1.2vw,1.1rem)',
            color:'rgba(245,245,245,0.68)',
            maxWidth:540, margin:'0 auto',
            lineHeight:1.74, letterSpacing:'0.03em',
          }}>
            Working at the intersection of cybersecurity and delivery engineering —
            helping teams build secure systems without slowing product momentum.
          </p>
        </motion.div>

        {/* ── Desktop Roadmap ── */}
        <div className="rmap-desktop"><Roadmap /></div>

        {/* ── Mobile card stack ── */}
        <div className="rmap-mobile" style={{ borderLeft:'1px solid rgba(201,168,76,0.18)', paddingLeft:0 }}>
          {SERVICES.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity:0, y:18 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.2 }}
              transition={{ duration:0.45, ease:[0.22,1,0.36,1], delay: i * 0.06 }}
              style={{
                position:'relative',
                paddingLeft:24, paddingBottom: i < SERVICES.length-1 ? 28 : 0,
                borderBottom: i < SERVICES.length-1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
                paddingTop: i === 0 ? 0 : 28,
              }}
            >
              {/* Timeline dot */}
              <div style={{
                position:'absolute', left:-5, top: i === 0 ? 4 : 32,
                width:9, height:9,
                border:'1.5px solid rgba(201,168,76,0.55)',
                background:'#000', transform:'rotate(45deg)',
              }} />

              {/* Step + tags */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontFamily:MONO, fontSize:'9px', letterSpacing:'0.2em', color:GOLD_DIM }}>{item.step}</span>
                <div style={{ display:'flex', gap:5 }}>
                  {item.tags.map(t => (
                    <span key={t} className="rmap-tag">{t}</span>
                  ))}
                </div>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily:SANS, fontWeight:600, fontSize:'1.05rem',
                letterSpacing:'0.05em', color:GOLD,
                margin:'0 0 8px', lineHeight:1.25, textTransform:'uppercase',
              }}>{item.title}</h3>

              {/* Description */}
              <p style={{
                fontFamily:SANS, fontWeight:400, fontSize:'0.88rem',
                lineHeight:1.62, color:'rgba(185,185,185,0.7)', margin:'0 0 12px',
              }}>{item.description}</p>

              {/* Deliverables */}
              <div>
                {item.deliverables.map(d => (
                  <div key={d} className="rmap-deliverable">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {d}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
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