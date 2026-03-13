import { useState } from "react";

const services = [
  {
    id: 1, step: "01",
    title: "Offensive Security Testing",
    description: "Simulate real attacker behavior with structured recon, exploit validation, and clear remediation paths prioritized by risk and impact.",
    tags: ["Red Team", "Recon"],
    side: "left",
  },
  {
    id: 2, step: "02",
    title: "Cloud & Infrastructure Hardening",
    description: "Design secure cloud foundations, least-privilege IAM controls, segmented networks, and hardened baselines for resilient production systems.",
    tags: ["IAM", "Network"],
    side: "right",
  },
  {
    id: 3, step: "03",
    title: "Secure CI/CD Delivery",
    description: "Embed security gates in pipelines with dependency checks, secrets scanning, policy enforcement, and release controls that keep velocity high.",
    tags: ["DevSecOps", "Pipeline"],
    side: "left",
  },
  {
    id: 4, step: "04",
    title: "Detection & Incident Readiness",
    description: "Strengthen detection logic, telemetry quality, and response playbooks so teams can identify, contain, and recover from threats faster.",
    tags: ["SIEM", "Response"],
    side: "right",
  },
  {
    id: 5, step: "05",
    title: "Threat-Led Risk Prioritization",
    description: "Translate technical findings into business risk language that supports better security decisions, roadmap focus, and stakeholder alignment.",
    tags: ["Risk", "Strategy"],
    side: "left",
  },
  {
    id: 6, step: "06",
    title: "Automation for Security Ops",
    description: "Reduce repetitive manual effort with scripted checks, workflow orchestration, and evidence collection that improves consistency at scale.",
    tags: ["Scripting", "Ops"],
    side: "right",
  },
];

export default function Roadmap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      width: "100%",
      fontFamily: "'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px 80px",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -20; } }
        .rmap-row { display: flex; align-items: stretch; width: 100%; max-width: 860px; min-height: 140px; position: relative; }
        .rmap-card-col { width: calc(50% - 30px); display: flex; align-items: flex-start; padding: 10px 0; }
        .rmap-card-col.left  { justify-content: flex-end;  padding-right: 0; }
        .rmap-card-col.right { justify-content: flex-start; padding-left: 0; }
        .rmap-spine-col { width: 60px; display: flex; flex-direction: column; align-items: center; position: relative; flex-shrink: 0; }
        .rmap-card { width: 100%; max-width: 340px; background: rgba(24,22,16,0.88); border: 1px solid rgba(200,169,110,0.18); padding: 20px 22px 16px; position: relative; transition: border-color 0.2s, background 0.2s; cursor: default; }
        .rmap-card:hover { background: rgba(200,169,110,0.06); border-color: rgba(200,169,110,0.45); }
        .rmap-card .corner-tl { position:absolute; top:-1px; left:-1px; width:12px; height:12px; border-top:2px solid #c8a96e; border-left:2px solid #c8a96e; opacity:0.4; transition:opacity 0.2s; }
        .rmap-card .corner-br { position:absolute; bottom:-1px; right:-1px; width:12px; height:12px; border-bottom:2px solid #c8a96e; border-right:2px solid #c8a96e; opacity:0.4; transition:opacity 0.2s; }
        .rmap-card:hover .corner-tl, .rmap-card:hover .corner-br { opacity:1; }

        /* horizontal connector: from card edge to spine */
        .h-line { position: absolute; top: 50%; height: 1px; background: repeating-linear-gradient(90deg, rgba(200,169,110,0.55) 0px, rgba(200,169,110,0.55) 4px, transparent 4px, transparent 8px); }
        .h-line.from-left  { right: 0; }
        .h-line.from-right { left: 0; }
        .dot { position: absolute; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; border-radius: 50%; background: rgba(14,13,10,0.95); border: 1.5px solid rgba(200,169,110,0.7); }
        .dot.at-left  { right: -4px; }
        .dot.at-right { left: -4px; }

        /* vertical spine segments */
        .v-line { flex: 1; width: 1px; background: repeating-linear-gradient(180deg, rgba(200,169,110,0.5) 0px, rgba(200,169,110,0.5) 4px, transparent 4px, transparent 8px); }
        .spine-node { width: 10px; height: 10px; border-radius: 50%; border: 1.5px solid rgba(200,169,110,0.8); background: rgba(14,13,10,0.95); flex-shrink: 0; z-index: 2; }

        .step-label { color: rgba(200,169,110,0.5); font-size: 9px; letter-spacing: 4px; margin-bottom: 8px; display:flex; align-items:center; gap:8px; }
        .step-label::after { content:''; flex:1; height:1px; background:rgba(200,169,110,0.15); }
        h3.svc-title { color:#c8a96e; font-size:12px; font-weight:400; letter-spacing:2px; text-transform:uppercase; margin:0 0 10px; }
        p.svc-desc { color:rgba(200,169,110,0.5); font-size:11.5px; line-height:1.75; margin:0 0 14px; }
        .svc-tags { display:flex; gap:6px; flex-wrap:wrap; }
        .svc-tag { font-size:8px; letter-spacing:3px; text-transform:uppercase; color:rgba(200,169,110,0.5); border:1px solid rgba(200,169,110,0.2); padding:2px 7px; }
      `}</style>

      {/* Roadmap rows */}
      <div style={{ width: "100%", maxWidth: 860, display: "flex", flexDirection: "column" }}>
        {services.map((item, i) => {
          const isLeft = item.side === "left";
          const isLast = i === services.length - 1;

          return (
            <div key={item.id} className="rmap-row">
              {/* LEFT column */}
              <div className="rmap-card-col left" style={{ position: "relative" }}>
                {isLeft ? (
                  <>
                    <div className="rmap-card" style={{ marginRight: 70, maxWidth: 380, padding: '28px 28px 20px' }}>
                      <div className="corner-tl" /><div className="corner-br" />
                      <div className="step-label" style={{ fontSize: 12, letterSpacing: 6, marginBottom: 12 }}>{item.step}</div>
                      <h3 className="svc-title" style={{ fontSize: 16, letterSpacing: 3, margin: '0 0 14px' }}>{item.title}</h3>
                      <p className="svc-desc" style={{ fontSize: 14, lineHeight: 2, margin: '0 0 18px' }}>{item.description}</p>
                      <div className="svc-tags">{item.tags.map(t => <span key={t} className="svc-tag" style={{ fontSize: 11, letterSpacing: 4, padding: '4px 12px' }}>{t}</span>)}</div>
                    </div>
                    <div className="h-line from-left" style={{ width: 70, marginTop: 0, top: "50%", transform: "translateY(-50%)" }} />
                  </>
                ) : (
                  null
                )}
              </div>

              {/* SPINE column */}
              <div className="rmap-spine-col">
                {/* top vertical line (not for first row) */}
                {i > 0 ? <div className="v-line" /> : <div style={{ flex: 1 }} />}

                {/* center node */}
                <div className="spine-node" style={{ background: hovered === i ? "rgba(200,169,110,0.15)" : "rgba(14,13,10,0.95)" }}
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />

                {/* horizontal stub toward card */}
                {isLeft ? (
                  <div style={{
                    position: "absolute", top: "50%", left: 0,
                    transform: "translateY(-50%)",
                    width: 30, height: 1,
                    background: "repeating-linear-gradient(90deg,rgba(200,169,110,0.55) 0,rgba(200,169,110,0.55) 4px,transparent 4px,transparent 8px)"
                  }} />
                ) : (
                  <div style={{
                    position: "absolute", top: "50%", right: 0,
                    transform: "translateY(-50%)",
                    width: 30, height: 1,
                    background: "repeating-linear-gradient(90deg,rgba(200,169,110,0.55) 0,rgba(200,169,110,0.55) 4px,transparent 4px,transparent 8px)"
                  }} />
                )}

                {/* bottom vertical line (not for last row) */}
                {!isLast ? <div className="v-line" /> : <div style={{ flex: 1 }} />}
              </div>

              {/* RIGHT column */}
              <div className="rmap-card-col right" style={{ position: "relative" }}>
                {!isLeft ? (
                  <>
                    <div className="h-line from-right" style={{ width: 70, top: "50%", transform: "translateY(-50%)" }} />
                    <div className="rmap-card" style={{ marginLeft: 70, maxWidth: 380, padding: '28px 28px 20px' }}>
                      <div className="corner-tl" /><div className="corner-br" />
                      <div className="step-label" style={{ fontSize: 12, letterSpacing: 6, marginBottom: 12 }}>{item.step}</div>
                      <h3 className="svc-title" style={{ fontSize: 16, letterSpacing: 3, margin: '0 0 14px' }}>{item.title}</h3>
                      <p className="svc-desc" style={{ fontSize: 14, lineHeight: 2, margin: '0 0 18px' }}>{item.description}</p>
                      <div className="svc-tags">{item.tags.map(t => <span key={t} className="svc-tag" style={{ fontSize: 11, letterSpacing: 4, padding: '4px 12px' }}>{t}</span>)}</div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
