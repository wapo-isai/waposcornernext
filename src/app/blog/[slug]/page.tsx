import Link from "next/link";

type BlogArticlePageProps = {
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

export default async function BlogArticlePage({params}: BlogArticlePageProps) {
  const resolvedParams = await params;
  const articleTitle = titleFromSlug(resolvedParams.slug);

  return (
    <>
      <header>
        <div className="container nav-inner">
          <Link className="brand" href="/">
            Isai Martinez
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

      <main className="blog-page">
        <section className="article-header">
          <div className="narrow">
            <p className="section-label">Systems Design</p>
            <h1>
              {articleTitle ||
                "The Hidden Maintenance Cost of Reliable Distributed Workflows"}
            </h1>
            <p className="meta-line">
              <span>February 2, 2025</span>
              <span className="dot">&middot;</span>
              <span>9 min read</span>
            </p>
          </div>
        </section>

        <article className="article-body">
          <p className="lede">
            Most distributed systems fail slowly, not suddenly, and the hardest
            part is recognizing when local optimizations begin to erode global
            reliability.
          </p>

          <p>
            Teams often approach reliability as a sequence of targeted fixes:
            add retries, add queue buffers, add alerts, and move on. Each change
            is individually rational, but over time these patches can interact
            in ways that obscure ownership and inflate cognitive load for the
            engineers maintaining the system.
          </p>
          <p>
            What starts as pragmatic engineering can become a layered safety net
            with no clear contract for failure behavior. In that environment,
            incidents become expensive not because the underlying bug is
            complex, but because no one can quickly explain where decisions are
            made and why those decisions are considered correct.
          </p>

          <h2>Reliability Is a Product of Clarity</h2>
          <p>
            When I evaluate a backend architecture, I look for clear boundaries
            around three questions: where work is accepted, where work is
            committed, and where failure becomes somebody else&apos;s
            responsibility. If those boundaries are fuzzy, teams compensate with
            procedural knowledge and heroics.
          </p>
          <p>
            Clarity has a compounding effect. It shortens incident response,
            improves confidence in refactors, and helps newer engineers build
            accurate mental models faster. In practice, this means codifying
            invariants at boundaries instead of relying on social agreements
            across team chats and onboarding docs.
          </p>

          <h3>Failure Semantics Must Be Intentional</h3>
          <p>
            A retry policy is not just infrastructure plumbing. It is a business
            decision about acceptable duplication, delay, and user impact. Teams
            that treat retries as generic resilience often discover late that
            they have encoded ambiguous domain behavior into transport
            mechanics.
          </p>

          <blockquote className="pull-quote">
            Reliable systems are less about preventing every failure and more
            about making each failure predictable, contained, and easy to reason
            about.
          </blockquote>

          <h2>Designing for Operability</h2>
          <p>
            Operability is the day-two experience of architecture. It determines
            whether engineers can understand a production issue in minutes or
            spend hours correlating fragmented logs and contradictory
            dashboards. The fastest way to improve operability is usually to
            standardize observability around transactions rather than services.
          </p>
          <p>
            This is especially important in event-driven systems where causality
            crosses queue boundaries. If correlation identifiers and structured
            error classes are optional, post-incident analysis turns into
            archaeology. If they are mandatory, incident reviews produce
            reusable improvements instead of vague conclusions.
          </p>

          <pre>
            <code>{`workflow ProcessOrder(orderEvent):
  trace_id = context.trace_id()
  idempotency_key = hash(orderEvent.id, orderEvent.version)

  if state_store.exists(idempotency_key):
    return Ack("duplicate_suppressed", trace_id)

  result = payment_service.capture(orderEvent.payment_ref)
  if result.is_retryable_error:
    return Retry(after="exponential_backoff")

  fulfillment_queue.publish(orderEvent, trace_id)
  state_store.mark_committed(idempotency_key)
  return Ack("committed", trace_id)`}</code>
          </pre>

          <h2>What Mature Systems Teams Do Differently</h2>
          <p>
            Mature teams revisit old assumptions before new incidents force the
            conversation. They schedule architecture maintenance deliberately,
            define rollback criteria before releases, and measure the
            operational cost of complexity the same way they measure latency or
            error rate.
          </p>
          <p>
            They also invest in technical writing. Well-scoped RFCs and
            postmortems make intent explicit, which lowers the risk of
            accidental regressions during growth. The return is cumulative:
            clearer decisions now reduce uncertainty in every future change.
          </p>
          <p>
            None of this requires dramatic rewrites. Most progress comes from
            repeatedly tightening boundaries, simplifying ownership, and
            choosing defaults that make the safe path the fast path.
          </p>

          <div className="article-end-divider"></div>

          <div className="author-row">
            <div className="author-avatar">
              <img
                src="https://picsum.photos/seed/article-author/56/56"
                alt="Placeholder author portrait"
              />
            </div>
            <div>
              <p className="author-name">Isai Martinez</p>
              <p className="author-bio">
                Senior backend and cloud engineer focused on resilient platform
                architecture, operability, and sustainable engineering velocity.
              </p>
            </div>
          </div>

          <div className="article-nav">
            <Link href="/#thinking">&larr; Back to Thinking</Link>
            <a href="#">Next Article &rarr;</a>
          </div>
        </article>
      </main>

      <footer>
        <div className="container">
          <div className="footer-top">
            <div>
              <p className="footer-name">Isai Martinez</p>
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
