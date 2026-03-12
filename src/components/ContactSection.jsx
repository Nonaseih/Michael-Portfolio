function ContactSection() {
  return (
    <section id="contact" className="section contact">
      <h2>Contact</h2>
      <p>Ready to improve your security posture? Let&apos;s start with a focused assessment.</p>
      <form className="contact-form">
        <input type="text" placeholder="Your Name" aria-label="Your Name" />
        <input type="email" placeholder="Email Address" aria-label="Email Address" />
        <textarea rows="5" placeholder="Project details" aria-label="Project details" />
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </section>
  )
}

export default ContactSection
