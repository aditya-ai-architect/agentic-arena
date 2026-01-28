"use client";

export default function Philosophy() {
  return (
    <section className="section">
      <div className="container">
        <div className="badge" style={{ marginBottom: 32 }}>
          The Difference
        </div>

        <div className="glass-static" style={{ padding: 48 }}>
          <div className="comparison">
            <div>
              <h3 className="comparison-title muted">Workflows</h3>
              <ul className="comparison-list">
                <li className="comparison-item muted">
                  <span className="comparison-dot" />
                  Trigger fires
                </li>
                <li className="comparison-item muted">
                  <span className="comparison-dot" />
                  Predefined path executes
                </li>
                <li className="comparison-item muted">
                  <span className="comparison-dot" />
                  If X then Y, else Z
                </li>
                <li className="comparison-item muted">
                  <span className="comparison-dot" />
                  You anticipate every edge case
                </li>
                <li className="comparison-item muted">
                  <span className="comparison-dot" />
                  One unexpected input = broken
                </li>
              </ul>
            </div>

            <div>
              <h3 className="comparison-title">Agents</h3>
              <ul className="comparison-list">
                <li className="comparison-item">
                  <span className="comparison-dot active" />
                  Context provided
                </li>
                <li className="comparison-item">
                  <span className="comparison-dot active" />
                  Model reasons about task
                </li>
                <li className="comparison-item">
                  <span className="comparison-dot active" />
                  Decides what to do next
                </li>
                <li className="comparison-item">
                  <span className="comparison-dot active" />
                  Adapts to edge cases
                </li>
                <li className="comparison-item">
                  <span className="comparison-dot active" />
                  Handles ambiguity
                </li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)", textAlign: "center" }}>
            <p className="text-muted-foreground" style={{ fontSize: 14 }}>
              Workflows = you think for the machine
            </p>
            <p className="text-muted" style={{ fontSize: 14, marginTop: 8 }}>
              Agents = the machine thinks with you
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
