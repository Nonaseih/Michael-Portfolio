import './App.css'
import AboutSection from './components/AboutSection'
import Aurora from './components/Aurora'
import ContactSection from './components/ContactSection'
import ExperienceSection from './components/ExperienceSection'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import Navbar from './components/Navbar'
import ProcessSection from './components/ProcessSection'
import ProjectsSection from './components/ProjectsSection'
import ServicesSection from './components/ServicesSection'
import SkillsSection from './components/SkillsSection'
import { projects, services, skills } from './data/portfolioData'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />

        <div className="site-shell">
          <div className="sections-fx-wrap">
            <div className="sections-fx-bg sections-gradient-bg" aria-hidden="true" />
            <div className="sections-fx-aurora" aria-hidden="true">
              <Aurora
                colorStops={['#f0c75e', '#8d783f', '#1a1200']}
                amplitude={0.72}
                blend={0.34}
                speed={0.75}
              />
            </div>

            <div className="sections-fx-content">
              <AboutSection />
              <ExperienceSection />
              <ProcessSection />
              <ProjectsSection projects={projects} />
              <ServicesSection services={services} />
              <SkillsSection skills={skills} />
            </div>
          </div>

          <ContactSection />
          <Footer />
        </div>
      </main>
    </>
  )
}

export default App
