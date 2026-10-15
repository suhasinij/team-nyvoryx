import { IngestedDocument, Citation, SuggestedAction } from '../types';

export interface CopilotResponse {
  answer: string;
  citations: Citation[];
  suggestedActions: SuggestedAction[];
}

export const SUGGESTED_QUERIES = [
  {
    title: 'Security Vulnerabilities',
    query: 'What critical security vulnerabilities were discovered in the Q3 audit report?',
    badge: 'SecOps',
  },
  {
    title: 'Cloud Budget & FinOps',
    query: 'Summarize the cloud migration budget, expected savings, and timeline for 2027.',
    badge: 'FinOps',
  },
  {
    title: 'AI Product Roadmap',
    query: 'What are the core milestones and SLA requirements for the NYVORYX AI Core?',
    badge: 'Product',
  },
  {
    title: 'Action Item Extraction',
    query: 'Generate an executive action plan with owners and deadlines across all active documents.',
    badge: 'Executive',
  },
];

export async function queryCopilotEngine(
  query: string,
  documents: IngestedDocument[]
): Promise<CopilotResponse> {
  // Simulate network & inference delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lower = query.toLowerCase();

  // 1. Security / Audit Query
  if (lower.includes('security') || lower.includes('vulnerabilit') || lower.includes('audit') || lower.includes('iam') || lower.includes('cve')) {
    const auditDoc = documents.find((d) => d.id === 'doc-001') || documents[0];
    return {
      answer: `Based on **${auditDoc?.title || 'the Audit Documentation'}**, the auditor flagged 3 critical areas requiring swift operational remediation:

1. **IAM Role Over-Privilege (SEC-2026-88)**: 18 DevOps service accounts possess administrative wildcard (\`*\`) permissions across production RDS databases and S3 buckets.
2. **KMS Key Rotation Protocol**: Staging storage backups older than 90 days are utilizing default AWS-managed keys instead of customer-managed keys with automated 90-day envelope rotation.
3. **Legacy Container Vulnerabilities**: 3 High-Severity CVEs were detected in non-production ingress proxies.

**Strategic Recommendation**: Implement scoped least-privilege RBAC within 14 business days to guarantee uninterrupted SOC-2 Type II attestation.`,
      citations: [
        {
          documentId: auditDoc ? auditDoc.id : 'doc-001',
          documentTitle: auditDoc ? auditDoc.title : 'NYVORYX Q3 Enterprise Security & Compliance Audit',
          pageNumber: 14,
          snippet:
            'Audit finding SEC-2026-88: 18 DevOps service accounts possess administrative wildcard (*) permissions across production S3 and RDS instances. Recommendation: Implement least-privilege RBAC policies within 14 business days.',
          confidence: 98.7,
        },
        {
          documentId: auditDoc ? auditDoc.id : 'doc-001',
          documentTitle: auditDoc ? auditDoc.title : 'NYVORYX Q3 Enterprise Security & Compliance Audit',
          pageNumber: 22,
          snippet:
            'While production storage adheres to AES-256 GCM encryption, staging backups older than 90 days were discovered using default AWS-managed keys rather than customer-managed KMS keys with mandatory 90-day rotation schedules.',
          confidence: 96.4,
        },
      ],
      suggestedActions: [
        {
          id: `act-${Date.now()}-1`,
          title: 'Enforce Least-Privilege IAM on 18 Service Accounts',
          description: 'Deprecate wildcard administrator policies and replace with scoped RBAC permissions.',
          priority: 'critical',
          department: 'SecOps',
          dueDate: '2026-10-26',
        },
        {
          id: `act-${Date.now()}-2`,
          title: 'Automate Customer-Managed KMS Key Rotation',
          description: 'Deploy Terraform module to enforce 90-day envelope key rotation on staging buckets.',
          priority: 'high',
          department: 'SecOps',
          dueDate: '2026-11-03',
        },
      ],
    };
  }

  // 2. Cloud / Migration / FinOps Query
  if (lower.includes('cloud') || lower.includes('migrat') || lower.includes('finops') || lower.includes('budget') || lower.includes('cost') || lower.includes('saving')) {
    const cloudDoc = documents.find((d) => d.id === 'doc-002') || documents[0];
    return {
      answer: `According to the **${cloudDoc?.title || 'Global Cloud Migration Strategy'}**, the enterprise modernization blueprint outlines clear financial and architectural gains:

- **Capex Optimization**: Projected annualized cost reduction of **$6.8M** by deprecating legacy on-premise Oracle clusters and adopting BigQuery on-demand compute with committed use discounts (CUD).
- **Core Technology Stack**:
  - **Transaction Tier**: Google Cloud Spanner multi-region instances providing 99.999% availability and sub-45ms P99 latency.
  - **Analytical Engine**: Google BigQuery serverless slots with real-time CDC synchronization.
  - **Orchestration**: Managed Kubernetes (GKE 1.30) with automated cluster autoscaling.
- **Key Cutover Milestone**: Phase 2 zero-downtime cutover rehearsal is locked for **March 15, 2027**, following dual-write synchronization.`,
      citations: [
        {
          documentId: cloudDoc ? cloudDoc.id : 'doc-002',
          documentTitle: cloudDoc ? cloudDoc.title : 'Global Cloud Modernization & FinOps Architecture 2027',
          pageNumber: 19,
          snippet:
            'By deprecating legacy on-premise Oracle clusters and adopting BigQuery on-demand compute with committed use discounts (CUD), NYVORYX will achieve an annualized Capex and licensing reduction of $6.8M by end of Q4 2027.',
          confidence: 99.1,
        },
        {
          documentId: cloudDoc ? cloudDoc.id : 'doc-002',
          documentTitle: cloudDoc ? cloudDoc.title : 'Global Cloud Modernization & FinOps Architecture 2027',
          pageNumber: 33,
          snippet:
            'Phase 2 begins in January 2027 with dual-write replication to Cloud Spanner. A zero-downtime cutover rehearsal is scheduled for March 15, with automatic fallback telemetry monitored via Cloud Operations Suite.',
          confidence: 97.6,
        },
      ],
      suggestedActions: [
        {
          id: `act-${Date.now()}-3`,
          title: 'Review Cloud Spanner Dual-Write Rehearsal Runbook',
          description: 'Conduct architecture review with database reliability engineering team for March cutover.',
          priority: 'high',
          department: 'DevOps',
          dueDate: '2026-11-15',
        },
        {
          id: `act-${Date.now()}-4`,
          title: 'Execute Oracle License Decommissioning Schedule',
          description: 'Notify enterprise vendor relations to capture $6.8M annualized Capex reduction.',
          priority: 'high',
          department: 'FinOps',
          dueDate: '2026-11-28',
        },
      ],
    };
  }

  // 3. Roadmap / AI / SLA Query
  if (lower.includes('roadmap') || lower.includes('product') || lower.includes('sla') || lower.includes('h2') || lower.includes('ai')) {
    const roadDoc = documents.find((d) => d.id === 'doc-003') || documents[0];
    return {
      answer: `From the **${roadDoc?.title || 'Executive Product Roadmap & AI Core'}**, here are the executive priorities for H2:

- **Enterprise SLA Commitment**: Guaranteed **99.99% uptime** with sub-250ms query response latency across federated tenant instances.
- **Ecosystem Connectors**: Turnkey connectors for Slack, Microsoft Teams, and Google Workspace, unifying distributed organizational memory.
- **Tenant Isolation & Privacy**: Strict cryptographic tenant partitioning. Customer data is never co-mingled or used for foundation model training without explicit opt-in.
- **Milestone Delivery**: M3 General Availability targeted for **November 2026** following pilot results indicating a **68% reduction** in employee onboarding search time.`,
      citations: [
        {
          documentId: roadDoc ? roadDoc.id : 'doc-003',
          documentTitle: roadDoc ? roadDoc.title : 'NYVORYX Executive Product Roadmap & AI Core H2',
          pageNumber: 11,
          snippet:
            'Key Milestone M3: General Availability of the Document AI dropzone and multimodal Copilot feed is scheduled for November 2026. Beta testing with 12 enterprise pilot accounts showed a 68% decrease in onboarding search time.',
          confidence: 99.4,
        },
        {
          documentId: roadDoc ? roadDoc.id : 'doc-003',
          documentTitle: roadDoc ? roadDoc.title : 'NYVORYX Executive Product Roadmap & AI Core H2',
          pageNumber: 18,
          snippet:
            'All document vectors and extracted semantic entities are cryptographically partitioned per enterprise tenant. Customer data is never used to train generalized foundation models without explicit contractual consent.',
          confidence: 98.2,
        },
      ],
      suggestedActions: [
        {
          id: `act-${Date.now()}-5`,
          title: 'Deploy Enterprise SLA Latency Alerting (99.99%)',
          description: 'Set up multi-region synthetic probes and automated escalation channels.',
          priority: 'medium',
          department: 'Product',
          dueDate: '2026-11-10',
        },
        {
          id: `act-${Date.now()}-6`,
          title: 'Finalize Workspace & Slack Connector Beta Testing',
          description: 'Verify OAuth 2.0 tenant boundary enforcement with pilot customers.',
          priority: 'high',
          department: 'Product',
          dueDate: '2026-11-22',
        },
      ],
    };
  }

  // 4. General / Action Item Synthesis Query
  const topDoc = documents[0];
  const secondDoc = documents[1] || topDoc;
  return {
    answer: `Synthesizing organizational knowledge across **${documents.length} ingested enterprise documents**:

### Executive Summary & Cross-Domain Insights
- **Security & Compliance Posture**: High foundational strength with SOC-2 Type II attestation, but requires immediate closure of 18 over-privileged IAM accounts and automated KMS rotation.
- **Cloud Architecture & FinOps**: Modernization roadmap projects **$6.8M** in annualized savings via Google Cloud Spanner and BigQuery, with zero-downtime cutover rehearsal set for March 15.
- **Product Velocity**: NYVORYX Organizational Memory is on track for November 2026 GA with strict enterprise privacy guarantees and a 99.99% SLA.

Would you like me to push the highlighted action items directly to the Team NYVORYX task board?`,
    citations: [
      {
        documentId: topDoc.id,
        documentTitle: topDoc.title,
        pageNumber: topDoc.chunks[0]?.pageNumber || 1,
        snippet: topDoc.chunks[0]?.snippet || topDoc.executiveSummary,
        confidence: 97.2,
      },
      {
        documentId: secondDoc.id,
        documentTitle: secondDoc.title,
        pageNumber: secondDoc.chunks[1]?.pageNumber || 8,
        snippet: secondDoc.chunks[1]?.snippet || secondDoc.executiveSummary,
        confidence: 95.8,
      },
    ],
    suggestedActions: [
      {
        id: `act-${Date.now()}-7`,
        title: 'Conduct Cross-Functional Executive Review',
        description: 'Review combined SecOps, FinOps, and Product milestones with leadership steering committee.',
        priority: 'high',
        department: 'Executive',
        dueDate: '2026-10-30',
      },
      {
        id: `act-${Date.now()}-8`,
        title: 'Review Tenant Data Isolation Cryptographic Spec',
        description: 'Confirm per-tenant KMS envelope keys comply with updated GDPR Article 28 guidelines.',
        priority: 'medium',
        department: 'Legal',
        dueDate: '2026-11-08',
      },
    ],
  };
}
