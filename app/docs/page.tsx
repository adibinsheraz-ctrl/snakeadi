import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function DocsPage() {
  const docsDir = path.join(process.cwd(), 'docs');
  const indexPath = path.join(docsDir, 'phase1.mdx');

  let content = '';
  let frontmatter: any = {};

  try {
    const fileContent = fs.readFileSync(indexPath, 'utf8');
    const { data, content: mdxContent } = matter(fileContent);
    frontmatter = data;
    content = mdxContent;
  } catch (error) {
    content = `
# Welcome to Snake Arena Documentation

This documentation center provides comprehensive guides for the Snake Arena game.

## Quick Links

- [Phase 1: Foundation](/docs/phase1)
- [Phase 2: Snake Engine](/docs/phase2)
- [Phase 3: AI Documentation](/docs/phase3)
- [API Reference](/docs/api)

## Overview

Snake Arena is a premium 3D multiplayer snake game built with:

- Next.js 14 + TypeScript
- React Three Fiber for 3D rendering
- Supabase for real-time leaderboard
- AI-powered documentation

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Navigate to [http://localhost:3000](http://localhost:3000)

---

**Built by Adi Binsheraz** | [@adibinsheraz](https://instagram.com/adibinsheraz)
    `;
  }

  return (
    <article>
      {frontmatter.title && <h1>{frontmatter.title}</h1>}
      {frontmatter.description && (
        <p className="lead text-xl text-white/70">{frontmatter.description}</p>
      )}
      <MDXRemote source={content} />
    </article>
  );
}