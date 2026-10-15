import { IngestedDocument, ActionTask, ChatMessage } from '../types';

export const INITIAL_DOCUMENTS: IngestedDocument[] = [
  {
    id: 'doc-001',
    title: 'NYVORYX Q3 Enterprise Security & Compliance Audit',
    filename: 'NYVORYX_Q3_Enterprise_Audit_Report.pdf',
    fileType: 'pdf',
    uploadDate: '2026-10-12',
    fileSize: '3.4 MB',
    pageCount: 38,
    status: 'indexed',
    confidenceScore: 98.6,
    executiveSummary:
      'Annual SOC-2 Type II independent assessment and penetration test report. Highlights 2 critical IAM role bloat issues, unencrypted legacy staging buckets, and recommends immediate transition to automated KMS envelope key rotation.',
    keyMetrics: [
      { label: 'Compliance Score', value: '94.2%', trend: '+3.1%' },
      { label: 'Unresolved CVEs', value: '3 High', trend: '-5 from Q2' },
      { label: 'Audit Scope', value: '14 Core Clusters' },
    ],
    entities: [
      { name: 'SOC-2 Type II', type: 'regulation', confidence: 99.1 },
      { name: 'ISO/IEC 27001', type: 'regulation', confidence: 97.8 },
      { name: 'AWS KMS Key Rotation', type: 'technology', confidence: 96.4 },
      { name: 'IAM Role Over-Privilege', type: 'risk', confidence: 98.2 },
      { name: 'Zero-Trust Bastion', type: 'technology', confidence: 95.0 },
    ],
    chunks: [
      {
        id: 'chunk-101',
        pageNumber: 4,
        title: 'Executive Summary & Threat Landscape',
        snippet:
          'NYVORYX completed its external security audit for Q3 2026. The auditor noted robust perimeter defenses, but identified stale service account keys and 3 high-priority misconfigurations in legacy staging environments.',
        tags: ['Security', 'Audit', 'Executive'],
      },
      {
        id: 'chunk-102',
        pageNumber: 14,
        title: 'IAM Access Reviews & Role Bloat Analysis',
        snippet:
          'Audit finding SEC-2026-88: 18 DevOps service accounts possess administrative wildcard (*) permissions across production S3 and RDS instances. Recommendation: Implement least-privilege RBAC policies within 14 business days.',
        tags: ['IAM', 'Compliance', 'Risk'],
      },
      {
        id: 'chunk-103',
        pageNumber: 22,
        title: 'Data-at-Rest Encryption & Key Management',
        snippet:
          'While production storage adheres to AES-256 GCM encryption, staging backups older than 90 days were discovered using default AWS-managed keys rather than customer-managed KMS keys with mandatory 90-day rotation schedules.',
        tags: ['KMS', 'Encryption', 'SecOps'],
      },
    ],
  },
  {
    id: 'doc-002',
    title: 'Global Cloud Modernization & FinOps Architecture 2027',
    filename: 'Global_Cloud_Migration_Strategy_2027.pdf',
    fileType: 'pdf',
    uploadDate: '2026-10-10',
    fileSize: '5.1 MB',
    pageCount: 52,
    status: 'indexed',
    confidenceScore: 97.4,
    executiveSummary:
      'Strategic architectural blueprint for migrating legacy monolithic data stores to Google Cloud Platform (BigQuery, Spanner, and GKE). Outlines a 4-phase rollout targeting a $6.8M annualized Capex reduction and sub-50ms global query latencies.',
    keyMetrics: [
      { label: 'Capex Savings', value: '$6.8M / yr', trend: 'Target H2 2027' },
      { label: 'Migration Phases', value: '4 Milestones' },
      { label: 'Target Latency', value: '< 45ms P99' },
    ],
    entities: [
      { name: 'Google BigQuery', type: 'technology', confidence: 99.4 },
      { name: 'Cloud Spanner', type: 'technology', confidence: 98.7 },
      { name: '$6.8M Capex Reduction', type: 'budget', confidence: 99.0 },
      { name: 'GKE Kubernetes 1.30', type: 'technology', confidence: 96.9 },
      { name: 'Database Cutover Risk', type: 'risk', confidence: 94.5 },
    ],
    chunks: [
      {
        id: 'chunk-201',
        pageNumber: 8,
        title: 'Architecture Vision & Target State',
        snippet:
          'The NYVORYX target architecture transitions relational transaction engines to Google Cloud Spanner multi-region instances, while federating analytical processing through serverless BigQuery slots with real-time CDC replication.',
        tags: ['Cloud', 'Architecture', 'BigQuery'],
      },
      {
        id: 'chunk-202',
        pageNumber: 19,
        title: 'Financial Projections & FinOps Optimization',
        snippet:
          'By deprecating legacy on-premise Oracle clusters and adopting BigQuery on-demand compute with committed use discounts (CUD), NYVORYX will achieve an annualized Capex and licensing reduction of $6.8M by end of Q4 2027.',
        tags: ['FinOps', 'Budget', 'Savings'],
      },
      {
        id: 'chunk-203',
        pageNumber: 33,
        title: 'Phased Cutover Schedule & Risk Mitigation',
        snippet:
          'Phase 2 begins in January 2027 with dual-write replication to Cloud Spanner. A zero-downtime cutover rehearsal is scheduled for March 15, with automatic fallback telemetry monitored via Cloud Operations Suite.',
        tags: ['Migration', 'Timeline', 'DevOps'],
      },
    ],
  },
  {
    id: 'doc-003',
    title: 'NYVORYX Executive Product Roadmap & AI Core H2',
    filename: 'Executive_Product_Roadmap_H2.pdf',
    fileType: 'pdf',
    uploadDate: '2026-10-08',
    fileSize: '2.8 MB',
    pageCount: 26,
    status: 'indexed',
    confidenceScore: 99.2,
    executiveSummary:
      'Strategic executive product roadmap detailing the rollout of the NYVORYX Autonomous Organizational Memory system. Outlines integrations with Slack, Google Workspace, and Microsoft Teams, supported by fine-grained enterprise RBAC and a 99.99% SLA.',
    keyMetrics: [
      { label: 'Target SLA', value: '99.99%', trend: 'Enterprise Tier' },
      { label: 'Active Connectors', value: '6 Ecosystems' },
      { label: 'Query Response', value: '< 250ms' },
    ],
    entities: [
      { name: 'Organizational Memory Core', type: 'technology', confidence: 99.5 },
      { name: 'Enterprise 99.99% SLA', type: 'regulation', confidence: 98.1 },
      { name: 'Google Workspace Connector', type: 'technology', confidence: 96.8 },
      { name: 'Role-Based Access Control', type: 'regulation', confidence: 97.4 },
    ],
    chunks: [
      {
        id: 'chunk-301',
        pageNumber: 3,
        title: 'Mission & Product Objectives',
        snippet:
          'Team NYVORYX is building the intelligent cognitive substrate for the enterprise. By automatically capturing, indexing, and surfacing organizational knowledge, we eliminate knowledge silos and accelerate decision latency across distributed teams.',
        tags: ['Mission', 'Product', 'AI'],
      },
      {
        id: 'chunk-302',
        pageNumber: 11,
        title: 'H2 Milestones & Launch Windows',
        snippet:
          'Key Milestone M3: General Availability of the Document AI dropzone and multimodal Copilot feed is scheduled for November 2026. Beta testing with 12 enterprise pilot accounts showed a 68% decrease in onboarding search time.',
        tags: ['Milestones', 'Roadmap', 'Launch'],
      },
      {
        id: 'chunk-303',
        pageNumber: 18,
        title: 'Security & Enterprise Compliance Controls',
        snippet:
          'All document vectors and extracted semantic entities are cryptographically partitioned per enterprise tenant. Customer data is never used to train generalized foundation models without explicit contractual consent.',
        tags: ['Security', 'Privacy', 'Compliance'],
      },
    ],
  },
];

export const INITIAL_TASKS: ActionTask[] = [
  {
    id: 'task-001',
    title: 'Remediate 18 Over-Privileged DevOps Service Accounts',
    description:
      'Implement least-privilege IAM policies and revoke wildcard (*) permissions on production S3/RDS as mandated by SOC-2 finding SEC-2026-88.',
    priority: 'critical',
    department: 'SecOps',
    dueDate: '2026-10-26',
    status: 'in_progress',
    sourceDocTitle: 'NYVORYX Q3 Enterprise Security & Compliance Audit',
    sourcePage: 14,
    createdAt: '2026-10-14T09:15:00Z',
  },
  {
    id: 'task-002',
    title: 'Finalize Cloud Spanner Dual-Write Rehearsal Runbook',
    description:
      'Draft step-by-step failover execution plan and verify zero-downtime automated fallback mechanisms before March 15 cutover.',
    priority: 'high',
    department: 'DevOps',
    dueDate: '2026-11-05',
    status: 'todo',
    sourceDocTitle: 'Global Cloud Modernization & FinOps Architecture 2027',
    sourcePage: 33,
    createdAt: '2026-10-14T10:00:00Z',
  },
  {
    id: 'task-003',
    title: 'Validate Enterprise 99.99% SLA Monitoring Dashboard',
    description:
      'Configure real-time synthetic latency alerts and automated pager escalation for the NYVORYX Organizational Memory API gateway.',
    priority: 'medium',
    department: 'Product',
    dueDate: '2026-11-12',
    status: 'todo',
    sourceDocTitle: 'NYVORYX Executive Product Roadmap & AI Core H2',
    sourcePage: 18,
    createdAt: '2026-10-14T11:30:00Z',
  },
  {
    id: 'task-004',
    title: 'Execute FinOps Oracle License Decommissioning Plan',
    description:
      'Audit legacy CPU core allocations and prepare termination notices to unlock the projected $6.8M Capex reduction.',
    priority: 'high',
    department: 'FinOps',
    dueDate: '2026-11-20',
    status: 'todo',
    sourceDocTitle: 'Global Cloud Modernization & FinOps Architecture 2027',
    sourcePage: 19,
    createdAt: '2026-10-14T12:00:00Z',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    sender: 'user',
    timestamp: '10:41 AM',
    content: 'What are the most urgent security vulnerabilities identified in the Q3 audit report?',
  },
  {
    id: 'msg-002',
    sender: 'assistant',
    timestamp: '10:41 AM',
    content:
      'Based on the **NYVORYX Q3 Enterprise Security & Compliance Audit**, the most urgent findings requiring immediate remediation are:\n\n1. **IAM Role Over-Privilege (SEC-2026-88)**: 18 DevOps service accounts have administrative wildcard (`*`) access to production S3 and RDS storage.\n2. **KMS Key Rotation Gaps**: Staging storage backups older than 90 days are utilizing default AWS-managed keys without automated 90-day customer-managed rotation.\n3. **Legacy Staging Misconfigurations**: 3 high-severity CVEs were detected in unpatched staging container images.\n\nImmediate recommendation: Enforce automated least-privilege RBAC within 14 business days to maintain SOC-2 Type II attestation.',
    citations: [
      {
        documentId: 'doc-001',
        documentTitle: 'NYVORYX Q3 Enterprise Security & Compliance Audit',
        pageNumber: 14,
        snippet:
          'Audit finding SEC-2026-88: 18 DevOps service accounts possess administrative wildcard (*) permissions across production S3 and RDS instances. Recommendation: Implement least-privilege RBAC policies within 14 business days.',
        confidence: 98.4,
      },
      {
        documentId: 'doc-001',
        documentTitle: 'NYVORYX Q3 Enterprise Security & Compliance Audit',
        pageNumber: 22,
        snippet:
          'While production storage adheres to AES-256 GCM encryption, staging backups older than 90 days were discovered using default AWS-managed keys rather than customer-managed KMS keys with mandatory 90-day rotation schedules.',
        confidence: 96.2,
      },
    ],
    suggestedActions: [
      {
        id: 'sug-001',
        title: 'Revoke Wildcard IAM Rights for 18 DevOps Accounts',
        description: 'Transition all 18 service accounts to scoped least-privilege IAM policies within 14 days.',
        priority: 'critical',
        department: 'SecOps',
        dueDate: '2026-10-26',
      },
      {
        id: 'sug-002',
        title: 'Migrate Staging Backups to Customer-Managed KMS Keys',
        description: 'Enable automated 90-day envelope key rotation on staging data stores.',
        priority: 'high',
        department: 'SecOps',
        dueDate: '2026-11-02',
      },
    ],
  },
];
