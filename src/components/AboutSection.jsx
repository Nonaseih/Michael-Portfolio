/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 03/03/2026 - 22:15:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 03/03/2026
    * - Author          : fortu
    * - Modification    : 
**/
const aboutCards = [
  {
    title: 'Offensive Security Testing',
    description:
      'Simulate real attacker behavior with structured recon, exploit validation, and clear remediation paths prioritized by risk and impact.',
  },
  {
    title: 'Cloud & Infrastructure Hardening',
    description:
      'Design secure cloud foundations, least-privilege IAM controls, segmented networks, and hardened baselines for resilient production systems.',
  },
  {
    title: 'Secure CI/CD Delivery',
    description:
      'Embed security gates in pipelines with dependency checks, secrets scanning, policy enforcement, and release controls that keep velocity high.',
  },
  {
    title: 'Detection & Incident Readiness',
    description:
      'Strengthen detection logic, telemetry quality, and response playbooks so teams can identify, contain, and recover from threats faster.',
  },
  {
    title: 'Threat-Led Risk Prioritization',
    description:
      'Translate technical findings into business risk language that supports better security decisions, roadmap focus, and stakeholder alignment.',
  },
  {
    title: 'Automation for Security Ops',
    description:
      'Reduce repetitive manual effort with scripted checks, workflow orchestration, and evidence collection that improves consistency at scale.',
  },
]

function AboutSection() {
  return (
    <section id="about" className="section about">
      <div className="about-content">
        <h2>About</h2>
        <p>
          I work at the intersection of cybersecurity and delivery engineering, helping teams build
          secure systems without slowing down product momentum. My focus is practical: identify real
          attack paths, close exploitable gaps, and turn security into an everyday engineering habit
          through architecture, automation, and measurable controls.
        </p>

        <div className="about-cards" aria-label="About Cards">
          {aboutCards.map((card) => (
            <article key={card.title} className="about-card glass-card">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
