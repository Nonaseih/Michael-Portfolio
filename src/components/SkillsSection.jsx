function SkillsSection({ skills }) {
  return (
    <section className="section skills">
      <h2>Core Skills</h2>
      <div className="chip-wrap">
        {skills.map((skill) => (
          <span key={skill} className="chip">
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
