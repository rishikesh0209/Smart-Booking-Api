# CLAUDE.md

## Purpose

This project demonstrates a spec-first, AI-assisted engineering workflow with enforceable review gates and measurable AI contribution.

---

## Workflow Gates

All changes must pass the following gates:

1. Spec Gate — A spec must exist before implementation
2. AI Build — AI may assist or generate code
3. AI Review — Code is validated against spec
4. Human Review — Final approval by engineer

---

## Rules

### Spec Enforcement

* No code should be written without a spec
* All changes must align with acceptance criteria defined in the spec
* PR must link the relevant spec file

---

### AI Usage

* AI may generate or assist code changes
* AI-generated code must be explicitly tagged in commits
* Engineers remain accountable for all changes
* AI must not introduce logic outside the defined spec

---

### PR Review Expectations

* Every PR must be reviewed against the spec
* Acceptance criteria must be validated
* Edge cases must be checked
* AI reviewer provides structured feedback
* PR cannot be merged without AI review comment

---

### Traceability

* Commits must include AI tags:

  * `AI: YES` — Fully AI-generated
  * `AI: ASSISTED` — AI-assisted changes
  * `AI: NO` — Human-authored

* PR must declare AI usage level

* AI contribution is measured per PR

---

## Metrics (for demo visibility)

* % of AI-assisted commits
* Acceptance criteria coverage
* PR review completeness

---

## Principle

AI is not trusted by default.
AI output is validated through structured, enforceable review gates.
