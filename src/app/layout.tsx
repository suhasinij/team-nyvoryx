import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NYVORYX Enterprise Cognitive Memory & Copilot | Team NYVORYX',
  description:
    'AI-powered enterprise organizational memory and knowledge assistant with Document AI ingestion, Vertex-styled Copilot RAG citations, and actionable task generation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
