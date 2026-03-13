import { useState } from 'react'
import './App.css'
import AboutSection from './components/AboutSection'
import ExperienceSection from './components/ExperienceSection'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import ProcessSection from './components/ProcessSection'
import ProjectsSection from './components/ProjectsSection'
import ServicesSection from './components/ServicesSection'
import SkillsSection from './components/SkillsSection'
import { projects, services, skills } from './data/portfolioData'

/* Show the loader only on the very first page load in a browser session.
   sessionStorage survives F5 refreshes within the same tab, so refreshing
   the page will skip the loader — exactly like the user requested. */
const SEEN_KEY = 'mcp_session_loaded'
const needsLoader = !sessionStorage.getItem(SEEN_KEY)

function App() {
  /* phase:
     'loading' — loader visible, content NOT rendered (no framer-motion observers)
     'reveal'  — loader gone, ash covering, content NOW rendered behind ash
     'ready'   — ash gone, content fully visible */
  const [phase, setPhase] = useState(needsLoader ? 'loading' : 'ready')

  const handleReveal = () => setPhase('reveal')
  const handleDone   = () => {
    sessionStorage.setItem(SEEN_KEY, '1')
    setPhase('ready')
  }

  return (
    <>
      {/* LoadingScreen stays in tree until ash fully exits */}
      {phase !== 'ready' && (
        <LoadingScreen onReveal={handleReveal} onDone={handleDone} />
      )}

      {/* Content renders during 'reveal' so framer-motion mounts cleanly behind ash */}
      {phase !== 'loading' && (
        <>
      <Navbar />

      <main>
        <HeroSection />

        <div className="site-shell">
          <div className="sections-fx-wrap">
            <div className="sections-fx-bg sections-gradient-bg" aria-hidden="true" />
            {/* Aurora effect removed */}
              <hr className="section-divider" style={{ border: 'none', borderTop: '0.5px solid #444', opacity: 0.12, margin: '48px 0 0 0', width: '100%' }} />

              <hr style={{ border: 'none', borderTop: '0.5px solid #444', opacity: 0.12, margin: '48px 0 0 0', width: '100%' }} />

            <div className="sections-fx-content">
              <AboutSection />
              <ExperienceSection />
              <ProcessSection />
                <ProjectsSection projects={projects} />
                <SkillsSection skills={skills} />
                <hr className="section-divider" style={{ border: 'none', borderTop: '0.5px solid #444', opacity: 0.12, margin: '48px 0 0 0', width: '100%' }} />
                <ServicesSection services={services} />
                <hr style={{ border: 'none', borderTop: '0.5px solid #444', opacity: 0.12, margin: '48px 0 0 0', width: '100%' }} />
            </div>
          </div>

          <Footer />
        </div>
      </main>
        </>
      )}
    </>
  )
}

export default App
