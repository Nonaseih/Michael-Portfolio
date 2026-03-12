/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 02/03/2026 - 23:57:19
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 02/03/2026
    * - Author          : fortu
    * - Modification    : 
**/
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Hyperspeed from './Hyperspeed'
import ShinyText from './ShinyText'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function HeroSection() {
  const hyperspeedOptions = useMemo(
    () => ({
      distortion: 'turbulentDistortion',
      length: 400,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 3,
      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 20,
      lightPairsPerRoadWay: 40,
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,
      lightStickWidth: [0.12, 0.5],
      lightStickHeight: [1.3, 1.7],
      movingAwaySpeed: [60, 80],
      movingCloserSpeed: [-120, -160],
      carLightsLength: [12, 80],
      carLightsRadius: [0.05, 0.14],
      carWidthPercentage: [0.3, 0.5],
      carShiftX: [-0.8, 0.8],
      carFloorSeparation: [0, 5],
      colors: {
        roadColor: 0x000000,
        islandColor: 0x000000,
        background: 0x000000,
        shoulderLines: 0x131318,
        brokenLines: 0x131318,
        leftCars: [0xf0c75e, 0x8d783f, 0xd7b457],
        rightCars: [0xc9a652, 0x8d783f, 0x6b5a31],
        sticks: 0xf0c75e,
      },
    }),
    [],
  )

  return (
    <section id="home" className="hero section">
      <div className="hero-hyperspeed" aria-hidden="true">
        <Hyperspeed effectOptions={hyperspeedOptions} />
      </div>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-layout hero-content">
        <div>
          <motion.p
            className="eyebrow"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            Cybersecurity • Ethical Hacking • DevOps Engineer
          </motion.p>
          <motion.h1
            className="hero-title"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ShinyText
              text="Otenaike Michael Babatunde"
              speed={2}
              delay={0}
              color="#f0c75e"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
          </motion.h1>
          <motion.p
            className="hero-subheader"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            Cybersecurity engineer and DevOps specialist delivering secure, resilient, and high-performance digital platforms through offensive testing, hardening-first architecture, and automation that reduces risk across every release cycle.
          </motion.p>
          <motion.p
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            This portfolio presents practical work across penetration testing, cloud security, CI/CD protection, and production observability, with a focus on translating complex security challenges into measurable outcomes, trusted systems, and maintainable engineering practices for modern teams.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a href="#contact" className="btn btn-primary">
              Let&apos;s Work
            </a>
            <a href="#projects" className="btn btn-ghost">
              View Case Studies
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-image-wrap"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="image-placeholder framed-panel">
            <span className="placeholder-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="m12 3 7 4v5c0 4.2-2.5 7.7-7 9-4.5-1.3-7-4.8-7-9V7l7-4Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m9.5 12 1.8 1.8 3.2-3.6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="placeholder-label">Client Image</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
