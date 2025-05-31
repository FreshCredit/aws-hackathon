import { getSession } from '@auth0/nextjs-auth0';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
      },
    },
  })
);

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { public_token } = await req.json();
    
    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: public_token,
    });

    const access_token = exchangeResponse.data.access_token;

    // Get transactions for last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token,
      start_date: thirtyDaysAgo.toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    });

    // Store transactions in database
    const transactions = transactionsResponse.data.transactions;
    for (const transaction of transactions) {
      await db.execute({
        sql: `INSERT INTO transactions (id, user_id, date, amount, merchant, category) 
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          nanoid(),
          session.user.sub,
          transaction.date,
          transaction.amount,
          transaction.merchant_name || '',
          transaction.category?.[0] || '',
        ],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 