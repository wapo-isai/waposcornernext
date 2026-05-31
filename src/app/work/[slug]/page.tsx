import Link from "next/link";

type CaseStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CaseStudyPage({params}: CaseStudyPageProps) {
  const resolvedParams = await params;
  const projectTitle = titleFromSlug(resolvedParams.slug);

  return (
    <>
      <header>
        <div className="container nav-inner">
          <Link className="brand" href="/">
            Alex Mercer
          </Link>
          <nav aria-label="Primary">
            <div className="nav-links">
              <Link href="/#work">Work</Link>
              <Link href="/#thinking">Thinking</Link>
              <Link href="/#about">About</Link>
              <Link href="/#contact">Contact</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="page-header">
          <div className="container">
            <Link className="back-link" href="/#work">
              &larr; Back to Work
            </Link>
            <p className="breadcrumb">
              Work &rarr; Case Studies &rarr; {projectTitle}
            </p>
            <p className="category-label">Distributed Systems</p>
            <h1>
              {projectTitle ||
                "Event-Driven Order Processing Pipeline at Enterprise Scale"}
            </h1>
            <p className="header-summary">
              A practical teardown of how we redesigned a high-throughput order
              workflow to reduce failure cascades, improve operability, and keep
              delivery predictable during peak demand.
            </p>

            <div className="meta-row" aria-label="Project metadata">
              <div className="meta-pill">
                <p className="meta-label">Role</p>
                <p className="meta-value">Lead Backend Engineer</p>
              </div>
              <div className="meta-pill">
                <p className="meta-label">Timeline</p>
                <p className="meta-value">6 Months</p>
              </div>
              <div className="meta-pill">
                <p className="meta-label">Scale</p>
                <p className="meta-value">5M+ Events / Day</p>
              </div>
              <div className="meta-pill">
                <p className="meta-label">Stack</p>
                <p className="meta-value">Go, Kafka, AWS, PostgreSQL</p>
              </div>
            </div>
          </div>
        </section>

        <section className="case-body">
          <div className="container case-grid">
            <aside className="toc" aria-label="Table of contents">
              <p className="toc-label">ON THIS PAGE</p>
              <a href="#overview">Overview</a>
              <a href="#the-problem">The Problem</a>
              <a href="#constraints">Constraints</a>
              <a href="#architecture">Architecture</a>
              <a href="#key-decisions">Key Decisions</a>
              <a href="#results">Results</a>
              <a href="#retrospective">Retrospective</a>
            </aside>

            <article>
              <section id="overview" className="content-section">
                <h2>Overview</h2>
                <p>
                  This project focused on modernizing a central order pipeline
                  that had accumulated operational fragility as traffic grew
                  across channels and regions. The original system handled
                  routine volume, but incident frequency increased sharply
                  during promotional spikes, where queue lag and duplicate
                  processing drove downstream instability.
                </p>
                <p>
                  Our goal was not only to improve throughput. We needed a
                  design that made failure states observable, bounded blast
                  radius when dependencies degraded, and gave on-call engineers
                  straightforward levers for intervention. The resulting
                  architecture paired event-driven processing with deterministic
                  idempotency, better replay controls, and explicit ownership
                  across domain boundaries.
                </p>
              </section>

              <section id="the-problem" className="content-section">
                <h2>The Problem</h2>
                <p>
                  The previous workflow used loosely coordinated consumers with
                  inconsistent retry semantics. Under burst load, transient
                  failures produced overlapping retries, and those retries
                  created duplicate side effects in fulfillment and
                  notifications. This caused reconciliation overhead for both
                  engineering and operations teams.
                </p>
                <p>
                  Because observability was fragmented, teams diagnosed symptoms
                  in isolation rather than understanding the end-to-end
                  transaction path. Incidents often required cross-team
                  coordination and manual data corrections, which lengthened
                  recovery time and made it difficult to establish confidence in
                  deployments touching the pipeline.
                </p>
                <div className="callout">
                  <p className="callout-label">CORE CHALLENGE</p>
                  <p>
                    The core engineering challenge was to preserve high event
                    throughput while enforcing exactly-once business outcomes
                    across inherently at-least-once delivery infrastructure.
                  </p>
                </div>
              </section>

              <section id="constraints" className="content-section">
                <h2>Constraints</h2>
                <div
                  className="constraints"
                  role="list"
                  aria-label="Project constraints"
                >
                  <div className="constraint-row" role="listitem">
                    <p className="constraint-title">No Downtime Migration</p>
                    <p className="constraint-text">
                      Traffic needed to shift incrementally without interrupting
                      order intake or introducing split-brain behavior between
                      old and new processors.
                    </p>
                  </div>
                  <div className="constraint-row" role="listitem">
                    <p className="constraint-title">
                      Strict Financial Integrity
                    </p>
                    <p className="constraint-text">
                      Duplicate charges and duplicate fulfillment updates were
                      unacceptable, which required deterministic idempotency
                      controls across service boundaries.
                    </p>
                  </div>
                  <div className="constraint-row" role="listitem">
                    <p className="constraint-title">Lean Platform Capacity</p>
                    <p className="constraint-text">
                      The platform team supported many initiatives, so
                      operational tooling had to reduce ongoing overhead rather
                      than add maintenance burden.
                    </p>
                  </div>
                  <div className="constraint-row" role="listitem">
                    <p className="constraint-title">
                      Auditability Requirements
                    </p>
                    <p className="constraint-text">
                      Every processing decision needed traceable event lineage
                      to satisfy internal audit and post-incident review
                      expectations.
                    </p>
                  </div>
                </div>
              </section>

              <section id="architecture" className="content-section">
                <h2>Architecture</h2>
                <p>
                  The revised design introduced partition-aware ingestion,
                  deterministic processing keys, and explicit dead-letter
                  workflows tied to replay tooling. Instead of treating retries
                  as purely transport-level concerns, we lifted business
                  idempotency into first-class application logic and
                  standardized observability around transaction-centric traces.
                </p>
                <figure>
                  <img
                    className="architecture-image"
                    src="https://picsum.photos/seed/case-architecture/900/500"
                    alt="Placeholder architecture diagram"
                  />
                  <figcaption>
                    Figure 1 &mdash; placeholder architecture diagram.
                  </figcaption>
                </figure>
              </section>

              <section id="key-decisions" className="content-section">
                <h2>Key Decisions</h2>

                <div className="decision-card">
                  <p className="decision-label">DECISION 01</p>
                  <h3>Adopt Deterministic Idempotency Keys</h3>
                  <p>
                    We considered relying on broker-level guarantees,
                    introducing a global lock service, and implementing
                    deterministic keys at the domain boundary. Broker guarantees
                    reduced duplicate transport events but did not protect
                    business side effects. A lock service added coordination
                    latency and operational complexity.
                  </p>
                  <p>
                    We chose deterministic idempotency keys persisted with
                    processing state because it localized correctness to domain
                    behavior and remained resilient under retries, restarts, and
                    replay scenarios.
                  </p>
                </div>

                <div className="decision-card">
                  <p className="decision-label">DECISION 02</p>
                  <h3>Separate Retryable and Terminal Failures</h3>
                  <p>
                    We evaluated a single retry queue versus explicit retry and
                    dead-letter paths with typed error policies. A single queue
                    was simpler initially, but it obscured terminal failure
                    patterns and inflated queue age during dependency outages.
                  </p>
                  <p>
                    We chose explicit failure classes and routing because it
                    made recovery intent clear, shortened diagnosis loops, and
                    gave operators a controlled replay workflow.
                  </p>
                </div>

                <div className="decision-card">
                  <p className="decision-label">DECISION 03</p>
                  <h3>Standardize End-to-End Trace Correlation</h3>
                  <p>
                    Options included adding point metrics only, building bespoke
                    logging dashboards, or enforcing trace correlation
                    identifiers from ingestion through downstream writes. Point
                    metrics were easy to add but insufficient for complex causal
                    analysis.
                  </p>
                  <p>
                    We chose end-to-end correlation to make incident response
                    faster and to produce a shared operational language across
                    product, platform, and support teams.
                  </p>
                </div>
              </section>

              <section id="results" className="content-section">
                <h2>Results</h2>
                <div className="metrics-grid" aria-label="Outcome metrics">
                  <div className="metric-card">
                    <p className="metric-value">99.97%</p>
                    <p className="metric-label">Pipeline Availability</p>
                    <p className="metric-note">
                      Sustained availability improved during peak windows
                      without emergency scaling interventions.
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="metric-value">4.2&times;</p>
                    <p className="metric-label">Throughput Headroom</p>
                    <p className="metric-note">
                      The architecture absorbed promotional bursts with stable
                      consumer lag and lower retry churn.
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="metric-value">&lt; 80ms</p>
                    <p className="metric-label">P95 Processing Latency</p>
                    <p className="metric-note">
                      Median and tail latency dropped through tighter
                      partitioning and fewer duplicate write attempts.
                    </p>
                  </div>
                  <div className="metric-card">
                    <p className="metric-value">$18K/mo</p>
                    <p className="metric-label">Cost Reduction</p>
                    <p className="metric-note">
                      Operational spend decreased from lower over-provisioning
                      and more predictable retry behavior.
                    </p>
                  </div>
                </div>
              </section>

              <section id="retrospective" className="content-section">
                <h2>Retrospective</h2>
                <p>
                  The strongest outcome was not a single performance gain but a
                  system that failed in ways teams could reason about. Clear
                  error classes, deterministic processing semantics, and shared
                  observability reduced cross-team friction and made incident
                  recovery less improvisational.
                </p>
                <p>
                  Looking back, we could have introduced contract testing
                  between producer and consumer domains earlier. Doing so sooner
                  would have reduced integration churn and accelerated
                  confidence in rollout phases where multiple teams shipped
                  changes in parallel.
                </p>

                <div className="retro-grid">
                  <div className="retro-card">
                    <p className="retro-label">WHAT WORKED</p>
                    <p className="dash-list-item">
                      <span className="dash">&mdash;</span>Idempotency policies
                      were explicit and enforced close to business logic.
                    </p>
                    <p className="dash-list-item">
                      <span className="dash">&mdash;</span>Replay tooling
                      reduced recovery time during partial downstream outages.
                    </p>
                    <p className="dash-list-item">
                      <span className="dash">&mdash;</span>Unified tracing
                      improved shared incident understanding across teams.
                    </p>
                  </div>
                  <div className="retro-card">
                    <p className="retro-label">WHAT I&apos;D CHANGE</p>
                    <p className="dash-list-item">
                      <span className="dash">&mdash;</span>Start
                      producer-consumer contract checks before migration
                      planning freezes.
                    </p>
                    <p className="dash-list-item">
                      <span className="dash">&mdash;</span>Invest earlier in
                      synthetic load scenarios matching edge-case payloads.
                    </p>
                    <p className="dash-list-item">
                      <span className="dash">&mdash;</span>Document rollback
                      decision thresholds with clearer runbook guardrails.
                    </p>
                  </div>
                </div>
              </section>

              <div className="bottom-nav">
                <Link href="/#work">&larr; Back to Work</Link>
                <Link href="#">Next Case Study &rarr;</Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-top">
            <div>
              <p className="footer-name">Alex Mercer</p>
              <p className="footer-note">Designing systems that last.</p>
            </div>
            <nav aria-label="Footer navigation">
              <div className="footer-links">
                <Link href="/#work">Work</Link>
                <Link href="/#thinking">Thinking</Link>
                <Link href="/#about">About</Link>
                <Link href="/#contact">Contact</Link>
              </div>
            </nav>
          </div>
          <p className="footer-bottom">
            &copy; 2025 &mdash; Built with intention.
          </p>
        </div>
      </footer>
    </>
  );
}
