import Link from "next/link";

export default function HybridSearchArticle() {
  return (
    <div className="blog-page">
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

      <main>
        {/* ── Article Header ── */}
        <div className="article-header">
          <div className="narrow">
            <Link className="article-back" href="/#thinking">
              &larr; All Articles
            </Link>
            <div className="article-eyebrow">
              <span className="eyebrow-tag">AI &amp; Search</span>
              <span className="eyebrow-sep" aria-hidden="true" />
              <span className="eyebrow-tag">RAG</span>
              <span className="eyebrow-sep" aria-hidden="true" />
              <span className="eyebrow-tag">Backend Engineering</span>
            </div>
            <h1>
              Why I Built a Hybrid Search Document Assistant — and What the Data
              Taught Me
            </h1>
            <p className="meta-line">
              <time dateTime="2025-09-30">September 30, 2025</time>
              <span className="dot" aria-hidden="true">
                ·
              </span>
              14 min read
            </p>
          </div>
        </div>

        {/* ── Article Body ── */}
        <article className="article-body" aria-label="Article content">
          {/* ── 1. The Problem ── */}
          <p className="lede">
            I combined BM25 keyword search and semantic vector retrieval into a
            single document assistant, then ran structured experiments to find
            out which approach actually works better — and when.
          </p>

          <h2 id="the-problem">The Problem Worth Solving</h2>

          <p>
            I've often felt frustrated while searching for an idea or concept
            buried somewhere in my documents, only to come up empty because I
            couldn't remember the exact words used to describe it. Traditional
            keyword search wasn't designed to solve that problem; it is
            strongest when the terms in your query overlap with the terms in the
            document.
          </p>

          <p>
            That frustration led me to discover semantic search — and it
            immediately felt like the right answer because it seemingly allowed
            me to calculate and store <em>meaning</em>. Text gets converted into
            numerical vectors called embeddings that capture conceptual
            similarity. This way, we can find relevant information based on the
            actual question we have, rather than just matching terms.
          </p>

          <p>
            But semantic search opened a bigger question. What if I didn't just
            want to <em>find</em> the relevant document? What if I could
            retrieve the most relevant passages, hand them directly to a
            language model, and let it read the evidence and answer my question
            in plain language? That idea is the foundation of{" "}
            <strong>Retrieval-Augmented Generation</strong>, or RAG. Instead of
            returning a list of documents and asking the user to dig through
            them, a RAG system retrieves the context and generates a direct,
            grounded answer from it.
          </p>

          <p>
            However, meaning isn't the only thing that matters. Sometimes we
            need rare technical terms, exact gene names, or specific
            identifiers. A search for "TNFAIP3" shouldn't require the model to
            reason about what the term means — it should just find it. That's
            where <strong>BM25</strong> comes in: a classical keyword ranking
            algorithm that scores documents based on exact term frequency and
            rarity across the corpus. Where semantic search understands context,
            BM25 rewards specificity.
          </p>

          <p>
            Neither approach is universally better. That realization led to the
            natural question: can I build an application that does both well? I
            wanted to build a document assistant that combines semantic and
            keyword retrieval into a single <strong>hybrid search</strong>{" "}
            system — and more importantly, I wanted to measure which approach
            works better, and when. The title promises I had a question, built
            something, measured it, and learned something. That's exactly what
            happened.
          </p>

          {/* ── 2. Architecture ── */}
          <h2 id="architecture">Architecture Overview</h2>

          <p>
            To test that, I needed a system where the same document content
            flows through both retrieval engines simultaneously. The
            architecture has two stages: document ingestion and query-time
            retrieval.
          </p>

          <figure className="arch-diagram" aria-label="Architecture diagram">
            <div className="arch-stage">
              <p className="arch-stage-label">1 — Document Ingestion</p>

              <div className="arch-flow">
                <div className="arch-node arch-node--source">
                  User uploads doc
                </div>

                <span className="arch-arrow" aria-hidden="true">
                  →
                </span>

                <div className="arch-node">Chunk</div>

                <span className="arch-arrow" aria-hidden="true">
                  →
                </span>

                <div className="arch-fork">
                  <div className="arch-branch">
                    <div className="arch-node">Embed (OpenAI)</div>
                    <span className="arch-arrow" aria-hidden="true">
                      →
                    </span>
                    <div className="arch-node arch-node--store">
                      Pinecone
                      <span className="arch-node-sub">vector DB</span>
                    </div>
                  </div>

                  <div className="arch-branch">
                    <div className="arch-node">Tokenize</div>
                    <span className="arch-arrow" aria-hidden="true">
                      →
                    </span>
                    <div className="arch-node arch-node--store">
                      BM25 Index
                      <span className="arch-node-sub">local JSON</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="arch-stage">
              <p className="arch-stage-label">2 — Query &amp; Retrieval</p>
              <div className="arch-flow arch-flow--linear">
                <div className="arch-node arch-node--source">
                  User asks question
                </div>
                <span className="arch-arrow" aria-hidden="true">
                  →
                </span>
                <div className="arch-node arch-node--hybrid">
                  Hybrid Retrieval
                  <span className="arch-node-sub">
                    Semantic · BM25 in parallel
                  </span>
                </div>
                <span className="arch-arrow" aria-hidden="true">
                  →
                </span>
                <div className="arch-node">
                  Weighted Rerank
                  <span className="arch-node-sub">normalize + combine</span>
                </div>
                <span className="arch-arrow" aria-hidden="true">
                  →
                </span>
                <div className="arch-node arch-node--store">
                  LLM Answer
                  <span className="arch-node-sub">grounded response</span>
                </div>
              </div>
            </div>
          </figure>

          <h3>What happens when a user uploads a document</h3>

          <p>
            Every uploaded file — PDF, plain text, Markdown, CSV, or JSON — goes
            through the same ingestion pipeline, which immediately forks into
            two parallel paths over the same underlying content.
          </p>
          <p>
            The raw text is extracted and split into chunks using LangChain's{" "}
            <code>RecursiveCharacterTextSplitter</code>, configured with a chunk
            size of 2,000 characters and an overlap of 200. The overlap
            preserves context that might otherwise be split across a boundary.
            From there, the two paths diverge:
          </p>

          <div className="two-path-grid">
            <div className="path-card">
              <p className="path-label">Semantic Path</p>
              <p>
                Every chunk is sent to OpenAI's{" "}
                <code>text-embedding-3-large</code> model, which converts it
                into a 3,072-dimensional vector. Those vectors are stored in
                Pinecone alongside metadata: chunk text, document ID, filename,
                and chunk number.
              </p>
            </div>
            <div className="path-card">
              <p className="path-label">Lexical Path</p>
              <p>
                The same chunks are tokenized and fed into a local BM25 index
                that tracks term frequencies, document lengths, and an inverted
                postings list. The index is persisted as a JSON file and updated
                as documents are added.
              </p>
            </div>
          </div>

          <h3>What happens when a user asks a question</h3>

          <p>
            When a question arrives, both retrieval engines search the indexed
            documents in parallel. Each retrieves <code>top_k &times; 4</code>{" "}
            candidates — more than the final result count — so the two pools can
            be merged and reranked before anything reaches the language model.
            This over-retrieval is intentional: BM25 and semantic search don't
            always agree on which chunks are relevant, and each surfaces
            candidates the other misses.
          </p>
          <p>
            The results are then merged by chunk ID, normalized independently,
            combined with a weighted score, and the top-k chunks become the
            context given to the LLM — which uses that retrieved information to
            generate a grounded answer and cite its sources.
          </p>
          <p>
            That naturally raises the question: why go to the trouble of running
            two retrieval engines at all?
          </p>

          {/* ── 3. Two Engines ── */}
          <h2 id="two-engines">
            The Two Retrieval Engines — and Why One Isn't Enough
          </h2>

          <p>
            Semantic search and BM25 define "relevance" differently, which means
            they succeed and fail on different kinds of queries.
          </p>

          <blockquote className="pull-quote">
            BM25 asks: do the query and this passage share important words?
            Semantic search asks: do they express the same idea?
          </blockquote>

          <p>
            <strong>Lexical relevance</strong> matches exact words, their
            frequency, and how rare those words are across the corpus. It is
            fast, precise, and effective when the query uses the same vocabulary
            as the source. It fails when the user reaches for a synonym or
            rephrases a concept.
          </p>
          <p>
            <strong>Semantic relevance</strong> matches meaning and intent using
            vector embeddings. It understands context, synonyms, and conceptual
            relationships regardless of exact wording. Its weakness is precision
            — when a query depends on a rare, exact token, embedding space tends
            to average it out rather than amplify it.
          </p>

          <h3>Where semantic search wins</h3>
          <p>
            Consider the query:{" "}
            <em>
              "Synaptic activity enhances local release of brain derived
              neurotrophic factor from postsynaptic dendrites."
            </em>{" "}
            This uses specific neuroscience vocabulary that a relevant passage
            might express with slightly different phrasing — different word
            order, abbreviated terms, or paraphrased mechanisms.
          </p>
          <p>
            In testing, pure BM25 retrieved the relevant document at{" "}
            <strong>rank 2</strong>. Semantic search ranked it{" "}
            <strong>1st</strong> — and held that rank as semantic weight
            increased from 50% to 100%. The model recognized the conceptual
            relationship even where exact lexical overlap was imperfect. This is
            where semantic search earns its place: when a user knows what
            they're looking for conceptually but may not know the exact
            vocabulary used in the source.
          </p>

          <h3>Where BM25 wins</h3>
          <p>
            Now consider:{" "}
            <em>
              "Recurrent mutations occur frequently within CTCF anchor sites
              adjacent to oncogenes."
            </em>{" "}
            This claim is built around highly specific genomic terminology —
            CTCF, anchor sites, oncogenes — that are precise identifiers, not
            concepts to be reasoned around.
          </p>
          <p>
            At 0% semantic weight (pure BM25), the relevant document ranked{" "}
            <strong>1st</strong>. As semantic weight increased, retrieval
            quality degraded steadily: rank 3 at 50%, rank 7 at 75%, and a
            complete miss at 100%. Increasing the semantic contribution actively
            hurt performance.
          </p>
          <p>
            The intuition: BM25 uses Inverse Document Frequency (IDF) to weight
            terms by rarity across the corpus. Matching "system" in a passage
            tells you very little when it appears in hundreds of documents.
            Matching "CTCF" is a much stronger signal precisely because it
            appears in only a handful of chunks. Semantic search, by contrast,
            maps "CTCF anchor sites" into a region of embedding space it shares
            with related genomic concepts — pulling in adjacent documents that
            are topically related but wrong.
          </p>

          <h3>The case for combining them</h3>
          <p>
            These failure modes are complementary almost by design. The queries
            where BM25 excels are precisely the queries where semantic search
            dilutes the signal — and vice versa. If their strengths are that
            complementary, combining their scores should outperform either
            retriever on its own. But that introduces a new problem: BM25 scores
            and cosine similarity scores live on completely different numerical
            scales and can't be added together directly.
          </p>

          {/* ── 4. Hybrid Search ── */}
          <h2 id="hybrid-search">Hybrid Search — The Weighted Combination</h2>

          <p>
            After running both retrieval engines on the same query, you might
            get something like this for the same chunk:
          </p>

          <div className="score-compare">
            <div className="score-row">
              <span className="score-label">Semantic score</span>
              <span className="score-value score-value--low">0.91</span>
            </div>
            <div className="score-row">
              <span className="score-label">BM25 score</span>
              <span className="score-value score-value--high">12.40</span>
            </div>
            <p className="score-note">
              These numbers are not comparable — they come from completely
              different scoring systems.
            </p>
          </div>

          <p>
            Cosine similarity is bounded between 0 and 1 by definition. BM25
            scores are unbounded — they scale with term frequency, document
            length, and corpus size and can reach into the twenties or higher.
            Adding them directly would be like averaging temperatures in Celsius
            and Fahrenheit.
          </p>

          <h3>Step 1 — Normalize each score set independently</h3>
          <p>
            The solution is min-max normalization, which rescales each candidate
            set so that its lowest score becomes 0 and its highest becomes 1:
          </p>

          <div
            className="formula-block"
            aria-label="Min-max normalization formula"
          >
            <span className="formula-lhs">x</span>
            <span className="formula-sub">normalized</span>
            <span className="formula-eq">=</span>
            <span className="formula-frac">
              <span className="formula-num">
                x − x<sub>min</sub>
              </span>
              <span className="formula-den">
                x<sub>max</sub> − x<sub>min</sub>
              </span>
            </span>
          </div>

          <p>
            After normalization, a semantic score of 0.91 and a BM25 score of
            12.40 can finally be compared — both are now expressed as a fraction
            of how strong that signal is{" "}
            <em>relative to the other candidates in that retrieval set</em>.
          </p>

          <h3>Step 2 — Combine with a weighted score</h3>
          <p>
            Once normalized, both sets are combined using a single parameter α:
          </p>

          <div
            className="formula-block formula-block--wide"
            aria-label="Hybrid score formula"
          >
            <span className="formula-lhs">hybrid_score</span>
            <span className="formula-eq">=</span>
            <span className="formula-term">
              α × semantic<sub>norm</sub>
            </span>
            <span className="formula-op">+</span>
            <span className="formula-term">
              (1 − α) × BM25<sub>norm</sub>
            </span>
          </div>

          <p>
            α is not just an implementation detail — it's the dial that
            determines which definition of relevance the system trusts more. In
            the UI it's exposed directly as the semantic weight slider.
          </p>

          <div
            className="alpha-table-wrap"
            role="table"
            aria-label="Alpha weight interpretations"
          >
            <div
              className="alpha-track"
              role="row"
              aria-label="Weight spectrum"
            >
              <span className="alpha-pole">Pure BM25</span>
              <div className="alpha-bar" aria-hidden="true">
                <div className="alpha-marker" style={{left: "0%"}}>
                  0.00
                </div>
                <div className="alpha-marker" style={{left: "25%"}}>
                  0.25
                </div>
                <div className="alpha-marker" style={{left: "50%"}}>
                  0.50
                </div>
                <div className="alpha-marker" style={{left: "75%"}}>
                  0.75
                </div>
                <div className="alpha-marker" style={{left: "100%"}}>
                  1.00
                </div>
              </div>
              <span className="alpha-pole">Pure Semantic</span>
            </div>
            <div className="alpha-rows">
              {[
                {a: "0.00", sem: "0%", bm: "100%", label: "Pure BM25"},
                {a: "0.25", sem: "25%", bm: "75%", label: "BM25-heavy hybrid"},
                {a: "0.50", sem: "50%", bm: "50%", label: "Equal weighting"},
                {
                  a: "0.75",
                  sem: "75%",
                  bm: "25%",
                  label: "Semantic-heavy hybrid",
                },
                {a: "1.00", sem: "100%", bm: "0%", label: "Pure semantic"},
              ].map((row) => (
                <div className="alpha-row" role="row" key={row.a}>
                  <span className="alpha-val" role="cell">
                    α = {row.a}
                  </span>
                  <span className="alpha-sem" role="cell">
                    {row.sem} semantic
                  </span>
                  <span className="alpha-bm" role="cell">
                    {row.bm} BM25
                  </span>
                  <span className="alpha-interp" role="cell">
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <h3>What α actually does to rankings</h3>

          <p>To make this concrete, consider two chunks after normalization:</p>

          <div className="chunk-calc">
            <div className="chunk-scores">
              <div className="chunk-col">
                <p className="chunk-col-head">Chunk A</p>
                <div className="chunk-score-row">
                  <span>Semantic</span>
                  <strong>0.90</strong>
                </div>
                <div className="chunk-score-row">
                  <span>BM25</span>
                  <strong>0.30</strong>
                </div>
              </div>
              <div className="chunk-col">
                <p className="chunk-col-head">Chunk B</p>
                <div className="chunk-score-row">
                  <span>Semantic</span>
                  <strong>0.60</strong>
                </div>
                <div className="chunk-score-row">
                  <span>BM25</span>
                  <strong>0.80</strong>
                </div>
              </div>
            </div>

            <div className="chunk-results">
              <div className="chunk-result-block">
                <p className="chunk-result-alpha">At α = 0.50</p>
                <p className="chunk-result-math">
                  A = (0.50)(0.90) + (0.50)(0.30) = <strong>0.60</strong>
                </p>
                <p className="chunk-result-math">
                  B = (0.50)(0.60) + (0.50)(0.80) = <strong>0.70</strong>
                </p>
                <p className="chunk-result-winner">Chunk B ranks higher</p>
              </div>
              <div className="chunk-result-block">
                <p className="chunk-result-alpha">At α = 0.75</p>
                <p className="chunk-result-math">
                  A = (0.75)(0.90) + (0.25)(0.30) = <strong>0.75</strong>
                </p>
                <p className="chunk-result-math">
                  B = (0.75)(0.60) + (0.25)(0.80) = <strong>0.65</strong>
                </p>
                <p className="chunk-result-winner">Chunk A ranks higher</p>
              </div>
            </div>
            <p className="chunk-caption">
              The ranking didn't change because the documents changed — it
              changed because α changed. That's what makes α the independent
              variable in the experiment.
            </p>
          </div>

          <p>
            Which raises the obvious question: what should α actually be? That
            required running real queries against a real corpus and measuring
            what came back.
          </p>

          {/* ── 5. Evaluations ── */}
          <h2 id="evaluations">Evaluations — What the Data Actually Showed</h2>

          <p>
            I ran five structured test sets against a 500-document subset of the{" "}
            <a
              href="https://github.com/beir-cellar/beir"
              target="_blank"
              rel="noopener noreferrer"
            >
              BEIR SciFact benchmark
            </a>
            , which contains scientific claim queries paired with known-relevant
            papers. The qrels (relevance judgments) acted as a golden dataset,
            letting me calculate Precision@K, Recall@K, and F1 without manual
            labeling.
          </p>

          {/* Test Set 1 */}
          <h3>Test Set 1 — Pure BM25 vs. Pure Semantic</h3>
          <p>
            Five queries were run at opposite ends of the slider — 0% semantic
            and 100% semantic — with top-k fixed at 10.
          </p>

          <div className="eval-table-wrap">
            <table className="eval-table" aria-label="Test Set 1 results">
              <thead>
                <tr>
                  <th>Query</th>
                  <th>BM25 (0%)</th>
                  <th>Semantic (100%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Statins decrease blood cholesterol.</td>
                  <td>
                    <span className="result-hit">✅ rank 2</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ rank 2</span>
                  </td>
                </tr>
                <tr>
                  <td>Statins increase blood cholesterol.</td>
                  <td>
                    <span className="result-hit">✅ rank 2</span>
                  </td>
                  <td>
                    <span className="result-warn">✅ rank 6</span>
                  </td>
                </tr>
                <tr>
                  <td>0-dimensional biomaterials show inductive properties.</td>
                  <td>
                    <span className="result-miss">❌ miss</span>
                  </td>
                  <td>
                    <span className="result-miss">❌ miss</span>
                  </td>
                </tr>
                <tr>
                  <td>TNFAIP3 is a tumor suppressor in glioblastoma.</td>
                  <td>
                    <span className="result-hit">✅ rank 1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ rank 1</span>
                  </td>
                </tr>
                <tr>
                  <td>Radioiodine treatment reduces thyroid volume.</td>
                  <td>
                    <span className="result-hit">✅ rank 1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ rank 1</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>
              BM25 matched or outperformed semantic search on 4 out of 5
              queries.
            </strong>{" "}
            For exact medical terminology, BM25 found the relevant document at
            rank 1 or 2 every time. Semantic search matched those results but
            never beat them — and on the contradictory statins claim, BM25
            returned the relevant document at rank 2 while semantic search
            pushed it to rank 6.
          </p>
          <p>
            The query both modes failed on —{" "}
            <em>"0-dimensional biomaterials show inductive properties"</em> — is
            the most instructive result in the set. "0-dimensional" is highly
            specialized and likely underrepresented in the corpus. This is a
            genuine retrieval failure, not a ranking failure. No retrieval
            system can compensate for a corpus that doesn't contain the right
            signal.
          </p>

          {/* Test Set 2 */}
          <h3>Test Set 2 — Finding the Hybrid Sweet Spot</h3>
          <p>
            Five queries were run across five weight settings: 0%, 25%, 50%,
            75%, and 100% semantic.
          </p>

          <div className="eval-table-wrap">
            <table
              className="eval-table eval-table--wide"
              aria-label="Test Set 2 results"
            >
              <thead>
                <tr>
                  <th>Query</th>
                  <th>0%</th>
                  <th>25%</th>
                  <th>50%</th>
                  <th>75%</th>
                  <th>100%</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Synaptic activity / BDNF</td>
                  <td>
                    <span className="result-warn">✅ r2</span>
                  </td>
                  <td>
                    <span className="result-warn">✅ r2</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                </tr>
                <tr>
                  <td>Rapamycin / triacylglycerols</td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                </tr>
                <tr className="table-row--highlight">
                  <td>Recurrent mutations / CTCF</td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-warn">✅ r3</span>
                  </td>
                  <td>
                    <span className="result-warn">✅ r7</span>
                  </td>
                  <td>
                    <span className="result-miss">❌</span>
                  </td>
                </tr>
                <tr>
                  <td>Sildenafil / SSRI dysfunction</td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                </tr>
                <tr>
                  <td>IL-2 / regulatory T cells</td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ r1</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            The CTCF row — highlighted above — is the most valuable data point
            in the evaluation. At 0% and 25%, the relevant document ranked 1st.
            As semantic weight increased, retrieval degraded progressively: rank
            3 at 50%, rank 7 at 75%, completely missing at 100%. Increasing the
            semantic contribution actively hurt performance on a query that
            relies on precise genomic terminology.
          </p>

          <div className="finding-callout">
            <p className="finding-label">Key Finding</p>
            <p>
              The data suggests an optimal weight of{" "}
              <strong>25–50% semantic</strong> for this corpus. At 25%, you get
              full BM25 precision on terminology-heavy queries while the
              semantic component still improves ranking on more conceptual ones.
              Pure semantic (100%) is the riskiest setting for scientific
              literature.
            </p>
          </div>

          {/* Test Set 3 */}
          <h3>Test Set 3 — Retrieval is Claim-Agnostic by Design</h3>
          <p>
            One counterintuitive finding: both{" "}
            <em>"Statins decrease blood cholesterol"</em> and{" "}
            <em>"Statins increase blood cholesterol"</em> returned the same top
            document. Similarly, two opposite claims about interferon-induced
            genes and West Nile virus survival both surfaced the same paper.
          </p>
          <p>
            This is the correct behavior. The retrieval layer's job is not to
            determine whether a claim is true — it's to find the document most
            relevant to the <em>topic</em> of the claim. The LLM then reads that
            document and makes the judgment call. A retrieval system that only
            returned documents supporting a claim would be far more dangerous
            than one that surfaces the relevant evidence and lets the model
            reason from it.
          </p>

          {/* Test Set 4 */}
          <h3>Test Set 4 — How Retrieval Breadth Affects Recall</h3>
          <p>
            Using a query with two known relevant documents, I varied top-k from
            1 to 20 at a fixed 75% semantic weight.
          </p>

          <div
            className="topk-grid"
            role="table"
            aria-label="top-k recall results"
          >
            {[
              {k: 1, found: 0, total: 2, pass: false},
              {k: 3, found: 0, total: 2, pass: false},
              {k: 5, found: 0, total: 2, pass: false},
              {k: 10, found: 2, total: 2, pass: true},
              {k: 20, found: 2, total: 2, pass: true},
            ].map((row) => (
              <div
                className={`topk-row ${row.pass ? "topk-row--pass" : "topk-row--fail"}`}
                role="row"
                key={row.k}
              >
                <span className="topk-k" role="cell">
                  top-k = {row.k}
                </span>
                <span className="topk-result" role="cell">
                  {row.pass ? "✅" : "⚠️"} {row.found}/{row.total} found
                </span>
              </div>
            ))}
          </div>

          <p>
            Neither relevant document appeared until top-k reached 10. If your
            application defaults to 5 or lower,{" "}
            <strong>
              you will miss relevant documents for multi-answer queries
            </strong>
            . The tradeoff is that a larger context window costs more tokens and
            can introduce noise — but for recall-sensitive use cases, 5 is too
            conservative.
          </p>

          {/* Test Set 5 */}
          <h3>Test Set 5 — Claim-Style vs. Natural Language</h3>
          <p>
            The same queries were run as precise scientific claims and as plain
            conversational rephrasing, both at 75% semantic weight.
          </p>

          <div className="eval-table-wrap">
            <table className="eval-table" aria-label="Test Set 5 results">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Claim-style</th>
                  <th>Natural language</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cold exposure / fat browning</td>
                  <td>
                    <span className="result-hit">✅ rank 3</span>
                  </td>
                  <td>
                    <span className="result-warn">✅ rank 6</span>
                  </td>
                </tr>
                <tr>
                  <td>Anticoagulants / stroke mortality</td>
                  <td>
                    <span className="result-hit">✅ rank 1</span>
                  </td>
                  <td>
                    <span className="result-hit">✅ rank 1</span>
                  </td>
                </tr>
                <tr>
                  <td>Suboptimal nutrition / chronic disease</td>
                  <td>
                    <span className="result-miss">❌ miss</span>
                  </td>
                  <td>
                    <span className="result-miss">❌ miss</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Claim-style queries consistently outperformed natural language on
            scientific literature. If your target user is a general audience,
            adding an LLM-based query rewriting step — one that translates
            casual questions into more precise statements before retrieval runs
            — would meaningfully improve results.
          </p>

          {/* Summary */}
          <h3>Summary of Findings</h3>

          <div className="findings-grid">
            {[
              {
                finding:
                  "BM25 matched or beat semantic search on 4/5 exact-term queries",
                implication:
                  "Don't default to high semantic weights for scientific literature",
              },
              {
                finding:
                  "Semantic weight past 50% degraded one query from rank 1 to missing",
                implication:
                  "25–50% semantic is the safer default for this corpus",
              },
              {
                finding:
                  "Contradictory claims correctly retrieved the same document",
                implication:
                  "The retrieval/reasoning division of responsibility works as designed",
              },
              {
                finding: "Both relevant documents only appeared at top-k ≥ 10",
                implication:
                  "Default top-k of 5 is too low for multi-answer queries",
              },
              {
                finding: "Claim-style queries outperformed natural language",
                implication:
                  "Query rewriting would meaningfully improve general-audience UX",
              },
            ].map((item, i) => (
              <div className="finding-card" key={i}>
                <p className="finding-card-finding">{item.finding}</p>
                <p className="finding-card-arrow" aria-hidden="true">
                  →
                </p>
                <p className="finding-card-implication">{item.implication}</p>
              </div>
            ))}
          </div>

          {/* ── 6. What I'd Do Differently ── */}
          <h2 id="next">What I&apos;d Do Differently</h2>

          <p>
            This project taught me more about retrieval quality than any amount
            of reading would have. A few things I'd revisit:
          </p>

          <div className="retro-items">
            <div className="retro-item">
              <p className="retro-item-title">
                Add stemming and stopword removal to BM25
              </p>
              <p>
                The current tokenizer is a simple regex word-split. The course
                implementation used PorterStemmer and a stopwords list, which
                would likely improve BM25's recall on morphological variants —
                especially relevant for scientific text.
              </p>
            </div>
            <div className="retro-item">
              <p className="retro-item-title">
                Try Reciprocal Rank Fusion instead of weighted scores
              </p>
              <p>
                RRF uses rankings rather than raw scores, making it immune to
                the outlier sensitivity that min-max normalization inherits. For
                corpora with irregular score distributions, it would likely
                produce more stable results.
              </p>
            </div>
            <div className="retro-item">
              <p className="retro-item-title">
                Add a cross-encoder re-ranking pass
              </p>
              <p>
                A cross-encoder sees the query and document together, catching
                subtle interactions that bi-encoders miss. Applied to the top 25
                candidates after hybrid retrieval, it would improve precision
                without sacrificing the recall gains from over-retrieval.
              </p>
            </div>
            <div className="retro-item">
              <p className="retro-item-title">
                Test with a larger and more varied corpus
              </p>
              <p>
                SciFact's 500-document subset is good for iteration speed but
                too small to draw broad conclusions. The optimal α = 25–50%
                finding may not hold for general-domain corpora where semantic
                search has more room to shine.
              </p>
            </div>
          </div>

          <div className="article-end-divider" aria-hidden="true" />

          <div className="author-row">
            <div className="author-avatar">
              <img
                src="https://picsum.photos/seed/isai-portrait/112/112"
                alt="Isai Martinez"
              />
            </div>
            <div>
              <p className="author-name">Isai Martinez</p>
              <p className="author-bio">
                Backend engineer building systems at the intersection of search,
                AI, and cloud infrastructure. AWS Solutions Architect.
              </p>
            </div>
          </div>

          <nav className="article-nav" aria-label="Article navigation">
            <Link href="/#thinking">&larr; All Articles</Link>
            <Link href="/#contact">Get in touch &rarr;</Link>
          </nav>
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
    </div>
  );
}
