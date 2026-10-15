export type DocumentStatus = 'indexed' | 'indexing' | 'failed';

export type EntityType = 'regulation' | 'budget' | 'technology' | 'risk' | 'entity';

export interface ExtractedEntity {
  name: string;
  type: EntityType;
  confidence: number;
}

export interface DocumentChunk {
  id: string;
  pageNumber: number;
  title: string;
  snippet: string;
  tags: string[];
}

export interface KeyMetric {
  label: string;
  value: string;
  trend?: string;
}

export interface IngestedDocument {
  id: string;
  title: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'csv' | 'txt';
  uploadDate: string;
  fileSize: string;
  pageCount: number;
  status: DocumentStatus;
  confidenceScore: number;
  executiveSummary: string;
  entities: ExtractedEntity[];
  chunks: DocumentChunk[];
  keyMetrics: KeyMetric[];
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  snippet: string;
  confidence: number;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  department: 'SecOps' | 'FinOps' | 'DevOps' | 'Legal' | 'Executive' | 'Product';
  dueDate: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citations?: Citation[];
  suggestedActions?: SuggestedAction[];
  isStreaming?: boolean;
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  department: 'SecOps' | 'FinOps' | 'DevOps' | 'Legal' | 'Executive' | 'Product';
  dueDate: string;
  status: 'todo' | 'in_progress' | 'completed';
  sourceDocTitle?: string;
  sourcePage?: number;
  createdAt: string;
}
