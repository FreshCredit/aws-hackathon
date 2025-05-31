import { getSession } from '@auth0/nextjs-auth0';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch user's transactions
    const result = await db.execute({
      sql: `SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 100`,
      args: [session.user.sub],
    });

    const transactions = result.rows;

    // Prepare transactions for analysis
    const transactionText = transactions
      .map((t: any) => `${t.date}: ${t.merchant} - $${t.amount} (${t.category})`)
      .join('\n');

    // Generate report using Claude via Bedrock
    const prompt = `You are a financial analyst. Given this user's recent transaction history, generate a plain-English summary of their monthly financial behavior, including spending habits, notable expenses, and overall flow. Here are their recent transactions:\n\n${transactionText}`;

    const response = await bedrock.send(new InvokeModelCommand({
      modelId: 'anthropic.claude-v2',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: 1000,
        temperature: 0.7,
        top_k: 250,
        top_p: 0.999,
        stop_sequences: ['\n\nHuman:'],
      }),
    }));

    const summary = JSON.parse(new TextDecoder().decode(response.body)).completion;

    // Store the report
    const reportId = nanoid();
    await db.execute({
      sql: `INSERT INTO reports (id, user_id, created_at, summary) VALUES (?, ?, ?, ?)`,
      args: [reportId, session.user.sub, new Date().toISOString(), summary],
    });

    return NextResponse.json({ reportId, summary });
  } catch (error) {
    console.error('Error generating report:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 