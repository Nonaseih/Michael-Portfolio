import { motion } from 'framer-motion'
import { Radar, SearchCheck, ShieldCheck } from 'lucide-react'

const processSteps = [
  {
    title: 'Discover',
    description:
      'Assess infrastructure, map attack surfaces, and prioritize exposure across application, identity, and cloud layers.',
    outcome: 'Outcome: Clear risk baseline and prioritized roadmap',
    icon: SearchCheck,
  },
  {
    title: 'Defend',
    description:
      'Harden controls, close high-impact gaps, and introduce preventive guardrails in engineering and operations workflows.',
    outcome: 'Outcome: Reduced exploitability and stronger resilience',
    icon: ShieldCheck,
  },
  {
    title: 'Develop',
    description:
      'Embed secure-by-default practices into delivery pipelines with iterative validation, monitoring, and continuous improvement.',
    outcome: 'Outcome: Security scales with every release cycle',
    icon: Radar,
  },
  {
    title: 'Validate',
    description:
      'Execute targeted verification, attack-path checks, and control validation to ensure remediation efforts hold under real pressure.',
    outcome: 'Outcome: Proven controls with reduced regression risk',
    icon: SearchCheck,
  },
  {
    title: 'Automate',
    description:
      'Operationalize repeatable checks, integrate policy enforcement, and embed security signals directly into delivery and runtime workflows.',
    outcome: 'Outcome: Faster teams with consistent protection',
    icon: ShieldCheck,
  },
  {
    title: 'Evolve',
    description:
      'Continuously refine posture with incident learnings, telemetry feedback, and strategic improvements aligned to changing threats.',
    outcome: 'Outcome: Adaptive, long-term cyber resilience',
    icon: Radar,
  },
]

function ProcessSection() {
  return (
    <section id="process" className="section process-section">
      <div className="process-heading">
        <h2>Process</h2>
        <p>
          A six-stage security delivery model designed to build momentum from discovery to
          resilience. Each phase creates practical outcomes your teams can operationalize quickly,
          while strengthening governance, engineering quality, and long-term risk reduction across
          the environment.
        </p>
      </div>

      <div className="process-steps" role="list">
        {processSteps.map((step, index) => {
          const Icon = step.icon

          return (
            <motion.article
              key={step.title}
              className="process-step"
              role="listitem"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
            >
              <div className="process-step-top">
                <span className="process-number">0{index + 1}</span>
                <span className="process-icon" aria-hidden="true">
                  <Icon />
                </span>
              </div>

              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="process-outcome">{step.outcome}</span>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default ProcessSection
