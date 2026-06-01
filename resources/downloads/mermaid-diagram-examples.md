# Mermaid Diagram Examples for BAs and POs
*By Touseef Shaik — touseefshaik.com*

---

These examples render natively in GitHub, GitLab, Notion (with Mermaid plugin), Confluence (with Mermaid macro), and any Markdown editor. Copy, paste, and adapt.

---

## 1. Flowchart — Loan Application Process

```mermaid
flowchart TD
    A[Customer Submits Application] --> B{KYC Verification}
    B -->|Pass| C[Credit Check]
    B -->|Fail| D[Reject Application]
    C -->|Score > 700| E[Auto-Approval]
    C -->|Score 500-700| F[Manual Review]
    C -->|Score < 500| D
    F --> G{Loan Officer Decision}
    G -->|Approve| H[Generate Loan Agreement]
    G -->|Reject| D
    E --> H
    H --> I[Customer Signs Agreement]
    I --> J[Disburse Funds]
    J --> K[Application Complete]
```

**When to use:** End-to-end business process visualization. Stakeholder-friendly.

---

## 2. Sequence Diagram — API Integration Flow

```mermaid
sequenceDiagram
    actor Customer
    participant MobileApp
    participant APIGateway
    participant AuthService
    participant LoanService
    participant CreditBureau

    Customer->>MobileApp: Submit application
    MobileApp->>APIGateway: POST /applications
    APIGateway->>AuthService: Validate token
    AuthService-->>APIGateway: Token valid
    APIGateway->>LoanService: Create application
    LoanService->>CreditBureau: Check credit score
    CreditBureau-->>LoanService: Score: 720
    LoanService-->>APIGateway: Application created
    APIGateway-->>MobileApp: 201 Created
    MobileApp-->>Customer: "Application submitted!"
```

**When to use:** System integration design, API contract discussions, microservice communication.

---

## 3. State Diagram — Order / Application Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted: Customer submits
    Submitted --> UnderReview: System assigns reviewer
    UnderReview --> Approved: Reviewer approves
    UnderReview --> Rejected: Reviewer rejects
    UnderReview --> MoreInfoNeeded: Missing documents
    MoreInfoNeeded --> UnderReview: Customer provides docs
    Approved --> Disbursed: Funds transferred
    Disbursed --> [*]
    Rejected --> [*]
```

**When to use:** Entity lifecycle, status workflows, anything with clear state transitions.

---

## 4. Entity Relationship (ER) — Data Model Sketch

```mermaid
erDiagram
    CUSTOMER ||--o{ APPLICATION : submits
    APPLICATION ||--|{ DOCUMENT : contains
    APPLICATION ||--o| CREDIT_CHECK : undergoes
    APPLICATION ||--o{ STATUS_HISTORY : has
    LOAN_OFFICER ||--o{ APPLICATION : reviews

    CUSTOMER {
        string customer_id PK
        string name
        string email
        string phone
        date dob
    }

    APPLICATION {
        string application_id PK
        string customer_id FK
        string status
        float amount
        date submitted_date
    }

    CREDIT_CHECK {
        string check_id PK
        string application_id FK
        int credit_score
        string bureau
        date checked_date
    }
```

**When to use:** Data model discussions, database design, system architecture reviews.

---

## 5. Gantt Chart — Project Timeline

```mermaid
gantt
    title Feature Delivery Timeline
    dateFormat  YYYY-MM-DD
    section Design
    Wireframes           :d1, 2026-06-01, 5d
    UI Design            :d2, after d1, 5d
    Design Review        :d3, after d2, 2d
    section Development
    Sprint 1 (Core)      :s1, after d3, 10d
    Sprint 2 (Features)  :s2, after s1, 10d
    section Testing
    QA Testing           :t1, after s2, 5d
    UAT                  :t2, after t1, 3d
    section Release
    Go-Live              :milestone, after t2, 1d
```

**When to use:** Sprint planning, roadmap presentations, stakeholder timeline discussions.

---

## 6. Class Diagram — System Architecture

```mermaid
classDiagram
    class User {
        +String userId
        +String email
        +String role
        +login()
        +logout()
    }

    class Application {
        +String applicationId
        +String userId
        +String status
        +Float amount
        +submit()
        +approve()
        +reject()
    }

    class NotificationService {
        +sendEmail()
        +sendSMS()
        +sendPush()
    }

    class AuditLog {
        +logAction()
        +getHistory()
    }

    User "1" --> "*" Application : creates
    Application --> NotificationService : triggers
    Application --> AuditLog : logs
```

**When to use:** High-level system design, architecture review, onboarding new developers.

---

## 7. Pie Chart — Data Visualization

```mermaid
pie title Application Status Distribution
    "Approved" : 65
    "Under Review" : 20
    "Rejected" : 10
    "Draft" : 5
```

**When to use:** Dashboard mockups, stakeholder presentations, data snapshots.

---

## 8. Mindmap — Feature Breakdown

```mermaid
mindmap
  root((Loan Portal))
    Customer Features
      Online Application
      Document Upload
      Status Tracking
      EMI Calculator
    Admin Features
      Application Review
      Approval Workflow
      Dashboard
      Reports
    Integration
      Credit Bureau API
      KYC Service
      Payment Gateway
      SMS/Email Notifications
```

**When to use:** Brainstorming sessions, feature scoping, stakeholder alignment workshops.

---

## Tips for Using Mermaid in BA/PO Work

1. **Paste into markdown** — Mermaid renders in GitHub, GitLab, Notion (plugin), Confluence (macro).
2. **Use BA Assistant to auto-generate** — describe your system in plain English and get Mermaid flowcharts, sequence diagrams, and state diagrams in the output.
3. **Start simple** — a 5-node flowchart is more useful than a 30-node diagram nobody reads.
4. **Version control your diagrams** — since Mermaid is plain text, it diffs beautifully in git.
5. **Label everything** — unclear diagram labels are worse than no diagram.

---

*This resource is part of the free BA/PO Toolkit from touseefshaik.com/resources. For AI-powered Mermaid diagram generation, try BA Assistant at tshaik1990-ba-assistant.hf.space.*
