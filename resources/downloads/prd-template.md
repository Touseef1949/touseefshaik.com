# Product Requirements Document (PRD) Template
*By Touseef Shaik — touseefshaik.com*

---

## Document Information
| Field | Value |
|-------|-------|
| Product/Feature | [Name] |
| PRD Version | 1.0 |
| Date | [Date] |
| Author | [Name / Role] |
| Status | Draft / Review / Approved |

---

## 1. Executive Summary
[2-3 sentences explaining what this product/feature is, why it matters, and the expected business impact. A VP should understand this without reading the rest.]

---

## 2. Problem Statement

### 2.1 Current State
[What is the current situation? What pain points exist? Who is affected?]

### 2.2 Why Now?
[Why is this the right time? Market window, competitive pressure, customer demand, regulatory requirement?]

### 2.3 User Research / Data
[Link to user interviews, survey results, analytics data, support tickets that justify this feature.]

---

## 3. Goals & Success Metrics

| Goal | Metric | Current Baseline | Target | Measurement Method |
|------|--------|-----------------|--------|-------------------|
| [e.g., Reduce support calls] | [e.g., Support tickets/month] | [Current number] | [Target number] | [How measured] |
| | | | | |

---

## 4. Scope

### 4.1 In Scope
- [Feature/requirement 1]
- [Feature/requirement 2]
- [Feature/requirement 3]

### 4.2 Out of Scope (for this release)
- [What is explicitly excluded]
- [What will be handled in a future release]

---

## 5. User Personas

| Persona | Description | Primary Need | Priority |
|---------|-------------|-------------|----------|
| [e.g., Loan Applicant] | [Description] | [What they need] | Primary |
| [e.g., Loan Officer] | [Description] | [What they need] | Secondary |
| | | | |

---

## 6. User Stories (Summary)

| ID | User Story | Priority | Sprint |
|----|-----------|----------|--------|
| US-001 | As a [role], I want [action] so that [value] | Must | Sprint 1 |
| US-002 | As a [role], I want [action] so that [value] | Should | Sprint 2 |
| US-003 | As a [role], I want [action] so that [value] | Could | Sprint 3 |

---

## 7. Functional Requirements

| ID | Requirement | Priority | Dependencies |
|----|------------|----------|-------------|
| FR-001 | [Description] | High | None |
| FR-002 | [Description] | Medium | FR-001 |
| | | | |

---

## 8. Non-Functional Requirements

| Category | Requirement | Measurement |
|----------|------------|-------------|
| Performance | [e.g., API response < 200ms p95] | [How measured] |
| Security | [e.g., OWASP Top 10 compliance] | [How verified] |
| Scalability | [e.g., Handle 10K concurrent users] | [How verified] |
| Availability | [e.g., 99.9% uptime] | [How measured] |
| Compliance | [e.g., GDPR, SOC2] | [Audit method] |

---

## 9. User Flow / Journey

### 9.1 Happy Path
[Step-by-step description of the ideal user journey. Include wireframe/mockup links.]

### 9.2 Edge Cases
- What happens if the user loses connection?
- What happens with invalid input?
- What happens at scale (1000+ concurrent users)?
- What happens if a dependent service is down?

---

## 10. Architecture & Technical Notes
[High-level architecture decisions. Link to detailed technical design doc if available.]

---

## 11. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [e.g., Third-party API downtime] | Medium | High | [e.g., Circuit breaker + fallback] |
| | | | |

---

## 12. Timeline & Milestones

| Milestone | Date | Owner | Deliverable |
|-----------|------|-------|------------|
| Design complete | [Date] | [Name] | Figma mockups |
| Dev complete | [Date] | [Name] | Feature in staging |
| QA sign-off | [Date] | [Name] | Test report |
| UAT sign-off | [Date] | [Stakeholder] | Approval email |
| Go-live | [Date] | [Name] | Production deploy |

---

## 13. Assumptions & Constraints

### Assumptions
- [Assumption 1]
- [Assumption 2]

### Constraints
- [Budget, timeline, technology, or team constraints]

---

## 14. Open Questions
- [Question 1] — Owner: [Name] — Due: [Date]
- [Question 2] — Owner: [Name] — Due: [Date]

---

## 15. Appendix
- [Link to design files]
- [Link to technical design doc]
- [Link to user research]

---

*This template is part of the free BA/PO Toolkit from touseefshaik.com/resources. For AI-powered PRD generation, try BA Assistant at businessanalysttools.streamlit.app.*
