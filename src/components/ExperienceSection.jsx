/**
    * @description      : 
    * @author           : fortu
    * @group            : 
    * @created          : 04/03/2026 - 00:25:14
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 04/03/2026
    * - Author          : fortu
    * - Modification    : 
**/
import ScrollReveal from './ScrollReveal'

const experiences = [
  {
    title: 'Senior Cybersecurity Engineer',
    writeups: [
      'Led offensive assessments and remediation strategy to reduce enterprise risk across cloud and core infrastructure.',
      'Coordinated security decisions with engineering and operations teams to close critical findings with minimal release disruption.',
    ],
  },
  {
    title: 'Ethical Hacker',
    writeups: [
      'Performed authorized penetration tests on apps, APIs, and internal networks with high-confidence exploit validation.',
      'Delivered concise technical reports with practical remediation guidance that teams could implement immediately.',
    ],
  },
  {
    title: 'DevSecOps Consultant',
    writeups: [
      'Integrated security checks into CI/CD and release workflows without slowing delivery velocity.',
      'Improved deployment trust through automated controls, policy checks, and secure-by-default pipeline standards.',
    ],
  },
  {
    title: 'Cloud Security Specialist',
    writeups: [
      'Implemented hardened cloud baselines, IAM guardrails, and segmentation controls for resilient platform operations.',
    ],
  },
  {
    title: 'Incident Readiness Lead',
    writeups: [
      'Improved response readiness with detection tuning, playbook refinement, and post-incident control improvements.',
    ],
  },
  {
    title: 'Security Program Advisor',
    writeups: [
      'Converted technical findings into business-prioritized action plans aligned with uptime, compliance, and product goals.',
    ],
  },
]

function ExperienceSection() {
  return (
    <section id="experience" className="section">
      <h2>Experience</h2>
      <div className="experience-writeups">
        {experiences.map((item) => (
          <article key={item.title} className="experience-writeup">
            <h3>{item.title}</h3>
            <div className="experience-writeup-copy">
              {item.writeups.map((writeup) => (
                <ScrollReveal
                  key={writeup}
                  containerClassName="experience-reveal"
                  textClassName="experience-reveal-text"
                  baseOpacity={0.12}
                  enableBlur
                  baseRotation={2}
                  blurStrength={3}
                  rotationEnd="bottom 90%"
                  wordAnimationEnd="bottom 74%"
                >
                  {writeup}
                </ScrollReveal>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ExperienceSection
