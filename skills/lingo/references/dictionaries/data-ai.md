---
industry: Data and AI
slug: data-ai
covers: analytics and BI, data engineering, data modeling, statistics and experimentation, machine learning, LLM and AI engineering, data governance
regions: global
triggers: data, dashboard, report, SQL, metric, KPI, pipeline, warehouse, dbt, A/B test, experiment, model, ML, machine learning, AI, LLM, prompt, RAG, agent, chatbot, evals, fine-tune
built: 2026-10-22
---

# Data and AI

The work of collecting, modeling, analyzing, and governing data, and of building ML and LLM systems on top of it. Data analysts, analytics engineers, data engineers, data scientists, ML engineers, AI engineers, and data governance leads use these terms.

## Terms

### Analytics and BI

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| KPI (key performance indicator) | Metric tied directly to a business goal | You choose what a team tracks | core |
| Dimension and measure | Attribute you group by versus number you aggregate | You define a metric or build a chart | core |
| Metric definition | Exact formula, filters, grain, and owner of a metric | Teams report different numbers for one metric | core |
| Semantic layer (metrics layer) | One shared place where metrics are defined once | Many tools must show the same numbers | expert |
| Dashboard | Page of charts that tracks key metrics as data refreshes | People need to monitor metrics often | core |
| Drill-down | Move from a summary to finer detail | You explain what drives a number | core |
| Cohort analysis | Compare groups that started in the same period | You study retention or behavior over time | core |
| Funnel analysis | Track drop-off across ordered steps | You find where users quit a flow | core |
| Retention | Share of a starting cohort still active after a set period | You judge product stickiness | core |
| RLS (row-level security) | Each user sees only the rows they may see | A report serves users with different access | expert |

### Data engineering

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Data pipeline | Automated steps that move and transform data | Data must flow from sources to users | core |
| ETL and ELT (extract, transform, load) | Transform before loading versus load first, transform in the warehouse | You design how data lands | core |
| Batch and streaming | Process data in scheduled chunks versus continuously | You set how fresh data must be | core |
| CDC (change data capture) | Capture row changes from a source database as they happen | You sync an app database to the warehouse | expert |
| Orchestration (DAG, directed acyclic graph) | Schedule and order dependent pipeline tasks | Jobs depend on each other | core |
| Data warehouse | Central store built for analytic queries | You centralize data for reporting | core |
| Data lake | Low-cost storage for raw files of any format | You keep raw or unstructured data | core |
| Lakehouse | Lake storage with warehouse-style tables and governance | You want one platform for BI and ML | expert |
| Medallion architecture (bronze, silver, gold) | Raw, cleaned, and business-ready data layers | You organize tables by refinement | expert |
| Incremental load | Process only new or changed rows on each run | Full rebuilds take too long | core |
| Backfill | Rerun a pipeline over past dates | Logic changed or data was missing | core |
| Idempotent pipeline | Reruns give the same result with no duplicates | Jobs retry or get rerun | expert |
| Data observability | Monitor data freshness, volume, schema, and quality | Broken data reaches dashboards unnoticed | expert |

### Data modeling

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Dimensional modeling (Kimball) | Model data as facts and dimensions for analysis | You design warehouse tables for BI | core |
| Star schema | One fact table joined to several dimension tables | You lay out an analytics model | core |
| Fact table | Table of measurable events at a fixed grain | You store transactions or events | core |
| Dimension table | Table of descriptive attributes used to slice facts | You store customers, products, or dates | core |
| Grain | What exactly one row of a table represents | You start any fact table design | core |
| SCD (slowly changing dimension) type 1 and type 2 | Overwrite an attribute versus keep its full history | Attributes like address or plan change | expert |
| Surrogate key | Warehouse-made key used in place of the source key | Source keys clash, change, or repeat | expert |
| Conformed dimension | Dimension shared the same way across many fact tables | You join metrics across business processes | expert |

### Statistics and experimentation

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| A/B test (online controlled experiment) | Randomly split users to compare a change against control | You test whether a change works | core |
| Control and treatment (variant) | Group with no change versus group with the change | You set up an experiment | core |
| p-value | Chance of a result at least this extreme if no effect exists | You read test results | core |
| Statistical significance (alpha) | Result passes a preset false-positive threshold | You decide whether to ship | core |
| Confidence interval | Range built so that X% of such ranges hold the true value | You report effect size with its uncertainty | core |
| Type I and Type II errors | False positive versus false negative | You set alpha and power | core |
| Statistical power | Chance the test detects a real effect | You size an experiment | core |
| MDE (minimum detectable effect) | Smallest effect the test is sized to detect | You compute sample size | expert |
| Primary metric (OEC, overall evaluation criterion) | The one metric that decides the experiment | You define success before launch | expert |
| Guardrail metric | Metric that must not get worse during a test | A win could hurt something else | expert |
| SRM (sample ratio mismatch) | Group sizes differ from the planned split | You check experiment health | expert |
| Peeking | Checking results early and stopping once significant | People watch results daily | expert |
| Multiple comparisons correction (Bonferroni) | Tighten thresholds when testing many metrics or variants | You test many things at once | expert |
| CUPED (variance reduction) | Use pre-experiment data to cut noise in results | Tests need too many users | expert |

### Machine learning

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Supervised and unsupervised learning | Learn from labeled data versus find structure without labels | You frame an ML problem | core |
| Feature and feature engineering | Model input variable; crafting useful inputs | You prepare data for a model | core |
| Label (ground truth) | Correct answer the model learns to predict | You build a training set | core |
| Train, validation, and test split | Data to fit, to tune, and to score a model | You set up model evaluation | core |
| Overfitting and underfitting | Memorizes training data versus too simple to learn | Test scores differ from training scores | core |
| Cross-validation (k-fold) | Rotate held-out folds to estimate performance | Data is limited | core |
| Baseline | Simple reference model or rule to beat | You judge if a model adds value | core |
| Precision and recall | Share of predicted positives correct versus real positives found | Errors have different costs | core |
| F1 score | Single score that balances precision and recall | You compare classifiers on one number | core |
| AUC-ROC (area under the ROC curve) | Ranking quality across all classification thresholds | You compare classifiers before picking a threshold | expert |
| Class imbalance | One class is far rarer than the others | Accuracy looks high but the model is useless | core |
| Data leakage | Training uses information unavailable at prediction time | Offline scores look too good | core |
| Training-serving skew | Features differ between training and production | A model does worse live than offline | expert |
| Data drift and concept drift | Inputs, or the input-to-outcome link, change after deployment | You monitor a live model | expert |
| Model registry | Versioned catalog of trained models and their status | You manage model releases | expert |

### LLM and AI engineering

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Foundation model | Large pretrained model that adapts to many tasks | You choose a model to build on | core |
| Token | Unit of text that a model reads and writes | You estimate cost, limits, or latency | core |
| Context window | Most tokens a model can handle in one call | Inputs are long | core |
| System prompt | Standing instructions that set role, rules, and format | You configure an assistant or agent | core |
| Zero-shot and few-shot prompting | Prompt with no examples versus a few examples | You need a consistent output pattern | core |
| Chain-of-thought (CoT) | Have the model reason step by step before answering | Tasks need multi-step reasoning | core |
| Structured output (JSON schema) | Force output into a fixed machine-readable format | Code consumes the output | core |
| Temperature | Sampling setting; higher gives more varied output | You trade creativity against consistency | core |
| RAG (retrieval-augmented generation) | Retrieve relevant documents and add them to the prompt | Answers must use private or fresh data | core |
| Embedding | Vector of numbers that captures meaning for similarity search | You search or cluster by meaning | core |
| Chunking | Split documents into retrievable pieces | You index documents for RAG | core |
| Vector database | Store that searches embeddings by similarity | You build retrieval at scale | core |
| Hybrid search (BM25 keyword ranking plus embeddings) | Combine keyword and semantic search results | Queries include exact terms like codes or names | expert |
| Reranking | Rescore retrieved results and keep the best few | Retrieval returns noisy results | expert |
| Grounding (faithfulness) | Answer is supported by the provided sources | Wrong answers carry real risk | expert |
| Hallucination | Fluent output that is false or unsupported | You assess answer reliability | core |
| Evals | Repeatable tests that score model or system output | You change a prompt, model, or pipeline | core |
| Golden dataset (eval set) | Curated inputs with expected outputs or grading notes | You build evals | expert |
| LLM-as-judge (large language model as judge) | A model grades outputs against a rubric | Human grading is too slow | expert |
| Error analysis | Read failures, group them, fix the biggest groups first | Eval scores are low and causes unclear | expert |
| Trace | Logged record of every step in one request | You debug or monitor an LLM app | expert |
| Fine-tuning | Further training of a pretrained model on task data | Prompting and RAG are not enough | core |
| SFT (supervised fine-tuning) | Train on pairs of prompts and ideal responses | You teach a format, style, or task | expert |
| LoRA (low-rank adaptation) and PEFT (parameter-efficient fine-tuning) | Fine-tune only a small share of weights, often added ones | You fine-tune on a tight budget | expert |
| Agent | LLM that chooses its own steps and tool calls | The path to the goal is not fixed | core |
| Workflow (agentic workflow) | LLM calls along fixed, predefined code paths | The steps are known ahead of time | expert |
| Tool use (function calling) | Model calls external functions through defined schemas | The model must act or fetch live data | core |
| Guardrails | Checks that block unsafe or off-policy input or output | You ship an LLM to users | core |
| Prompt injection | Untrusted input that hijacks the model's instructions | The model reads user or web content | core |

### Data governance

| Term | Plain meaning | Use it when | Tier |
|---|---|---|---|
| Data governance | Policies, roles, and decisions for managing data | You set who decides what about data | core |
| Data owner and data steward | Person accountable for a dataset versus person caring for it | You assign responsibility for data | core |
| Data catalog | Searchable inventory of datasets and what they mean | People cannot find or trust data | core |
| Data lineage | Trace of where data came from and how it changed | You debug a number or assess change impact | core |
| Data quality dimensions | Accuracy, completeness, consistency, timeliness, validity, uniqueness | You define data quality checks | core |
| Data contract | Agreed schema, quality rules, and SLAs between producer and consumer | Upstream changes break downstream data | expert |
| MDM (master data management) | One trusted record for key entities like customers | Systems disagree about core entities | expert |
| PII (personally identifiable information) | Data that can identify a specific person | You store, share, or train on user data | core |
| Data retention policy | Rules for how long each kind of data is kept | You meet legal or privacy duties | core |
| Model card | Document of a model's uses, limits, data, and results | You release or adopt a model | expert |
| AI RMF (NIST AI Risk Management Framework) | Framework to govern, map, measure, and manage AI risk | You set up AI risk controls | expert |

## Phrasebook

| Generic words | Trade words |
|---|---|
| a report that shows how we're doing | KPI report (or dashboard) |
| everyone has different numbers | metric discrepancies across reports |
| how many people come back | retention rate (or cohort retention) |
| where people drop off | funnel analysis with step-level conversion |
| move data from our app into one place | data pipeline into a central warehouse |
| clean up the data tables | data cleaning and transformation (data modeling) |
| keep history when a customer changes plan | track history with SCD type 2 (or snapshots) |
| one row per what? | the table's grain |
| the data broke and nobody noticed | undetected data quality incident |
| the other team changed their table and broke ours | upstream breaking schema change |
| test if the new version is better | A/B test (or offline evaluation) |
| is the result real? | check statistical significance, confidence interval, and SRM |
| how many users do we need | power analysis from baseline rate, MDE, alpha, and power |
| predict which customers will leave | churn prediction model |
| the model is great in testing but bad live | check for data leakage, training-serving skew, and drift |
| make the chatbot use our documents | RAG (retrieval-augmented generation) over our documents |
| the AI makes things up | hallucination (ungrounded output) |
| check if the AI is good | evals (evaluation of model or system output) |
| make the AI give the same format every time | structured output (schema-constrained format) |
| teach the AI our style | style adaptation by few-shot prompting (or fine-tuning) |
| let the AI do tasks by itself | AI agent with tool use |
| stop users tricking the AI | prompt injection or jailbreak defense |
| the AI is too slow or costly | LLM latency and cost optimization |
| who is in charge of this data | data ownership (data owner and data steward) |
| personal info | PII (personally identifiable information), or personal data under GDPR |

## Deliverable shapes

| Deliverable | Standard parts |
|---|---|
| Metric definition spec | name, business question, formula, numerator and denominator, filters, grain, dimensions, owner, source tables |
| Dashboard spec | audience, decisions it supports, KPIs, filters, drill-down paths, refresh schedule, data sources, access (RLS) |
| Dimensional model design | business process, grain, fact tables, dimension tables, keys, SCD type per attribute, bus matrix |
| Pipeline design doc | sources, ingestion method (batch, streaming, CDC), transformations, schedule and DAG, SLAs, tests, backfill plan, owners |
| Data contract | producer, consumer, schema, semantics, quality rules, freshness SLA, change process, version |
| Experiment design (pre-registration) | hypothesis, primary metric, guardrail metrics, unit of randomization, MDE, sample size, duration, analysis plan |
| Experiment readout | result per metric with confidence interval, significance, SRM check, segments, decision, next steps |
| ML model doc (model card) | intended use, limits, training data, features, metrics on held-out data, fairness checks, monitoring plan |
| Eval plan | success criteria, golden dataset, grading method (code, LLM-as-judge, human), rubric, thresholds, run cadence |
| RAG system design | corpus, chunking, embedding model, retrieval (hybrid, top-k), reranking, prompt template, citations, evals |
| Agent spec | goal, tools and schemas, system prompt, stop conditions, guardrails, human review points, evals, tracing |
| SQL analysis (query plus findings) | business question, data sources and tables, assumptions and filters, commented query, result table or chart, key findings, caveats, next steps |

## Misused or dated terms

| Term | Problem | Use instead |
|---|---|---|
| AI for any model | Hides what the system does | name the model type: classifier, LLM, recommender |
| Accuracy on rare events | Misleading when classes are imbalanced | precision, recall, F1, or PR AUC |
| "Significant" meaning important | Statistical significance says nothing about size | effect size with a confidence interval |
| ETL for warehouse-native transforms | Modern stacks load first, then transform | ELT |
| Big data | No fixed meaning | state the volume, velocity, and tools |
| Train the AI on our docs | Usually means retrieval, not training | RAG or indexing |
| Fine-tune for a prompt change | Fine-tuning changes model weights | prompt engineering |
| Agent for a fixed sequence of calls | Agents choose their own steps | workflow or prompt chain |
| Hallucination for every wrong answer | Hides whether retrieval or generation failed | retrieval failure versus ungrounded answer |
| Measure (dbt Semantic Layer) | Deprecated in the new YAML spec (Fusion, dbt Core 1.12) | simple metric |
| Data scientist for every data role | Roles split into analyst, analytics engineer, ML engineer | name the role |

## Sources

- DAMA-DMBOK: Data Management Body of Knowledge, DAMA International. https://dama.org/learning-resources/dama-data-management-body-of-knowledge-dmbok/ (body of knowledge)
- DAMA-DMBOK2 knowledge areas summary, GCcollab wiki. https://wiki.gccollab.ca/Data_Management (body of knowledge)
- AI Risk Management Framework, NIST. https://www.nist.gov/itl/ai-risk-management-framework (standard)
- The Government Data Quality Framework, UK Government. https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework (standard)
- Dimensional Modeling Techniques, Kimball Group. https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/ (educational book)
- Introductory Statistics 2e, chapter 9 key terms, OpenStax. https://openstax.org/books/introductory-statistics-2e/pages/9-key-terms (educational book)
- An Introduction to Statistical Learning, James, Witten, Hastie, Tibshirani. https://www.statlearning.com/ (educational book)
- Trustworthy Online Controlled Experiments, Kohavi, Tang, Xu. https://experimentguide.com/ (educational book)
- Fundamentals of Data Engineering, Reis and Housley, O'Reilly. https://oreilly.com/library/view/fundamentals-of-data/9781098108298 (educational book)
- Machine Learning Glossary, Google for Developers. https://developers.google.com/machine-learning/glossary (docs and glossary)
- MLOps: Continuous delivery and automation pipelines in machine learning, Google Cloud. https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning (docs and glossary)
- How we structure our dbt projects, dbt Labs. https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview (docs and glossary)
- About MetricFlow, dbt Labs. https://docs.getdbt.com/docs/build/about-metricflow (docs and glossary)
- Migrate to the latest YAML spec, dbt Labs. https://docs.getdbt.com/docs/build/latest-metrics-spec (docs and glossary)
- Medallion Architecture, Databricks. https://www.databricks.com/glossary/medallion-architecture (docs and glossary)
- OpenLineage documentation, OpenLineage. https://openlineage.io/docs/ (docs and glossary)
- What is Power BI?, Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-service-overview (docs and glossary)
- Experimentation glossary, Statsig. https://www.statsig.com/glossary (docs and glossary)
- Diagnosing Sample Ratio Mismatch in A/B Testing, Microsoft Research. https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/ (docs and glossary)
- Define success criteria and build evaluations, Anthropic. https://platform.claude.com/docs/en/docs/test-and-evaluate/develop-tests (docs and glossary)
- Prompt engineering overview, Anthropic. https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview (docs and glossary)
- PEFT documentation, Hugging Face. https://huggingface.co/docs/peft/index (docs and glossary)
- Model Cards, Hugging Face. https://huggingface.co/docs/hub/model-cards (docs and glossary)
- Building effective agents, Anthropic. https://www.anthropic.com/research/building-effective-agents (practitioner writing)
- Introducing Contextual Retrieval, Anthropic. https://www.anthropic.com/news/contextual-retrieval (practitioner writing)
- Your AI Product Needs Evals, Hamel Husain. https://hamel.dev/blog/posts/evals/ (practitioner writing)
- How Not To Run an A/B Test, Evan Miller. https://www.evanmiller.org/how-not-to-run-an-ab-test.html (practitioner writing)
- Senior Analytics Engineer posting, Lemnis on Lever. https://jobs.lever.co/lemnis/d2b67055-341f-44b1-bcc6-faeb80f5905d (usage check)
- Analytics Engineer posting, WeAreDevelopers. https://www.wearedevelopers.com/en/jobs/ext/5554504/analytics-engineer (usage check)
- Senior AI Engineer with RAG and agentic architectures posting, EPAM. https://careers.epam.com/en/vacancy/senior-ai-engineer-with-rag-and-agentic-architectures-blt4xa0ywng2pe3yfc0_en (usage check)
- Senior AI Engineer, Evals and Observability posting, EdTech Jobs. https://www.edtech.com/jobs/senior-ai-engineer-evalsobservability-concentration-2570 (usage check)
