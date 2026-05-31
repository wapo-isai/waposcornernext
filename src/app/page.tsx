import Link from "next/link";

export default function Home() {
  return (
    <>
      <header>
        <div className="container nav-inner">
          <div className="brand">Alex Mercer</div>
          <nav aria-label="Primary">
            <div className="nav-links">
              <a href="#work">Work</a>
              <a href="#thinking">Thinking</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className="section-primary"
          aria-labelledby="hero-title"
        >
          <div className="container">
            <div className="hero-content">
              <p className="section-label">
                Backend &amp; Cloud Infrastructure
              </p>
              <h1 id="hero-title">
                Systems built for scale. Teams built to ship.
              </h1>
              <p className="hero-copy">
                I design distributed backend systems and cloud infrastructure
                that handle real load and help engineering teams move faster
                without accumulating the debt that slows them down later.
              </p>
              <div className="hero-links">
                <a className="btn-outline" href="#work">
                  See My Work
                </a>
                <a className="text-link-muted" href="#thinking">
                  Read My Thinking &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="section-surface"
          aria-labelledby="work-title"
        >
          <div className="container">
            <h2 id="work-title">Selected Work</h2>
            <p className="section-subheading">
              A few problems I&apos;ve worked on and what I learned from them.
            </p>

            <div className="work-grid">
              <article className="card case-card">
                <div className="case-content">
                  <p className="case-label">Distributed Systems</p>
                  <h3>Event-Driven Order Processing Pipeline</h3>
                  <p>
                    Order orchestration stalled under peak traffic, with retries
                    creating duplicate events and delayed fulfillment. The
                    system had to stay online while supporting strict
                    idempotency and low-latency downstream updates across
                    services. I introduced a partitioned event pipeline with
                    deterministic deduplication keys, dead-letter handling, and
                    traceable replay tooling for operators. The work reinforced
                    that resilient event flows are less about throughput in
                    isolation and more about observability and predictable
                    failure behavior.
                  </p>
                  <div className="tag-row" aria-label="Technologies used">
                    <span className="tag">Kafka</span>
                    <span className="tag">Go</span>
                    <span className="tag">PostgreSQL</span>
                    <span className="tag">OpenTelemetry</span>
                  </div>
                  <Link
                    className="case-link"
                    href="/work/event-driven-pipeline"
                  >
                    Read case study &rarr;
                  </Link>
                </div>
                <div className="case-image">
                  <img
                    src="https://picsum.photos/seed/pipeline/800/500"
                    alt="Placeholder project image for an event-driven order processing pipeline"
                  />
                </div>
              </article>

              <article className="card case-card">
                <div className="case-content">
                  <p className="case-label">Cloud Infrastructure</p>
                  <h3>Multi-Region Infrastructure Automation</h3>
                  <p>
                    Deployment consistency broke down as teams expanded into
                    multiple regions with different compliance and latency
                    requirements. Constraints included immutable rollout
                    windows, zero-downtime migration goals, and a small platform
                    team supporting many services. I built a region-aware
                    infrastructure automation framework with standardized
                    modules, policy checks in CI, and progressive rollout
                    controls tied to health signals. The biggest lesson was that
                    repeatability at scale comes from opinionated defaults, not
                    an ever-growing menu of customization.
                  </p>
                  <div className="tag-row" aria-label="Technologies used">
                    <span className="tag">Terraform</span>
                    <span className="tag">AWS</span>
                    <span className="tag">GitHub Actions</span>
                    <span className="tag">Policy as Code</span>
                  </div>
                  <Link
                    className="case-link"
                    href="/work/event-driven-pipeline"
                  >
                    Read case study &rarr;
                  </Link>
                </div>
                <div className="case-image">
                  <img
                    src="https://picsum.photos/seed/multiregion/800/500"
                    alt="Placeholder project image for multi-region infrastructure automation"
                  />
                </div>
              </article>

              <article className="card case-card">
                <div className="case-content">
                  <p className="case-label">Platform Engineering</p>
                  <h3>Internal Developer Platform</h3>
                  <p>
                    Service teams were losing delivery speed to repeated setup
                    work, fragmented tooling, and unclear ownership boundaries.
                    The platform needed to reduce cognitive load without hiding
                    critical operational tradeoffs from engineers. I delivered
                    an internal developer platform with golden paths for service
                    bootstrapping, standardized delivery pipelines, and
                    production-readiness checks embedded early in the workflow.
                    I learned that platform adoption depends on trust, and trust
                    is earned by making the paved path faster while keeping
                    escape hatches explicit.
                  </p>
                  <div className="tag-row" aria-label="Technologies used">
                    <span className="tag">Kubernetes</span>
                    <span className="tag">Backstage</span>
                    <span className="tag">Argo CD</span>
                    <span className="tag">Prometheus</span>
                  </div>
                  <Link
                    className="case-link"
                    href="/work/event-driven-pipeline"
                  >
                    Read case study &rarr;
                  </Link>
                </div>
                <div className="case-image">
                  <img
                    src="https://picsum.photos/seed/platform/800/500"
                    alt="Placeholder project image for an internal developer platform"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="thinking"
          className="section-primary"
          aria-labelledby="thinking-title"
        >
          <div className="container">
            <h2 id="thinking-title">Thinking</h2>
            <p className="section-subheading">
              Writing on systems design, engineering tradeoffs, and building
              teams.
            </p>

            <div className="thinking-grid">
              <article className="card thinking-card">
                <p className="article-date">March 14, 2025</p>
                <h3>Why We Migrated Off Kafka at 5M Events/Day</h3>
                <p>
                  A practical breakdown of the bottlenecks, migration criteria,
                  and operational tradeoffs that drove a high-stakes messaging
                  platform transition.
                </p>
                <Link
                  className="article-link"
                  href="/blog/the-hidden-maintenance-cost"
                >
                  Read more &rarr;
                </Link>
              </article>

              <article className="card thinking-card">
                <p className="article-date">January 27, 2025</p>
                <h3>The Real Cost of Eventual Consistency</h3>
                <p>
                  Consistency models are architecture choices with human costs,
                  and this piece unpacks where eventual consistency helps and
                  where it quietly taxes teams.
                </p>
                <Link
                  className="article-link"
                  href="/blog/the-hidden-maintenance-cost"
                >
                  Read more &rarr;
                </Link>
              </article>

              <article className="card thinking-card">
                <p className="article-date">November 6, 2024</p>
                <h3>Writing RFCs That Engineers Actually Read</h3>
                <p>
                  A template and review process for RFCs that improve decision
                  quality, reduce churn, and make technical alignment less
                  performative.
                </p>
                <Link
                  className="article-link"
                  href="/blog/the-hidden-maintenance-cost"
                >
                  Read more &rarr;
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section-surface"
          aria-labelledby="about-title"
        >
          <div className="container">
            <div className="about-grid">
              <div className="about-image">
                <img
                  src="https://picsum.photos/seed/aboutportrait/600/700"
                  alt="Placeholder portrait image"
                />
              </div>

              <div className="about-copy">
                <p className="section-label">Background</p>
                <h2 id="about-title">About Me</h2>
                <p>
                  I care about systems that degrade gracefully and teams that do
                  not burn out maintaining them. Reliability is not just an
                  uptime metric to me, it is a product of clear ownership,
                  well-chosen abstractions, and architecture that acknowledges
                  failure from day one.
                </p>
                <p>
                  Over the years, I have worked across product engineering and
                  platform teams, helping organizations modernize core services
                  while keeping delivery velocity intact. I am most energized at
                  the intersection of deep technical constraints and practical
                  decisions that unblock people.
                </p>
                <p>
                  Outside work, I spend time reading long-form history, hiking
                  early trails, and mentoring engineers navigating their first
                  leadership transitions. I also enjoy refining analog habits
                  that balance the pace of always-on digital work.
                </p>

                <div className="cert-row" aria-label="Certifications">
                  <div className="cert-item">
                    <div className="cert-badge">
                      <img
                        src="https://picsum.photos/seed/aws-sa/40/40"
                        alt="Placeholder badge for AWS Solutions Architect"
                      />
                    </div>
                    <span>AWS Solutions Architect</span>
                  </div>

                  <div className="cert-item">
                    <div className="cert-badge">
                      <img
                        src="https://picsum.photos/seed/aws-cp/40/40"
                        alt="Placeholder badge for AWS Cloud Practitioner"
                      />
                    </div>
                    <span>AWS Cloud Practitioner</span>
                  </div>

                  <div className="cert-item">
                    <div className="cert-badge">
                      <img
                        src="https://picsum.photos/seed/safe6/40/40"
                        alt="Placeholder badge for SAFe 6 Agile"
                      />
                    </div>
                    <span>SAFe 6 Agile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section-primary"
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className="contact-wrap">
              <p className="section-label">Contact</p>
              <h2 id="contact-title">Let&apos;s Talk</h2>
              <p>
                If you&apos;re working on a hard infrastructure or systems
                problem, or building a team that needs to move faster, I&apos;d
                like to hear about it.
              </p>
              <a className="contact-link" href="mailto:me@example.com">
                me@example.com
              </a>
              <a
                className="contact-link"
                href="https://linkedin.com/in/placeholder"
              >
                linkedin.com/in/placeholder
              </a>
            </div>
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
                <a href="#work">Work</a>
                <a href="#thinking">Thinking</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
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
