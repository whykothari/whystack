---
industry: Software engineering
slug: software-engineering
covers: architecture and design, delivery and DevOps, reliability and SRE, testing and quality, security, APIs and data storage, team process
regions: global
triggers: code, app, backend, API, deploy, release, bug, test, outage, incident, uptime, refactor, database, architecture, pull request, CI, pipeline, security, microservice, sprint
built: 2026-10-22
---

# Software engineering

The design, build, delivery, and operation of software systems. Software engineers, SREs (site reliability engineers), DevOps and platform engineers, security engineers, tech leads, and engineering managers use these terms.

## Terms

### Architecture and design

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Monolith | One deployable unit that holds all features | You decide whether to split a codebase | core |
| Microservices | Small services that each deploy and scale on their own | You design service boundaries or team ownership | core |
| Bounded context (DDD, domain-driven design) | Part of a domain with its own consistent model and words | You draw module or service boundaries | expert |
| Coupling and cohesion | How much parts depend on each other versus belong together | You review or compare designs | core |
| Event-driven architecture | Services react to published events instead of direct calls | You decouple producers from consumers | core |
| NFRs (non-functional requirements) | Needs like speed, uptime, and security, not features | You scope a design or write acceptance checks | core |
| Design doc (RFC, request for comments) | Written proposal for a change, reviewed before the build | A change is large, risky, or crosses teams | core |
| ADR (architecture decision record) | Short record of one design decision and its reasons | You make a choice others will later question | expert |
| C4 model | Four zoom levels of architecture diagram: context to code | You draw architecture for different readers | expert |
| Horizontal scaling | Add more machines instead of bigger machines | You plan for more load | core |
| Stateless service | Service keeps no client data between requests | You need easy scaling and restarts | core |
| Strangler fig pattern | Replace a legacy system one piece at a time | You modernize old code without a full rewrite | expert |

### Delivery and DevOps

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| CI (continuous integration) | Merge often; an automated build and tests check each merge | You set up how code reaches the main branch | core |
| CD (continuous delivery) | Every change is kept in a releasable state | You want to release on demand | core |
| Continuous deployment | Every change that passes checks goes to production automatically | You remove manual release steps | core |
| Deployment pipeline (CI/CD pipeline) | Automated stages from commit to production | You define build, test, and release steps | core |
| Trunk-based development | Everyone commits small changes to one main branch | You choose a branching strategy | expert |
| Feature flag (feature toggle) | Runtime switch that turns a code path on or off | You ship unfinished code or roll out gradually | core |
| Canary release | Send a new version to a small slice of traffic first | You want to limit the blast radius of a release | core |
| Blue-green deployment | Switch traffic between two identical environments | You need fast cutover and fast rollback | expert |
| Rollback | Return to the last known good version | A release causes errors | core |
| IaC (infrastructure as code) | Define servers and networks in version-controlled files | You provision or change infrastructure | core |
| Container | App packaged with its dependencies to run the same everywhere | You package and run services | core |
| DORA metrics | Measures of delivery speed and stability from the DORA research | You measure or improve delivery performance | expert |
| Change lead time | Time from commit to running in production | You measure delivery speed | expert |
| Change fail rate | Share of deploys that need a hotfix or rollback | You measure release quality | expert |
| SemVer (semantic versioning) | MAJOR.MINOR.PATCH numbers that signal breaking changes | You version a library or API | core |

### Reliability and SRE

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| SLI (service level indicator) | Measured share of good events out of all events | You choose what to measure about a service | core |
| SLO (service level objective) | Target value for an SLI over a time window | You set a reliability goal | core |
| SLA (service level agreement) | Contract with penalties if service targets are missed | Customers have a contractual promise | core |
| Error budget | Allowed unreliability, equal to 100% minus the SLO | You balance release speed against stability | core |
| Error budget policy | Agreed actions when the error budget runs out | You decide when to freeze releases | expert |
| Burn rate | How fast the service uses its error budget | You set SLO-based alerts | expert |
| CUJ (critical user journey) | Key sequence of user tasks the service must support | You pick which SLIs matter | expert |
| Availability ("nines") | Share of time or requests where the service works | You state or compare uptime targets | core |
| Tail latency (p99) | Response time of the slowest requests | Averages hide slow user experiences | core |
| Observability | Ability to explain system behavior from its outputs | You plan logs, metrics, and traces | core |
| On-call rotation | Schedule of who answers production alerts | You staff operations for a service | core |
| Runbook | Step-by-step guide to handle a known alert | You hand off operations or write alerts | core |
| Toil | Manual, repetitive ops work that grows with load | You decide what to automate | expert |
| Incident commander (IC) | Person who leads and coordinates an incident response | You define incident roles | expert |
| Severity level (SEV) | Ranked scale of incident impact | You triage or escalate an incident | core |
| Blameless postmortem | Incident review that looks for causes, not people to blame | You write up an outage | core |
| RTO and RPO (recovery time and recovery point objectives) | Allowed downtime and allowed data loss after a disaster | You plan backups and disaster recovery | expert |
| Graceful degradation | Turn off non-vital features to keep the core working | You plan for overload or partial failure | expert |
| Chaos engineering | Inject failures on purpose to test resilience | You want proof the system survives faults | expert |

### Testing and quality

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Test pyramid | Many unit tests, fewer integration tests, few end-to-end tests | You plan the mix of tests | core |
| Unit test | Checks one small piece of code in isolation | You test logic in a function or class | core |
| Integration test | Checks code against a real dependency like a database | You test the seams between parts | core |
| E2E test (end-to-end test) | Tests the whole deployed system as a user would | You verify a full user flow | core |
| Contract test (consumer-driven contract) | Checks a provider still meets what its consumers expect | Services change on separate schedules | expert |
| Test double (mock, stub, fake) | Stand-in object that replaces a real dependency in tests | A dependency is slow, costly, or unreliable | core |
| Regression test | Checks old behavior still works after a change | You fix a bug or refactor | core |
| Flaky test | Test that passes or fails with no code change | You triage unreliable CI results | core |
| Code coverage | Share of code that the tests execute | You look for untested code | core |
| TDD (test-driven development) | Write a failing test first, then the code | You want design driven by tests | core |
| Static analysis (linting) | Tools that find defects without running the code | You add automatic checks to CI | core |
| Load test | Measures behavior under expected and peak traffic | You check capacity before a launch | core |

### Security

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Threat model | Structured list of what can go wrong and the fixes | You design or review a system for security | core |
| STRIDE | Six threat types, from spoofing to elevation of privilege | You run a threat modeling session | expert |
| Attack surface | All the points where an attacker can try to get in | You reduce exposure | core |
| Least privilege | Give each user or service only the access it needs | You set permissions | core |
| AuthN and AuthZ (authentication and authorization) | Proving who you are versus what you may do | You design login and permissions | core |
| RBAC (role-based access control) | Grant permissions by role instead of by person | You manage access at scale | core |
| OWASP Top 10 | Ranked list of the most critical web app risks | You set a baseline for app security | core |
| Injection (SQL injection, XSS) | Untrusted input that runs as code or a query | You handle user input | core |
| Secrets management | Keep keys and passwords in a vault, not in code | You store credentials for services | core |
| CVE (common vulnerabilities and exposures) | Public ID for a known security flaw | You track or patch vulnerable dependencies | core |
| SBOM (software bill of materials) | Inventory of every component inside a piece of software | You manage dependency risk or compliance | expert |
| Software supply chain security | Protect dependencies, build systems, and package delivery | You harden CI/CD and third-party code | expert |
| SAST and DAST (static and dynamic application security testing) | Scan source code versus probe the running app for flaws | You add security scans to the pipeline | expert |
| Zero trust | Verify every request; trust no network location | You design network and service access | expert |
| Shift left | Move testing and security checks earlier in development | You want to find defects sooner and cheaper | core |

### APIs and data storage

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| REST API | HTTP API built around resources and standard verbs | You design a web API | core |
| OpenAPI spec | Machine-readable description of an HTTP API | You document, mock, or generate clients for an API | core |
| Idempotency (idempotency key) | Repeating a request has the same effect as sending it once | Clients retry writes or payments | core |
| Pagination | Return a large list in pages with a next link | An endpoint returns many items | core |
| Breaking change | Change that makes existing clients fail | You change an API or schema | core |
| API versioning | Way to evolve an API without breaking existing clients | You plan API changes over time | core |
| Rate limiting (throttling) | Cap requests per client per time window | You protect a service from overload or abuse | core |
| ACID | Transactions are all-or-nothing, consistent, isolated, and durable | Data must stay correct under failures | core |
| Isolation level | How much concurrent transactions can see each other's changes | You debug race conditions in a database | expert |
| Index | Data structure that speeds lookups on columns | Queries are slow | core |
| Normalization and denormalization | Remove duplicate data versus copy it for faster reads | You design a database schema | core |
| Replication | Keep copies of data on several nodes | You need read scale or failover | core |
| Sharding (partitioning) | Split data across nodes by a key | One database node can no longer cope | expert |
| Eventual consistency | Replicas agree after a delay, not at once | You choose consistency trade-offs | expert |
| Schema migration | Versioned, scripted change to a database structure | You change tables in a live system | core |
| Message queue | Buffer that passes work between services asynchronously | You decouple slow work from requests | core |

### Team process

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Sprint (iteration) | Fixed timebox in which the team delivers an increment | You plan work in Scrum | core |
| Product backlog | Ordered list of all planned work for a product | You prioritize work | core |
| User story | Short need written from the user's point of view | You describe a feature to build | core |
| Acceptance criteria | Conditions a story must meet to be accepted | You define what a feature must do | core |
| DoD (definition of done) | Shared checklist every item meets before it counts as done | You set a team quality bar | core |
| Story points and velocity | Relative effort estimates; points finished per sprint | You estimate and forecast work | core |
| Retrospective | Regular team meeting to improve how the team works | You close a sprint or project | core |
| Kanban (WIP limit) | Visual flow board with a cap on work in progress | Work arrives continuously, not in batches | core |
| Code review (pull request, PR) | Peer check of a change before it merges | You merge any change | core |
| Technical debt | Future cost from shortcuts or outdated design | You weigh speed now against cost later | core |
| Refactoring | Change code structure without changing its behavior | Code is hard to change or understand | core |

## Phrasebook

| Generic words | Trade words |
|---|---|
| make the site not go down | define SLOs and an error budget; add redundancy and remove SPOFs (single points of failure) |
| the site is slow | p99 latency is above the SLO |
| how often it's up | availability against the SLO over a 28-day rolling window |
| ship faster | raise deployment frequency and cut change lead time |
| releases keep breaking things | high change fail rate; add canary releases and automated rollback |
| turn a feature on for some users | gate it behind a feature flag and do a percentage rollout |
| test it properly | unit, integration, and E2E coverage per the test pyramid |
| tests randomly fail | flaky tests; quarantine and fix them |
| write up what went wrong | blameless postmortem with timeline, contributing factors, and action items |
| who fixes it at night | on-call rotation with runbooks and an escalation policy |
| the code is messy | technical debt; plan a refactor with regression tests |
| plan the big change first | write a design doc and record key choices in ADRs |
| split the app into parts | define bounded contexts; extract services with the strangler fig pattern |
| make it handle more users | scale horizontally behind a load balancer with stateless services |
| don't charge twice if they click twice | make the endpoint idempotent with an idempotency key |
| stop people spamming the API | add rate limiting per API key |
| change the API without breaking apps | version the API; avoid breaking changes; publish a deprecation schedule |
| make it secure | threat model with STRIDE; check against OWASP Top 10; apply least privilege |
| check our libraries are safe | generate an SBOM and scan dependencies for CVEs |
| keep passwords out of the code | move credentials to a secrets manager |
| see what's going on in production | add observability: structured logs, metrics, and distributed traces |
| back up so we don't lose data | set RTO and RPO; test backup restores |
| set up servers by script | provision with IaC |
| check each other's code | code review on every PR, with required approvals |
| the database gets corrupted under load | race condition; review the transaction isolation level |

## Deliverable shapes

| Deliverable | Standard parts |
|---|---|
| Design doc (RFC) | context and problem, goals and non-goals, proposed design, alternatives considered, NFRs, risks, rollout plan, open questions |
| ADR (architecture decision record) | title, status, context, decision, consequences |
| Blameless postmortem | summary, impact, timeline, detection, root cause and contributing factors, what went well, action items with owners |
| SLO document | service, CUJs, SLIs (specification and implementation), SLO targets, window, error budget policy, alerting |
| Runbook | alert name, what it means, impact, diagnosis steps, mitigation steps, escalation contacts |
| Threat model | scope and data flow diagram, trust boundaries, assets, threats by STRIDE category, mitigations, accepted risks |
| API spec | resources and endpoints, request and response schemas, auth, errors, pagination, versioning, rate limits, examples |
| Pull request description | what changed, why, how it was tested, risk and rollback plan, linked issue |
| User story | "As a [user], I want [goal], so that [benefit]", acceptance criteria, estimate |
| Rollout plan | change summary, feature flags, canary stages, success metrics, rollback triggers, owner |
| Test plan | scope, test levels (unit, integration, E2E), environments, test data, entry and exit criteria |

## Misused or dated terms

| Term | Problem | Use instead |
|---|---|---|
| SLA for an internal target | An SLA is a contract with penalties | SLO |
| Uptime | Vague; time-based and ignores partial failures | availability SLI measured as good requests over total requests |
| Root cause (one) | Most incidents have several causes | contributing factors |
| MTTR as the DORA stability metric | DORA renamed and narrowed it | failed deployment recovery time |
| Master and slave | Dated and exclusionary | primary and replica |
| Whitelist and blacklist | Dated and exclusionary | allowlist and denylist |
| Vulnerable and outdated components | OWASP 2021 name; the 2025 list widened it | software supply chain failures |
| "Agile" as a method | Agile is a set of values, not a process | name the method: Scrum, Kanban, XP |
| Microservices for any split | Says nothing about boundaries or ownership | bounded contexts and service ownership |
| QA phase at the end | Testing late finds defects when they cost most | continuous testing in the CI pipeline |

## Sources

- SWEBOK Guide V4.0, IEEE Computer Society. https://www.computer.org/education/bodies-of-knowledge/software-engineering (body of knowledge)
- SEVOCAB: Software and Systems Engineering Vocabulary (ISO/IEC/IEEE 24765), IEEE Computer Society. https://pascal.computer.org/sev_display/index.action (standard)
- Scrum Guide, Schwaber and Sutherland. https://scrumguides.org/scrum-guide.html (standard)
- OWASP Top 10:2025, OWASP Foundation. https://top10.owasp.org/ (standard)
- Secure Software Development Framework (SP 800-218), NIST. https://csrc.nist.gov/projects/ssdf (standard)
- Software Bill of Materials, CISA. https://www.cisa.gov/sbom (standard)
- Site Reliability Engineering, table of contents, Google. https://sre.google/sre-book/table-of-contents/ (educational book)
- Site Reliability Engineering, chapter "Service Level Objectives", Google. https://sre.google/sre-book/service-level-objectives/ (educational book)
- Site Reliability Engineering, chapter "Managing Incidents", Google. https://sre.google/sre-book/managing-incidents/ (educational book)
- The Site Reliability Workbook, "Implementing SLOs", Google. https://sre.google/workbook/implementing-slos/ (educational book)
- The Site Reliability Workbook, "Alerting on SLOs", Google. https://sre.google/workbook/alerting-on-slos/ (educational book)
- Software Engineering at Google, table of contents, Winters, Manshreck, Wright. https://abseil.io/resources/swe-book/html/toc.html (educational book)
- DORA's software delivery metrics, DORA. https://dora.dev/guides/dora-metrics-four-keys/ (docs and glossary)
- Cloud Native Glossary, CNCF. https://glossary.cncf.io/llms.txt (docs and glossary)
- Agile Glossary, Agile Alliance. https://www.agilealliance.org/agile101/agile-glossary/ (docs and glossary)
- Google Engineering Practices: What to look for in a code review, Google. https://google.github.io/eng-practices/review/reviewer/looking-for.html (docs and glossary)
- Azure REST API Guidelines, Microsoft. https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md (docs and glossary)
- Transaction Isolation, PostgreSQL documentation. https://www.postgresql.org/docs/current/transaction-iso.html (docs and glossary)
- Signals, OpenTelemetry documentation. https://opentelemetry.io/docs/concepts/signals/ (docs and glossary)
- AWS Well-Architected Framework: the pillars, AWS. https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html (docs and glossary)
- Disaster recovery options in the cloud, AWS. https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html (docs and glossary)
- Threat Modeling, OWASP Community. https://community.owasp.org/Threat_Modeling (docs and glossary)
- Architectural Decision Records, ADR GitHub organization. https://adr.github.io/ (docs and glossary)
- The C4 model, Simon Brown. https://c4model.com/ (docs and glossary)
- The Twelve-Factor App, Adam Wiggins. https://12factor.net/ (practitioner writing)
- Continuous Integration, Martin Fowler. https://martinfowler.com/articles/continuousIntegration.html (practitioner writing)
- The Practical Test Pyramid, Ham Vocke on martinfowler.com. https://martinfowler.com/articles/practical-test-pyramid.html (practitioner writing)
- Feature Toggles, Pete Hodgson on martinfowler.com. https://martinfowler.com/articles/feature-toggles.html (practitioner writing)
- Technical Debt Quadrant, Martin Fowler. https://martinfowler.com/bliki/TechnicalDebtQuadrant.html (practitioner writing)
- Strangler Fig Application, Martin Fowler. https://martinfowler.com/bliki/StranglerFigApplication.html (practitioner writing)
- Bounded Context, Martin Fowler. https://martinfowler.com/bliki/BoundedContext.html (practitioner writing)
- Tags index, martinfowler.com. https://martinfowler.com/tags/ (practitioner writing)
- Senior Site Reliability Engineer posting, Oowlish on Lever. https://jobs.lever.co/oowlish/83784a3a-b18a-40d0-bd33-d9c6c66765ae (usage check)
- Senior Site Reliability Engineer posting, Jobgether on Lever. https://jobs.lever.co/jobgether/b422e846-ecd3-4f29-a9fe-e8188bc9889e (usage check)
- What is an SRE?, Wiz Academy. https://wiz.io/academy/cloud-careers/what-is-a-site-reliability-engineer (usage check)
