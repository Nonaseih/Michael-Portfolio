import { motion } from 'framer-motion'
import { Bug, Shield, Workflow } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const serviceMeta = {
  'Cybersecurity Assessments': {
    icon: Shield,
    label: 'Security Posture',
    deliverables: ['Risk scoring', 'Gap analysis', 'Executive roadmap'],
  },
  'Ethical Hacking': {
    icon: Bug,
    label: 'Offensive Security',
    deliverables: ['Attack simulation', 'Exploit validation', 'Fix verification'],
  },
  'DevSecOps Engineering': {
    icon: Workflow,
    label: 'Secure Delivery',
    deliverables: ['Pipeline controls', 'Policy-as-code', 'Continuous compliance'],
  },
  'Cloud Security Architecture': {
    icon: Shield,
    label: 'Cloud Defense',
    deliverables: ['Reference architecture', 'Identity hardening', 'Guardrail policies'],
  },
  'Threat Detection Engineering': {
    icon: Bug,
    label: 'Detection',
    deliverables: ['Detection rules', 'Alert tuning', 'Coverage mapping'],
  },
  'Incident Readiness & Response': {
    icon: Workflow,
    label: 'Response Ops',
    deliverables: ['IR playbooks', 'Tabletop drills', 'Containment workflows'],
  },
}

function ServicesSection({ services }) {
  return (
    <section id="services" className="section services-section">
      <div className="services-heading">
        <h2>Services</h2>
        <p>
          End-to-end security services engineered for organizations that need measurable progress,
          not generic recommendations. The focus is on hands-on execution, clear deliverables,
          and repeatable operating models that strengthen prevention, detection, and response.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          (() => {
            const meta = serviceMeta[service.title]
            const Icon = meta?.icon ?? Shield

            return (
              <motion.article
                key={service.title}
                className="service-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: index * 0.12 }}
              >
                <div className="service-card-head">
                  <span className="service-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="service-label">{meta?.label ?? 'Service'}</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <ul className="service-deliverables" aria-label={`${service.title} deliverables`}>
                  {(meta?.deliverables ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.article>
            )
          })()
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
