import CardSwap, { Card } from './CardSwap'
import {
  Bot,
  Cloud,
  Fingerprint,
  MailWarning,
  Shield,
  ShieldAlert,
} from 'lucide-react'

const projectIconByName = {
  'Zero Trust Rollout': Shield,
  'Cloud Threat Hardening': Cloud,
  'SOC Workflow Automation': Bot,
  'Phishing Defense Program': MailWarning,
  'Identity Governance Refresh': Fingerprint,
  'SIEM Signal Tuning': ShieldAlert,
}

function ProjectsSection({ projects }) {
  return (
    <section id="projects" className="section projects-section">
      <div className="projects-layout">
        <div className="projects-copy">
          <h2>Featured Projects</h2>
          <p>
            A quick look at security programs and engineering initiatives delivered across identity,
            cloud, and SOC operations.
          </p>
        </div>

        <div className="projects-swap-stage" role="region" aria-label="Project cards">
          <CardSwap
            width={560}
            height={360}
            cardDistance={66}
            verticalDistance={76}
            delay={5000}
            pauseOnHover
            swapOnClick
          >
            {projects.map((project) => {
              const Icon = projectIconByName[project.name] ?? Shield

              return (
                <Card key={project.name} className="project-swap-card">
                  <div className="project-card-header">
                    <div className="project-icon-box" aria-hidden="true">
                      <Icon />
                    </div>
                    <h3>{project.name}</h3>
                  </div>
                  <p>{project.summary}</p>
                </Card>
              )
            })}
          </CardSwap>
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
