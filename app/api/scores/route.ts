import { z } from 'zod';

const ScoreSchema = z.object({
  playerName: z.string().min(2).max(30),
  score: z.number().min(0).max(999999),
  gameMode: z.enum(['classic', 'endless', 'time-attack']),
  difficulty: z.enum(['easy', 'normal', 'hard', 'expert']),
  duration: z.number().min(1).optional().default(0),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = ScoreSchema.parse(body);

    // Map camelCase to snake_case for database
    const dbRecord = {
      player_name: validated.playerName,
      score: validated.score,
      game_mode: validated.gameMode,
      difficulty: validated.difficulty,
      duration: validated.duration,
      verified: false,
      created_at: new Date().toISOString(),
    };

    // For now, just acknowledge the submission
    // Database integration will be complete after env setup
    return Response.json({ ok: true, score: dbRecord });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    );
  }
}