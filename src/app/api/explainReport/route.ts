import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { reportId } = await req.json();

    // Fetch the report
    const result = await db.execute({
      sql: `SELECT summary FROM reports WHERE id = ? AND user_id = ?`,
      args: [reportId, session.user.sub],
    });

    if (!result.rows.length) {
      return new NextResponse('Report not found', { status: 404 });
    }

    const summary = result.rows[0].summary;

    // Get explanation from Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Explain the following financial report summary in simpler terms for a non-expert user:\n\n${summary}`,
      }],
    });

    return NextResponse.json({ explanation: message.content[0].text });
  } catch (error) {
    console.error('Error explaining report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 