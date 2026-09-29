import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Load all documentation context
function loadDocsContext(): string {
  const docsDir = path.join(process.cwd(), 'docs');
  let context = 'Snake Arena Documentation Context:\n\n';

  try {
    const files = fs.readdirSync(docsDir);
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const filePath = path.join(docsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        context += `\n## ${file}\n${content}\n`;
      }
    }
  } catch (error) {
    context += 'Documentation files not found.';
  }

  return context;
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Load documentation context
    const docsContext = loadDocsContext();

    // Call Claude API with documentation context
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a helpful assistant for Snake Arena documentation. Answer questions based on the following documentation context. Be concise and accurate.

${docsContext}

Question: ${question}`,
        },
      ],
    });

    const answer = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({
      answer,
      model: message.model,
      usage: message.usage,
    });
  } catch (error) {
    console.error('Ask Docs API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process question',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Ask the Docs API is running',
    endpoint: 'POST /api/docs/ask',
  });
}