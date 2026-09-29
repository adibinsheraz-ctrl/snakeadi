'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Download, Clock, Tag } from 'lucide-react';

const DOCS_NAV = [
  { title: 'Overview', href: '/docs' },
  { title: 'Phase 1: Foundation', href: '/docs/phase1' },
  { title: 'Phase 2: Snake Engine', href: '/docs/phase2' },
  { title: 'Phase 3: AI Docs', href: '/docs/phase3' },
  { title: 'Phase 4: Backend', href: '/docs/phase4' },
  { title: 'Phase 5: Testing', href: '/docs/phase5' },
  { title: 'Phase 6: Deployment', href: '/docs/phase6' },
  { title: 'API Reference', href: '/docs/api' },
  { title: 'Diagrams', href: '/docs/diagrams' },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskDocs, setShowAskDocs] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Snake Arena <span className="text-purple-400">Docs</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="h-4 w-4" />
              <span>Last synced: 2026-09-29 17:07 UTC</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-sm">
              <Tag className="h-3 w-3" />
              <span>v0.1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAskDocs(!showAskDocs)}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium hover:bg-purple-500 transition"
            >
              Ask the Docs
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5 transition">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex gap-8 px-4 py-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm placeholder:text-white/40 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {DOCS_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition"
                >
                  <FileText className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="prose prose-invert prose-purple max-w-none">
            {children}
          </div>
        </main>

        {/* Table of Contents (will be populated by MDX) */}
        <aside className="w-48 shrink-0">
          <div className="sticky top-24">
            <h4 className="mb-4 text-sm font-semibold text-white/60">On This Page</h4>
            <nav className="space-y-2 text-sm">
              {/* TOC will be generated from headings */}
            </nav>
          </div>
        </aside>
      </div>

      {/* Ask the Docs Modal */}
      {showAskDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur p-4">
          <div className="w-full max-w-2xl rounded-xl bg-slate-900 border border-white/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Ask the Docs</h3>
              <button
                onClick={() => setShowAskDocs(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-sm text-white/60">
              Ask questions about Snake Arena. Powered by Claude AI with documentation context.
            </p>
            <textarea
              placeholder="What's the game engine architecture?"
              className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 p-4 text-sm placeholder:text-white/40 focus:border-purple-500 focus:outline-none"
              rows={4}
            />
            <button className="w-full rounded-lg bg-purple-600 py-3 font-medium hover:bg-purple-500 transition">
              Ask Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}