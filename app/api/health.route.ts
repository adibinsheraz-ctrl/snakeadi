'use server';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const startTime = Date.now();

    const health: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'pending',
        api: 'ok',
        auth: 'ok',
      },
    };

    // Try to check database connection
    try {
      const { createClient } = require('@/lib/supabase/client');
      const supabase = createClient();
      const { error } = await supabase.from('leaderboard').select('count', { count: 'exact', head: true });
      health.checks.database = error ? 'error' : 'ok';
    } catch (dbError) {
      health.checks.database = 'error';
    }

    const responseTime = Date.now() - startTime;
    health.responseTime = responseTime;

    return NextResponse.json(health, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}