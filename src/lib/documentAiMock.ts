import { IngestedDocument } from '../types';

export interface DemoFileTemplate {
  name: string;
  filename: string;
  fileSize: string;
  category: string;
  pageCount: number;
  previewSummary: string;
}

export const DEMO_TEMPLATES: DemoFileTemplate[] = [
  {
    name: 'Q3 Pen-Test & Red Team Findings',
    filename: 'NYVORYX_RedTeam_PenTest_Q3.pdf',
    fileSize: '4.2 MB',
    category: 'Security',
    pageCount: 32,
    previewSummary:
      'Simulated adversarial penetration test assessing external API endpoints, Kubernetes ingress controller, and zero-day patch cadence.',
  },
  {
    name: 'FinOps BigQuery Slot Reservation Model',
    filename: 'BigQuery_Capacity_Optimization_Model.xlsx',
    fileSize: '1.9 MB',
    category: 'FinOps',
    pageCount: 16,
    previewSummary:
      'Predictive analysis of BigQuery editions vs flat-rate slots yielding 34% cost savings across high-concurrency analytical pipelines.',
  },
  {
    name: 'Enterprise AI Safety & Governance Charter',
    filename: 'NYVORYX_AI_Safety_Charter_v2.pdf',
    fileSize: '2.1 MB',
    category: 'Legal & Compliance',
    pageCount: 22,
    previewSummary:
      'Formal policy on retrieval-augmented generation data residency, tenant isolation, PII filtering, and human-in-the-loop audit trails.',
  },
];

export async function simulateDocumentParsing(
  file: { name: string; size?: number },
  onProgress?: (step: string, percent: number) => void
): Promise<IngestedDocument> {
  const steps = [
    { label: 'Initializing Document AI OCR Engine...', progress: 15 },
    { label: 'Decomposing Document Layout & Hierarchy...', progress: 38 },
    { label: 'Extracting Named Entities & Table Structures...', progress: 65 },
    { label: 'Generating Semantic Vectors (text-embedding-004)...', progress: 85 },
    { label: 'Finalizing Organizational Memory Index...', progress: 100 },
  ];

  for (const step of steps) {
    if (onProgress) {
      onProgress(step.label, step.progress);
    }
    // Realistic micro-delay
    await new Promise((resolve) => setTimeout(resolve, 380));
  }

  const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  const generatedId = `doc-${Date.now().toString(36)}`;
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const validExt = ['pdf', 'docx', 'csv', 'txt'].includes(fileExt)
    ? (fileExt as 'pdf' | 'docx' | 'csv' | 'txt')
    : 'pdf';

  return {
    id: generatedId,
    title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
    filename: file.name,
    fileType: validExt,
    uploadDate: new Date().toISOString().split('T')[0],
    fileSize: file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '3.1 MB',
    pageCount: Math.floor(Math.random() * 25) + 12,
    status: 'indexed',
    confidenceScore: parseFloat((96.5 + Math.random() * 3.3).toFixed(1)),
    executiveSummary: `Automated Document AI synthesis for ${file.name}. Fully indexed with high semantic resolution across organizational operational memory. Contains actionable findings and cross-functional metrics.`,
    keyMetrics: [
      { label: 'Extraction Confidence', value: '98.7%', trend: 'High Precision' },
      { label: 'Entities Recognized', value: '18 Identified' },
      { label: 'Vector Resolution', value: '1,536 Dim' },
    ],
    entities: [
      { name: 'Document AI Pipeline', type: 'technology', confidence: 99.1 },
      { name: 'Enterprise Data Residency', type: 'regulation', confidence: 97.5 },
      { name: 'Operational Risk Vector', type: 'risk', confidence: 94.8 },
      { name: 'NYVORYX Memory Mesh', type: 'entity', confidence: 98.9 },
    ],
    chunks: [
      {
        id: `chunk-${Date.now()}-1`,
        pageNumber: 1,
        title: 'Executive Ingestion Overview',
        snippet: `Successfully processed ${file.name}. Document AI extracted structured tables, metadata key-values, and semantic embeddings into the NYVORYX vector knowledge graph.`,
        tags: ['Document AI', 'Ingestion', 'Synthesis'],
      },
      {
        id: `chunk-${Date.now()}-2`,
        pageNumber: 7,
        title: 'Operational Recommendations',
        snippet: `Cross-referencing against active compliance standards indicates full alignment with zero-trust storage standards and immediate readiness for Copilot Q&A queries.`,
        tags: ['Compliance', 'Operations'],
      },
    ],
  };
}
