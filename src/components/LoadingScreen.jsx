/**
 * @description : LoadingScreen — cyber-gold themed initial load gate
 *                Shows only once per browser session (not on F5 refresh).
 *                Holds the view until the page is fully loaded + min timer,
 *                then fades out so framer-motion animations play cleanly.
 **/
import { useEffect, useRef, useState } from 'react'

const GOLD        = '#c9a84c'
const GOLD_DIM    = '#7a5f28'
const GOLD_FAINT  = 'rgba(201,168,76,0.15)'
const MONO        = "'Share Tech Mono', monospace"
const SANS        = "'Rajdhani', sans-serif"

const MIN_MS       = 3600   // 3600 + 400ms buffer = ~4s total
const LOAD_EXIT_MS = 480    // loader panel slides up
const ASH_DELAY_MS = 150    // ash starts sliding this many ms after loader (concurrent overlap)
const ASH_EXIT_MS  = 620    // ash panel slides up

const STEPS = [
  'BOOTING SYSTEM...',
  'LOADING SECURITY MODULES...',
  'COMPILING ASSETS...',
  'ESTABLISHING CONNECTION...',
  'SYSTEM READY',
]

/* ─── injected CSS (scoped via ls- prefix) ─── */
const CSS = `
  @keyframes lsBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes lsScan   { 0%{transform:translateX(-100%)} 100%{transform:translateX(100vw)} }
  @keyframes lsBarGlow {
    0%,100% { box-shadow: 0 0 6px rgba(201,168,76,0.3); }
    50%     { box-shadow: 0 0 18px rgba(201,168,76,0.55); }
  }
  @keyframes lsRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes lsFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }

  .ls-cursor {
    display: inline-block; width: 8px; height: 14px;
    background: ${GOLD}; margin-left: 4px; vertical-align: middle;
    animation: lsBlink 1s step-end infinite;
  }
  .ls-scan {
    position: absolute; top: 0; left: 0;
    width: 80px; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.06), transparent);
    animation: lsScan 5s linear infinite;
    pointer-events: none;
  }
  .ls-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, ${GOLD_DIM}, ${GOLD});
    animation: lsBarGlow 1.6s ease-in-out infinite;
    position: relative;
  }
  .ls-bar-fill::after {
    content: '';
    position: absolute; right: 0; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 140%;
    background: #e8c96a;
    box-shadow: 0 0 8px #e8c96a;
  }
  .ls-ring {
    width: 38px; height: 38px;
    border: 1.5px solid rgba(201,168,76,0.12);
    border-top-color: ${GOLD};
    border-radius: 50%;
    animation: lsRotate 1s linear infinite;
  }
  .ls-step {
    animation: lsFadeIn 0.35s ease forwards;
  }
`

export default function LoadingScreen({ onReveal, onDone }) {
  const [progress, setProgress]   = useState(0)
  const [stepIdx, setStepIdx]     = useState(0)
  const [loaderSlide, setLoaderSlide] = useState('0%')
  const [ashSlide, setAshSlide]   = useState('0%')
  const [mounted, setMounted]     = useState(true)
  const barRef  = useRef(null)
  const doneRef = useRef(false)
  const raf     = useRef(null)

  useEffect(() => {
    /* inject styles once */
    if (!document.getElementById('ls-css')) {
      const s = document.createElement('style')
      s.id = 'ls-css'; s.textContent = CSS
      document.head.appendChild(s)
    }

    /* lock scroll */
    document.body.style.overflow = 'hidden'

    /* ── progress animation ── */
    const startTs   = performance.now()

    const tick = (now) => {
      const elapsed = now - startTs
      const raw     = Math.min(elapsed / MIN_MS, 1)
      /* smooth ease: slow start, accelerates mid, eases in at end */
      const eased   = raw < 0.5
        ? 2 * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 2) / 2
      const pct = Math.round(eased * 100)

      /* drive bar directly via DOM — no React batching lag */
      if (barRef.current) barRef.current.style.width = `${pct}%`
      /* only update React state at ~10fps for the number display */
      if (pct % 3 === 0) setProgress(pct)

      /* step through messages */
      const idx = Math.min(
        Math.floor(eased * STEPS.length),
        STEPS.length - 1
      )
      setStepIdx(idx)

      if (raw < 1) {
        raf.current = requestAnimationFrame(tick)
      }
    }
    raf.current = requestAnimationFrame(tick)

    /* ── exit gate: wait for both window load AND min timer ── */
    let winReady = document.readyState === 'complete'
    let minReady = false

    const tryExit = () => {
      if (!winReady || !minReady || doneRef.current) return
      doneRef.current = true
      /* Force progress to 100 */
      setProgress(100)
      setStepIdx(STEPS.length - 1)

      /* 1. brief pause at 100%, then slide loader up */
      setTimeout(() => {
        setLoaderSlide('-100%')           // loader begins sliding
        document.body.style.overflow = ''

        /* 2. render content behind ash slightly after loader starts */
        setTimeout(() => {
          onReveal()                      // content mounts behind ash
          setAshSlide('-100%')            // ash begins sliding (0.1s after loader)
          setTimeout(() => {
            setMounted(false)
            onDone()
          }, ASH_EXIT_MS)
        }, ASH_DELAY_MS)
      }, 300)
    }

    if (!winReady) {
      window.addEventListener('load', () => { winReady = true; tryExit() }, { once: true })
    }

    const minTimer = setTimeout(() => { minReady = true; tryExit() }, MIN_MS + 350)

    return () => {
      cancelAnimationFrame(raf.current)
      clearTimeout(minTimer)
      document.body.style.overflow = ''
    }
  }, [onDone])

  if (!mounted) return null

  return (
    <>
      {/* Ash layer — sits behind loader, holds view during 0.2s freeze */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#0d0d0d',
        transform: `translateY(${ashSlide})`,
        transition: `transform ${ASH_EXIT_MS}ms cubic-bezier(0.76,0,0.24,1)`,
        pointerEvents: 'none',
      }} />

      {/* Loader layer — main black panel with content */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          transform: `translateY(${loaderSlide})`,
          transition: `transform ${LOAD_EXIT_MS}ms cubic-bezier(0.76,0,0.24,1)`,
          overflow: 'hidden',
        }}
      >
      {/* scanline sweep */}
      <div className="ls-scan" />

      {/* corner brackets */}
      {[
        { top:24, left:24,  borderTop:`1px solid ${GOLD_DIM}`, borderLeft:`1px solid ${GOLD_DIM}` },
        { top:24, right:24, borderTop:`1px solid ${GOLD_DIM}`, borderRight:`1px solid ${GOLD_DIM}` },
        { bottom:24, left:24,  borderBottom:`1px solid ${GOLD_DIM}`, borderLeft:`1px solid ${GOLD_DIM}` },
        { bottom:24, right:24, borderBottom:`1px solid ${GOLD_DIM}`, borderRight:`1px solid ${GOLD_DIM}` },
      ].map((s, i) => (
        <div key={i} style={{
          position:'absolute', width:28, height:28, ...s, opacity:.45,
        }} />
      ))}

      {/* center block */}
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center', gap:32,
        width:'min(420px, 88vw)',
      }}>

        {/* spinner + brand */}
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div className="ls-ring" />
          <div>
            <div style={{
              fontFamily:MONO, fontSize:13, letterSpacing:'0.3em',
              color:GOLD, textTransform:'uppercase',
            }}>
              MICHAEL<span style={{color:GOLD_DIM}}> // CYBER</span>
            </div>
            <div style={{
              fontFamily:MONO, fontSize:8, letterSpacing:'0.22em',
              color:'rgba(201,168,76,0.25)', marginTop:4,
            }}>
              PORTFOLIO — {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* divider */}
        <div style={{
          width:'100%', height:1,
          background:'repeating-linear-gradient(90deg,rgba(201,168,76,0.18) 0,rgba(201,168,76,0.18) 4px,transparent 4px,transparent 10px)',
        }} />

        {/* progress bar */}
        <div style={{ width:'100%' }}>
          {/* label row */}
          <div style={{
            display:'flex', justifyContent:'space-between',
            marginBottom:10,
          }}>
            <span style={{
              fontFamily:MONO, fontSize:8, letterSpacing:'0.2em',
              color:'rgba(201,168,76,0.38)',
            }}>
              LOADING
            </span>
            <span style={{
              fontFamily:MONO, fontSize:8, letterSpacing:'0.1em',
              color:GOLD,
            }}>
              {progress}%
            </span>
          </div>

          {/* track */}
          <div style={{
            width:'100%', height:2,
            background:'rgba(201,168,76,0.1)',
            position:'relative', overflow:'hidden',
          }}>
            <div ref={barRef} className="ls-bar-fill" style={{ width:'0%' }} />
          </div>
        </div>

        {/* status line */}
        <div key={stepIdx} className="ls-step" style={{
          fontFamily:MONO, fontSize:9, letterSpacing:'0.18em',
          color:'rgba(201,168,76,0.45)', textTransform:'uppercase',
          minHeight:16, alignSelf:'flex-start',
          display:'flex', alignItems:'center',
        }}>
          &gt;_ {STEPS[stepIdx]}
          <span className="ls-cursor" />
        </div>

        {/* decorative tick marks */}
        <div style={{
          display:'flex', gap:6, alignItems:'center',
        }}>
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} style={{
              width: i % 4 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 10 : 5,
              background: i / 16 < progress / 100
                ? `rgba(201,168,76,${i % 4 === 0 ? 0.7 : 0.35})`
                : 'rgba(201,168,76,0.07)',
              transition:'background 120ms',
            }} />
          ))}
        </div>

      </div>

      </div>{/* end loader layer */}
    </>
  )
}
